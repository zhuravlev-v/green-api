import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import * as z from 'zod';

import {
  chatKeys,
  findChatByIdentifier,
  mergeChatMessages,
  useChatStore,
  type ChatMessage,
} from '@/entities/chat';
import { deleteNotification, receiveNotification } from '@/shared/api';

import { extractPhoneNumber } from '../model/phone';

const incomingTextNotificationSchema = z.object({
  typeWebhook: z.literal('incomingMessageReceived'),
  timestamp: z.number(),
  idMessage: z.string(),
  senderData: z.object({
    chatId: z.string(),
    chatName: z.string().optional(),
    senderName: z.string().optional(),
    senderContactName: z.string().optional(),
  }),
  messageData: z.object({
    typeMessage: z.literal('textMessage'),
    textMessageData: z.object({
      textMessage: z.string(),
    }),
  }),
});

const outgoingMessageStatusNotificationSchema = z.object({
  typeWebhook: z.literal('outgoingMessageStatus'),
  chatId: z.string(),
  idMessage: z.string(),
  status: z.enum(['sent', 'delivered', 'read', 'failed']),
});

export type NotificationsPollingStatus = 'idle' | 'connected' | 'reconnecting';

function wait(delay: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve) => {
    const timeoutId = window.setTimeout(resolve, delay);
    signal.addEventListener(
      'abort',
      () => {
        window.clearTimeout(timeoutId);
        resolve();
      },
      { once: true },
    );
  });
}

export function useNotificationsPolling(enabled: boolean): NotificationsPollingStatus {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<NotificationsPollingStatus>('idle');

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const controller = new AbortController();

    const processNotification = (body: unknown) => {
      const outgoingStatus = outgoingMessageStatusNotificationSchema.safeParse(body);

      if (outgoingStatus.success) {
        const notification = outgoingStatus.data;
        const store = useChatStore.getState();
        const chat = findChatByIdentifier(store.chats, notification.chatId);
        const chatId = chat?.chatId ?? notification.chatId;

        queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(chatId), (messages) =>
          messages?.map((message) =>
            message.id === notification.idMessage
              ? { ...message, status: notification.status }
              : message,
          ),
        );
        return;
      }

      const parsed = incomingTextNotificationSchema.safeParse(body);

      if (!parsed.success || parsed.data.senderData.chatId.endsWith('@g.us')) {
        return;
      }

      const notification = parsed.data;
      const sourceChatId = notification.senderData.chatId;
      const phoneNumber = extractPhoneNumber(sourceChatId);
      const store = useChatStore.getState();
      const existing = findChatByIdentifier(store.chats, sourceChatId, phoneNumber);
      const chatId = store.upsertChat({
        chatId: existing?.chatId ?? sourceChatId,
        aliases: [sourceChatId],
        phoneNumber: phoneNumber || existing?.phoneNumber || '',
        name:
          notification.senderData.senderContactName ||
          notification.senderData.senderName ||
          notification.senderData.chatName ||
          existing?.name ||
          (phoneNumber ? `+${phoneNumber}` : sourceChatId),
      });
      const message: ChatMessage = {
        id: notification.idMessage,
        chatId,
        text: notification.messageData.textMessageData.textMessage,
        direction: 'incoming',
        timestamp: notification.timestamp,
      };
      const currentMessages = queryClient.getQueryData<ChatMessage[]>(chatKeys.messages(chatId));
      const isDuplicate = currentMessages?.some((item) => item.id === message.id) ?? false;

      queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(chatId), (messages) =>
        mergeChatMessages(messages, [message]),
      );

      if (!isDuplicate) {
        useChatStore.getState().updateChatPreview(chatId, message.text, message.timestamp, true);
      }
    };

    const poll = async () => {
      let retryDelay = 1000;

      while (!controller.signal.aborted) {
        try {
          const notification = await receiveNotification(60, controller.signal);

          if (controller.signal.aborted) {
            return;
          }

          setStatus('connected');
          retryDelay = 1000;

          if (!notification) {
            continue;
          }

          processNotification(notification.body);
          const deletion = await deleteNotification(notification.receiptId);

          if (!deletion.result) {
            throw new Error(deletion.reason || 'Не удалось подтвердить уведомление');
          }
        } catch (error) {
          if (
            controller.signal.aborted ||
            (error instanceof DOMException && error.name === 'AbortError')
          ) {
            return;
          }

          setStatus('reconnecting');
          await wait(retryDelay, controller.signal);
          retryDelay = Math.min(retryDelay * 2, 15_000);
        }
      }
    };

    void poll();

    return () => controller.abort();
  }, [enabled, queryClient]);

  return enabled ? status : 'idle';
}
