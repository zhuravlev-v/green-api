import { useMutation, useQuery } from '@tanstack/react-query';

import {
  getSettings,
  getStateInstance,
  type GetSettingsResponse,
  type GetStateInstanceResponse,
} from '@/shared/api';

import type { InstanceCredentials } from '../model/instance.types';

export const instanceKeys = {
  all: ['instance'] as const,
  settings: (idInstance: string) => [...instanceKeys.all, idInstance, 'settings'] as const,
  state: (idInstance: string) => [...instanceKeys.all, idInstance, 'state'] as const,
};

export function useCheckInstanceCredentials() {
  return useMutation({
    mutationFn: (credentials: InstanceCredentials) =>
      getStateInstance({
        idInstance: credentials.idInstance,
        apiTokenInstance: credentials.apiTokenInstance,
      }),
  });
}

export function useInstanceSettings(idInstance: string | null, enabled: boolean) {
  return useQuery<GetSettingsResponse>({
    queryKey: instanceKeys.settings(idInstance ?? ''),
    queryFn: ({ signal }) => getSettings(signal),
    enabled: enabled && Boolean(idInstance),
  });
}

export function useInstanceState(idInstance: string | null, enabled: boolean) {
  return useQuery<GetStateInstanceResponse>({
    queryKey: instanceKeys.state(idInstance ?? ''),
    queryFn: ({ signal }) => getStateInstance(undefined, signal),
    enabled: enabled && Boolean(idInstance),
    staleTime: 30_000,
  });
}
