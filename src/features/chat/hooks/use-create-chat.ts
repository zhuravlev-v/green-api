import { useMutation, useQueryClient } from '@tanstack/react-query';

import {
  chatKeys,
  findChatByIdentifier,
  mergeChatMessages,
  useChatStore,
  type ChatMessage,
} from '@/entities/chat';
import { checkWhatsapp } from '@/shared/api';

import { phoneChatId } from '../model/phone';

export function useCreateChat() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: checkWhatsapp,
    onSuccess: (response, phoneNumber) => {
      if (!response.existsWhatsapp || !response.chatId) {
        return;
      }

      const store = useChatStore.getState();
      const phoneAlias = phoneChatId(phoneNumber);
      const existing = findChatByIdentifier(store.chats, phoneAlias, phoneNumber);

      if (existing && existing.chatId !== response.chatId) {
        const oldMessages = queryClient.getQueryData<ChatMessage[]>(
          chatKeys.messages(existing.chatId),
        );

        if (oldMessages) {
          queryClient.setQueryData<ChatMessage[]>(
            chatKeys.messages(response.chatId),
            mergeChatMessages(
              undefined,
              oldMessages.map((message) => ({ ...message, chatId: response.chatId })),
            ),
          );
          queryClient.removeQueries({ queryKey: chatKeys.messages(existing.chatId), exact: true });
        }
      }

      const chatId = store.upsertChat({
        chatId: response.chatId,
        aliases: [phoneAlias, response.chatId],
        phoneNumber,
        name: response.username || `+${phoneNumber}`,
        canonical: true,
      });

      useChatStore.getState().setActiveChat(chatId);
    },
  });
}
