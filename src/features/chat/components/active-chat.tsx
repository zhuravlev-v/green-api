import { useEffect, useMemo, useState } from 'react';

import { useChatMessages, useChatStore, useSendChatMessage } from '@/entities/chat';
import {
  ChatConversationView,
  type ChatMessageViewModel,
} from '@/shared/components/chat-workspace';

import { MAX_MESSAGE_LENGTH } from '../model/constants';

type ActiveChatProps = {
  chatId: string;
  name: string;
  phoneNumber: string;
  onBack: () => void;
};

export function ActiveChat({ chatId, name, phoneNumber, onBack }: ActiveChatProps) {
  const [message, setMessage] = useState('');
  const messages = useChatMessages(chatId);
  const sendMessage = useSendChatMessage(chatId);
  const messageViewModels = useMemo<ChatMessageViewModel[]>(
    () =>
      (messages.data ?? []).map((item) => ({
        id: item.id,
        text: item.text,
        direction: item.direction,
        timestamp: item.timestamp,
        status: item.status,
      })),
    [messages.data],
  );

  useEffect(() => {
    const latestMessage = messages.data?.at(-1);

    if (latestMessage) {
      useChatStore
        .getState()
        .hydrateChatPreview(chatId, latestMessage.text, latestMessage.timestamp);
    }
  }, [chatId, messages.data]);

  const submit = (text = message, retryMessageId?: string) => {
    const normalizedText = text.trim();

    if (!normalizedText || normalizedText.length > MAX_MESSAGE_LENGTH || sendMessage.isPending) {
      return;
    }

    sendMessage.mutate({ text: normalizedText, retryMessageId });
    setMessage('');
  };

  const retry = (messageId: string) => {
    const failedMessage = messages.data?.find((item) => item.id === messageId);

    if (failedMessage) {
      submit(failedMessage.text, failedMessage.id);
    }
  };

  return (
    <ChatConversationView
      name={name}
      phoneNumber={phoneNumber}
      chatId={chatId}
      messages={messageViewModels}
      isLoading={messages.isPending}
      draft={message}
      maxMessageLength={MAX_MESSAGE_LENGTH}
      isSending={sendMessage.isPending}
      onBack={onBack}
      onDraftChange={setMessage}
      onSend={() => submit()}
      onRetry={retry}
    />
  );
}
