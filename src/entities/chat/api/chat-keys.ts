export const chatKeys = {
  all: ['chats'] as const,
  list: (idInstance: string) => [...chatKeys.all, idInstance, 'list'] as const,
  messages: (chatId: string) => [...chatKeys.all, chatId, 'messages'] as const,
};
