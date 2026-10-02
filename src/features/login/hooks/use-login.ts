import { useQueryClient } from '@tanstack/react-query';

import {
  instanceKeys,
  useCheckInstanceCredentials,
  useInstanceStore,
  type InstanceCredentials,
} from '@/entities/instance';
import { useChatStore } from '@/entities/chat';

export class InstanceNotAuthorizedError extends Error {
  readonly name = 'InstanceNotAuthorizedError';
}

export function useLogin() {
  const queryClient = useQueryClient();
  const checkInstanceCredentials = useCheckInstanceCredentials();
  const setCredentials = useInstanceStore((state) => state.setCredentials);

  return async (credentials: InstanceCredentials) => {
    const instanceState = await checkInstanceCredentials.mutateAsync(credentials);

    if (instanceState.stateInstance !== 'authorized') {
      throw new InstanceNotAuthorizedError('Инстанс WhatsApp не авторизован');
    }

    queryClient.clear();
    queryClient.setQueryData(instanceKeys.state(credentials.idInstance), instanceState);
    useChatStore.getState().setOwner(credentials.idInstance);
    setCredentials(credentials);
  };
}
