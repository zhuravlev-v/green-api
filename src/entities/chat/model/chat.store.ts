import { create } from 'zustand';

import type { ChatSummary } from './chat.types';

type UpsertChatInput = Omit<
  ChatSummary,
  'aliases' | 'lastMessage' | 'lastTimestamp' | 'unreadCount'
> & {
  aliases?: string[];
  lastMessage?: string;
  lastTimestamp?: number | null;
  unreadCount?: number;
  canonical?: boolean;
};

type SyncChatInput = Omit<UpsertChatInput, 'lastMessage' | 'lastTimestamp' | 'canonical'>;

type ChatStore = {
  ownerInstanceId: string | null;
  chats: ChatSummary[];
  activeChatId: string | null;
  setOwner: (idInstance: string) => void;
  clear: () => void;
  upsertChat: (chat: UpsertChatInput) => string;
  syncChats: (chats: SyncChatInput[]) => void;
  setActiveChat: (chatId: string | null) => void;
  hydrateChatPreview: (chatId: string, message: string, timestamp: number) => void;
  updateChatPreview: (chatId: string, message: string, timestamp: number, unread?: boolean) => void;
};

function unique(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))];
}

export function findChatByIdentifier(
  chats: ChatSummary[],
  identifier: string,
  phoneNumber?: string,
): ChatSummary | undefined {
  return chats.find(
    (chat) =>
      chat.chatId === identifier ||
      chat.aliases.includes(identifier) ||
      Boolean(phoneNumber && chat.phoneNumber === phoneNumber),
  );
}

export const useChatStore = create<ChatStore>()((set, get) => {
  return {
    ownerInstanceId: null,
    chats: [],
    activeChatId: null,
    setOwner: (idInstance) => {
      if (get().ownerInstanceId === idInstance) {
        return;
      }

      set({ ownerInstanceId: idInstance, chats: [], activeChatId: null });
    },
    clear: () => set({ ownerInstanceId: null, chats: [], activeChatId: null }),
    upsertChat: (input) => {
      const state = get();
      const aliases = unique([input.chatId, ...(input.aliases ?? [])]);
      const existing = state.chats.find(
        (chat) =>
          chat.chatId === input.chatId ||
          Boolean(input.phoneNumber && chat.phoneNumber === input.phoneNumber) ||
          aliases.some((alias) => chat.aliases.includes(alias)),
      );

      if (!existing) {
        const chat: ChatSummary = {
          chatId: input.chatId,
          aliases,
          phoneNumber: input.phoneNumber,
          name: input.name,
          lastMessage: input.lastMessage ?? '',
          lastTimestamp: input.lastTimestamp ?? null,
          unreadCount: input.unreadCount ?? 0,
        };

        set({ chats: [chat, ...state.chats] });
        return chat.chatId;
      }

      const nextChatId = input.canonical ? input.chatId : existing.chatId;
      const updated: ChatSummary = {
        ...existing,
        chatId: nextChatId,
        aliases: unique([...existing.aliases, ...aliases, existing.chatId]),
        phoneNumber: input.phoneNumber || existing.phoneNumber,
        name: input.name || existing.name,
        lastMessage: input.lastMessage ?? existing.lastMessage,
        lastTimestamp: input.lastTimestamp ?? existing.lastTimestamp,
        unreadCount: input.unreadCount ?? existing.unreadCount,
      };

      set({
        chats: state.chats.map((chat) => (chat.chatId === existing.chatId ? updated : chat)),
        activeChatId:
          state.activeChatId === existing.chatId && nextChatId !== existing.chatId
            ? nextChatId
            : state.activeChatId,
      });

      return nextChatId;
    },
    syncChats: (inputs) =>
      set((state) => {
        const syncedIds = new Set<string>();
        const syncedChats = inputs.map((input) => {
          const aliases = unique([input.chatId, ...(input.aliases ?? [])]);
          const existing = state.chats.find(
            (chat) =>
              chat.chatId === input.chatId ||
              Boolean(input.phoneNumber && chat.phoneNumber === input.phoneNumber) ||
              aliases.some((alias) => chat.aliases.includes(alias)),
          );
          const chat: ChatSummary = {
            chatId: input.chatId,
            aliases: unique([...aliases, ...(existing?.aliases ?? []), existing?.chatId ?? '']),
            phoneNumber: input.phoneNumber || existing?.phoneNumber || '',
            name: input.name || existing?.name || input.chatId,
            lastMessage: existing?.lastMessage ?? '',
            lastTimestamp: existing?.lastTimestamp ?? null,
            unreadCount: input.unreadCount ?? existing?.unreadCount ?? 0,
          };

          syncedIds.add(existing?.chatId ?? input.chatId);
          return chat;
        });
        const localChats = state.chats.filter((chat) => !syncedIds.has(chat.chatId));
        const activeChat = state.chats.find((chat) => chat.chatId === state.activeChatId);
        const syncedActiveChat = activeChat
          ? syncedChats.find(
              (chat) =>
                chat.chatId === activeChat.chatId ||
                chat.aliases.includes(activeChat.chatId) ||
                activeChat.aliases.some((alias) => chat.aliases.includes(alias)),
            )
          : undefined;

        return {
          chats: [...syncedChats, ...localChats],
          activeChatId: syncedActiveChat?.chatId ?? state.activeChatId,
        };
      }),
    setActiveChat: (chatId) =>
      set((state) => ({
        activeChatId: chatId,
        chats: state.chats.map((chat) =>
          chat.chatId === chatId ? { ...chat, unreadCount: 0 } : chat,
        ),
      })),
    hydrateChatPreview: (chatId, message, timestamp) =>
      set((state) => ({
        chats: state.chats.map((chat) =>
          chat.chatId === chatId
            ? {
                ...chat,
                lastMessage: message,
                lastTimestamp: timestamp,
              }
            : chat,
        ),
      })),
    updateChatPreview: (chatId, message, timestamp, unread = false) =>
      set((state) => ({
        chats: state.chats
          .map((chat) =>
            chat.chatId === chatId
              ? {
                  ...chat,
                  lastMessage: message,
                  lastTimestamp: timestamp,
                  unreadCount:
                    unread && state.activeChatId !== chatId
                      ? chat.unreadCount + 1
                      : chat.unreadCount,
                }
              : chat,
          )
          .sort((left, right) => (right.lastTimestamp ?? 0) - (left.lastTimestamp ?? 0)),
      })),
  };
});
