import { Fragment } from 'react';
import {
  ChatContainer,
  ConversationHeader,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
} from '@chatscope/chat-ui-kit-react';

import type { ChatMessageViewModel } from './chat-workspace.types';
import { formatMessageDate, formatTime, getDateKey, getStatusLabel } from './formatters';

type MessageBubbleProps = {
  message: ChatMessageViewModel;
  onRetry: (messageId: string) => void;
};

function MessageBubble({ message, onRetry }: MessageBubbleProps) {
  const sentTime = `${formatTime(message.timestamp)}${
    message.direction === 'outgoing' ? ` · ${getStatusLabel(message.status)}` : ''
  }`;

  return (
    <Message
      model={{
        message: message.text,
        direction: message.direction,
        position: 'single',
        type: 'text',
      }}
    >
      <Message.Footer>
        <span className="cs-message__sent-time">{sentTime}</span>
        {message.status === 'failed' ? (
          <button type="button" className="ml-2 underline" onClick={() => onRetry(message.id)}>
            Повторить
          </button>
        ) : null}
      </Message.Footer>
    </Message>
  );
}

type MessageComposerProps = {
  as?: typeof MessageInput | null;
  value: string;
  maxLength: number;
  disabled: boolean;
  onChange: (value: string) => void;
  onSend: () => void;
};

function MessageComposer({ value, maxLength, disabled, onChange, onSend }: MessageComposerProps) {
  const isMaxLengthReached = value.length === maxLength;

  return (
    <div className="mt-auto shrink-0 bg-[#f7f8fa]">
      <MessageInput
        value={value}
        placeholder="Сообщение"
        attachButton={false}
        sendButton
        disabled={disabled}
        sendDisabled={!value.trim() || disabled}
        onChange={(_, textContent) => onChange(textContent.slice(0, maxLength))}
        onSend={onSend}
      />
      <span
        className={`block px-4 pb-1 text-right text-xs ${
          isMaxLengthReached ? 'text-destructive' : 'text-muted-foreground'
        }`}
      >
        {value.length}/{maxLength}
      </span>
    </div>
  );
}

type ChatConversationViewProps = {
  name: string;
  phoneNumber: string;
  chatId: string;
  messages: ChatMessageViewModel[];
  isLoading: boolean;
  draft: string;
  maxMessageLength: number;
  isSending: boolean;
  onBack: () => void;
  onDraftChange: (value: string) => void;
  onSend: () => void;
  onRetry: (messageId: string) => void;
};

export function ChatConversationView({
  name,
  phoneNumber,
  chatId,
  messages,
  isLoading,
  draft,
  maxMessageLength,
  isSending,
  onBack,
  onDraftChange,
  onSend,
  onRetry,
}: ChatConversationViewProps) {
  const now = new Date();

  return (
    <ChatContainer className="whatsapp-chat-container">
      <ConversationHeader>
        <ConversationHeader.Back onClick={onBack} />
        <ConversationHeader.Content
          userName={name}
          info={phoneNumber ? `+${phoneNumber}` : chatId}
        />
      </ConversationHeader>
      <MessageList
        loading={isLoading}
        autoScrollToBottom
        autoScrollToBottomOnMount
        scrollBehavior="smooth"
      >
        {messages.map((message, index, messageList) => {
          const previousMessage = messageList[index - 1];
          const startsNewDay =
            !previousMessage ||
            getDateKey(previousMessage.timestamp) !== getDateKey(message.timestamp);

          return (
            <Fragment key={message.id}>
              {startsNewDay ? (
                <MessageSeparator>{formatMessageDate(message.timestamp, now)}</MessageSeparator>
              ) : null}
              <MessageBubble message={message} onRetry={onRetry} />
            </Fragment>
          );
        })}
      </MessageList>
      <MessageComposer
        as={MessageInput}
        value={draft}
        maxLength={maxMessageLength}
        disabled={isSending}
        onChange={onDraftChange}
        onSend={onSend}
      />
    </ChatContainer>
  );
}
