import type { ChatMessageViewModel } from './chat-workspace.types';

const timeFormatter = new Intl.DateTimeFormat('ru-RU', {
  hour: '2-digit',
  minute: '2-digit',
});

const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export function formatTime(timestamp: number | null): string {
  return timestamp ? timeFormatter.format(timestamp * 1000) : '';
}

export function getDateKey(timestamp: number): string {
  const date = new Date(timestamp * 1000);

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

export function formatMessageDate(timestamp: number, now: Date): string {
  const date = new Date(timestamp * 1000);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today);

  yesterday.setDate(today.getDate() - 1);

  const dateKey = getDateKey(timestamp);

  if (dateKey === getDateKey(today.getTime() / 1000)) {
    return 'Сегодня';
  }

  if (dateKey === getDateKey(yesterday.getTime() / 1000)) {
    return 'Вчера';
  }

  return dateFormatter.format(date);
}

export function getStatusLabel(status?: ChatMessageViewModel['status']): string {
  switch (status) {
    case 'sending':
      return 'Отправляется';
    case 'delivered':
      return 'Доставлено';
    case 'read':
      return 'Прочитано';
    case 'failed':
      return 'Не отправлено';
    default:
      return 'Отправлено';
  }
}
