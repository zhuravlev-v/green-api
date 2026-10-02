import type { ReactNode } from 'react';
import {
  ChatContainer,
  Conversation,
  ConversationList,
  MainContainer,
  MessageList,
  Sidebar,
} from '@chatscope/chat-ui-kit-react';
import { MessageCirclePlus, WifiOff } from 'lucide-react';

import { Button } from '@/shared/ui/button';

import type { ChatListItemViewModel } from './chat-workspace.types';
import { formatTime } from './formatters';

type ChatListProps = {
  chats: ChatListItemViewModel[];
  onOpenChat: (chatId: string) => void;
};

function ChatList({ chats, onOpenChat }: ChatListProps) {
  return (
    <>
      <ConversationList>
        {chats.map((chat) => (
          <Conversation
            key={chat.id}
            name={chat.name}
            info={chat.lastMessage || undefined}
            lastActivityTime={formatTime(chat.lastTimestamp)}
            unreadCnt={chat.unreadCount}
            active={chat.active}
            onClick={() => onOpenChat(chat.id)}
          />
        ))}
      </ConversationList>
      {chats.length === 0 ? (
        <div className="px-6 py-12 text-center text-sm text-muted-foreground">
          Создайте первый чат по номеру телефона
        </div>
      ) : null}
    </>
  );
}

type EmptyChatProps = {
  onNewChat: () => void;
};

function EmptyChat({ onNewChat }: EmptyChatProps) {
  return (
    <ChatContainer className="whatsapp-chat-container whatsapp-empty-chat">
      <MessageList>
        <div className="flex h-full flex-col items-center justify-center px-6 text-center">
          <div className="mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCirclePlus className="size-8" />
          </div>
          <h2 className="text-xl font-semibold">GREEN-API WhatsApp</h2>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Выберите существующий диалог или создайте новый чат по номеру телефона.
          </p>
          <Button className="mt-5" onClick={onNewChat}>
            Новый чат
          </Button>
        </div>
      </MessageList>
    </ChatContainer>
  );
}

type ChatWorkspaceViewProps = {
  chats: ChatListItemViewModel[];
  activeChatContent: ReactNode;
  isReconnecting: boolean;
  onOpenChat: (chatId: string) => void;
  onNewChat: () => void;
};

export function ChatWorkspaceView({
  chats,
  activeChatContent,
  isReconnecting,
  onOpenChat,
  onNewChat,
}: ChatWorkspaceViewProps) {
  const hasActiveChat = Boolean(activeChatContent);

  return (
    <div className="relative min-h-0 flex-1">
      {isReconnecting ? (
        <div className="absolute top-2 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2 rounded-full bg-amber-100 px-4 py-2 text-xs text-amber-900 shadow">
          <WifiOff className="size-3.5" />
          Восстанавливаем получение сообщений…
        </div>
      ) : null}

      <MainContainer responsive className="whatsapp-main-container">
        <Sidebar
          position="left"
          className={
            hasActiveChat ? 'whatsapp-sidebar whatsapp-sidebar--chat-open' : 'whatsapp-sidebar'
          }
        >
          <div className="flex h-16 items-center justify-between border-b bg-white px-4">
            <div>
              <p className="font-semibold">Чаты</p>
              <p className="text-xs text-muted-foreground">Только текстовые сообщения</p>
            </div>
            <Button type="button" size="icon" onClick={onNewChat} aria-label="Создать чат">
              <MessageCirclePlus />
            </Button>
          </div>
          <ChatList chats={chats} onOpenChat={onOpenChat} />
        </Sidebar>

        {activeChatContent ?? <EmptyChat onNewChat={onNewChat} />}
      </MainContainer>
    </div>
  );
}
