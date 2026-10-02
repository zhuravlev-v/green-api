import { useMemo, useState } from 'react';

import { useChatStore, useReadChat } from '@/entities/chat';
import { ChatWorkspaceView, type ChatListItemViewModel } from '@/shared/components/chat-workspace';

import type { NotificationsPollingStatus } from '../hooks/use-notifications-polling';
import { ActiveChat } from './active-chat';
import { NewChatDialog } from './new-chat-dialog';

type ChatWorkspaceProps = {
  pollingStatus: NotificationsPollingStatus;
};

export function ChatWorkspace({ pollingStatus }: ChatWorkspaceProps) {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const chats = useChatStore((state) => state.chats);
  const activeChatId = useChatStore((state) => state.activeChatId);
  const setActiveChat = useChatStore((state) => state.setActiveChat);
  const readChat = useReadChat();
  const activeChat = useMemo(
    () => chats.find((chat) => chat.chatId === activeChatId) ?? null,
    [activeChatId, chats],
  );
  const chatViewModels = useMemo<ChatListItemViewModel[]>(
    () =>
      chats.map((chat) => ({
        id: chat.chatId,
        name: chat.name,
        lastMessage: chat.lastMessage,
        lastTimestamp: chat.lastTimestamp,
        unreadCount: chat.unreadCount,
        active: chat.chatId === activeChatId,
      })),
    [activeChatId, chats],
  );

  const openChat = (chatId: string) => {
    const chat = useChatStore.getState().chats.find((item) => item.chatId === chatId);

    setActiveChat(chatId);

    if ((chat?.unreadCount ?? 0) > 0) {
      readChat.mutate(chatId);
    }
  };

  return (
    <>
      <ChatWorkspaceView
        chats={chatViewModels}
        activeChatContent={
          activeChat ? (
            <ActiveChat
              chatId={activeChat.chatId}
              name={activeChat.name}
              phoneNumber={activeChat.phoneNumber}
              onBack={() => setActiveChat(null)}
            />
          ) : null
        }
        isReconnecting={pollingStatus === 'reconnecting'}
        onOpenChat={openChat}
        onNewChat={() => setIsNewChatOpen(true)}
      />
      <NewChatDialog open={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
    </>
  );
}
