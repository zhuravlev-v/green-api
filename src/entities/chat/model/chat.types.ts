export type ChatSummary = {
  chatId: string;
  aliases: string[];
  phoneNumber: string;
  name: string;
  lastMessage: string;
  lastTimestamp: number | null;
  unreadCount: number;
};

export type ChatMessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export type ChatMessage = {
  id: string;
  chatId: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
  status?: ChatMessageStatus;
};
