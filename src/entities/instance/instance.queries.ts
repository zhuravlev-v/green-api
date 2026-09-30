import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getStateInstance,
  type GetStateInstanceResponse,
  type InstanceCredentials,
} from '@/shared/api';

export const instanceKeys = {
  all: ['instance'] as const,
  state: (idInstance: string) => [...instanceKeys.all, idInstance, 'state'] as const,
};

export function useCheckInstanceCredentials() {
  return useMutation({
    mutationFn: (credentials: InstanceCredentials) => getStateInstance(credentials),
  });
}

export function useInstanceState(idInstance: string | null, enabled: boolean) {
  return useQuery<GetStateInstanceResponse>({
    queryKey: instanceKeys.state(idInstance ?? ''),
    queryFn: ({ signal }) => getStateInstance(undefined, signal),
    enabled: enabled && Boolean(idInstance),
  });
}
