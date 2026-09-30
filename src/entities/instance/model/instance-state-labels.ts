import type { InstanceState } from '@/shared/api';

export const instanceStateLabels: Record<InstanceState, string> = {
  authorized: 'Авторизован',
  notAuthorized: 'Не авторизован',
  blocked: 'Заблокирован',
  sleepMode: 'Спящий режим',
  starting: 'Запускается',
  yellowCard: 'Временно ограничен (устаревший статус)',
  suspended: 'Временно ограничен',
};
