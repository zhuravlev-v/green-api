import { useQuery } from '@tanstack/react-query';

import { getChats, type GetChatsResponse } from '@/shared/api';

import { chatKeys } from './chat-keys';

export function useChats(idInstance: string | null, enabled: boolean) {
  return useQuery<GetChatsResponse>({
    queryKey: chatKeys.list(idInstance ?? ''),
    queryFn: ({ signal }) => getChats(signal),
    enabled: enabled && Boolean(idInstance),
  });
}
