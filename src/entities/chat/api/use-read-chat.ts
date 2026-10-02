import { useMutation } from '@tanstack/react-query';

import { readChat } from '@/shared/api';

export function useReadChat() {
  return useMutation({
    mutationFn: readChat,
  });
}
