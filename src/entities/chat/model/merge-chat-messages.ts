import type { ChatMessage } from './chat.types';

export function mergeChatMessages(
  current: ChatMessage[] | undefined,
  incoming: ChatMessage[],
): ChatMessage[] {
  const messages = new Map((current ?? []).map((message) => [message.id, message]));

  incoming.forEach((message) => {
    messages.set(message.id, { ...messages.get(message.id), ...message });
  });

  return [...messages.values()].sort((left, right) => left.timestamp - right.timestamp);
}
