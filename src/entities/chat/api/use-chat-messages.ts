import { useQuery, useQueryClient } from '@tanstack/react-query';

import { getChatHistory, type ChatHistoryMessage } from '@/shared/api';

import { mergeChatMessages } from '../model/merge-chat-messages';
import type { ChatMessage, ChatMessageStatus } from '../model/chat.types';
import { chatKeys } from './chat-keys';

function normalizeStatus(status?: string): ChatMessageStatus | undefined {
  if (status === 'sent' || status === 'delivered' || status === 'read' || status === 'failed') {
    return status;
  }

  return status === 'pending' ? 'sending' : undefined;
}

function normalizeHistoryMessage(message: ChatHistoryMessage, chatId: string): ChatMessage | null {
  const text = message.textMessage ?? message.extendedTextMessage?.text;

  if (!text) {
    return null;
  }

  return {
    id: message.idMessage,
    chatId,
    text,
    direction: message.type,
    timestamp: message.timestamp,
    status: message.type === 'outgoing' ? normalizeStatus(message.statusMessage) : undefined,
  };
}

function normalizeChatHistory(history: ChatHistoryMessage[], chatId: string): ChatMessage[] {
  return history
    .map((message) => normalizeHistoryMessage(message, chatId))
    .filter((message): message is ChatMessage => message !== null)
    .reverse();
}

function applyHistoryStatuses(messages: ChatMessage[], history: ChatMessage[]): ChatMessage[] {
  const historyStatusByMessageId = new Map(history.map((message) => [message.id, message.status]));

  return messages.map((message) => {
    const historyStatus = historyStatusByMessageId.get(message.id);

    return historyStatus ? { ...message, status: historyStatus } : message;
  });
}

function mergeHistoryWithCachedMessages(
  history: ChatMessage[],
  cachedMessages: ChatMessage[] = [],
): ChatMessage[] {
  const mergedMessages = mergeChatMessages(history, cachedMessages);

  return applyHistoryStatuses(mergedMessages, history);
}

export function useChatMessages(chatId: string | null) {
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: chatKeys.messages(chatId ?? ''),
    queryFn: async ({ signal }) => {
      const history = await getChatHistory(chatId!, 100, signal);
      const normalizedHistory = normalizeChatHistory(history, chatId!);
      const cachedMessages = queryClient.getQueryData<ChatMessage[]>(chatKeys.messages(chatId!));

      return mergeHistoryWithCachedMessages(normalizedHistory, cachedMessages);
    },
    enabled: Boolean(chatId),
  });
}
