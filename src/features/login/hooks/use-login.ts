import { useQueryClient } from '@tanstack/react-query';

import {
  instanceKeys,
  useCheckInstanceCredentials,
  useInstanceStore,
  type InstanceCredentials,
} from '@/entities/instance';

export function useLogin() {
  const queryClient = useQueryClient();
  const checkInstanceCredentials = useCheckInstanceCredentials();
  const setCredentials = useInstanceStore((state) => state.setCredentials);

  return async (credentials: InstanceCredentials) => {
    const instanceState = await checkInstanceCredentials.mutateAsync(credentials);

    queryClient.clear();
    setCredentials(credentials);
    queryClient.setQueryData(instanceKeys.state(credentials.idInstance), instanceState);
  };
}
