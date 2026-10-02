import { useMutation, useQueryClient, type QueryClient } from '@tanstack/react-query';

import { sendMessage } from '@/shared/api';

import { mergeChatMessages } from '../model/merge-chat-messages';
import { useChatStore } from '../model/chat.store';
import type { ChatMessage } from '../model/chat.types';
import { chatKeys } from './chat-keys';

type SendChatMessageVariables = {
  text: string;
  retryMessageId?: string;
};

function createOptimisticMessage(
  chatId: string,
  { text, retryMessageId }: SendChatMessageVariables,
): ChatMessage {
  return {
    id: retryMessageId ?? crypto.randomUUID(),
    chatId,
    text,
    direction: 'outgoing',
    timestamp: Math.floor(Date.now() / 1000),
    status: 'sending',
  };
}

function addOptimisticMessage(queryClient: QueryClient, message: ChatMessage) {
  queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(message.chatId), (messages) =>
    mergeChatMessages(messages, [message]),
  );
}

function replaceOptimisticMessage(
  queryClient: QueryClient,
  optimisticMessageId: string,
  sentMessage: ChatMessage,
) {
  queryClient.setQueryData<ChatMessage[]>(
    chatKeys.messages(sentMessage.chatId),
    (messages = []) => {
      const optimisticMessage = messages.find((message) => message.id === optimisticMessageId);
      const messagesWithoutOptimistic = messages.filter(
        (message) => message.id !== optimisticMessageId,
      );

      return mergeChatMessages(messagesWithoutOptimistic, [
        {
          ...sentMessage,
          timestamp: optimisticMessage?.timestamp ?? sentMessage.timestamp,
        },
      ]);
    },
  );
}

function markMessageAsFailed(queryClient: QueryClient, chatId: string, messageId: string) {
  queryClient.setQueryData<ChatMessage[]>(chatKeys.messages(chatId), (messages = []) =>
    messages.map((message) =>
      message.id === messageId ? { ...message, status: 'failed' } : message,
    ),
  );
}

export function useSendChatMessage(chatId: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text }: SendChatMessageVariables) => sendMessage({ chatId, message: text }),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: chatKeys.messages(chatId) });

      const optimisticMessage = createOptimisticMessage(chatId, variables);

      addOptimisticMessage(queryClient, optimisticMessage);
      useChatStore
        .getState()
        .updateChatPreview(chatId, optimisticMessage.text, optimisticMessage.timestamp);

      return { optimisticMessageId: optimisticMessage.id };
    },
    onSuccess: (response, { text }, context) => {
      if (!context) {
        return;
      }

      replaceOptimisticMessage(queryClient, context.optimisticMessageId, {
        id: response.idMessage,
        chatId,
        text,
        direction: 'outgoing',
        timestamp: Math.floor(Date.now() / 1000),
        status: 'sent',
      });
    },
    onError: (_, __, context) => {
      if (!context) {
        return;
      }

      markMessageAsFailed(queryClient, chatId, context.optimisticMessageId);
    },
  });
}
