export type ChatListItemViewModel = {
  id: string;
  name: string;
  lastMessage: string;
  lastTimestamp: number | null;
  unreadCount: number;
  active: boolean;
};

export type ChatMessageViewModel = {
  id: string;
  text: string;
  direction: 'incoming' | 'outgoing';
  timestamp: number;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'failed';
};
