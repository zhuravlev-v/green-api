import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { instanceStateLabels, useInstanceStore, useInstanceState } from '@/entities/instance';
import { Button } from '@/shared/ui/button';

export function AppHeader() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const credentials = useInstanceStore((state) => state.credentials);
  const isAuth = useInstanceStore((state) => state.isAuth);
  const clearCredentials = useInstanceStore((state) => state.clearCredentials);
  const instanceState = useInstanceState(credentials.idInstance, isAuth);
  const instanceStateLabel = instanceState.isPending
    ? 'Загрузка...'
    : instanceState.data
      ? instanceStateLabels[instanceState.data.stateInstance]
      : 'Недоступно';

  const logout = async () => {
    clearCredentials();
    queryClient.clear();
    await navigate('/login');
  };

  return (
    <header className="flex items-center justify-between p-4 shadow-lg">
      <div>
        <span>Green Api: WhatsApp</span>
        <p>Состояние инстанса: {instanceStateLabel}</p>
      </div>
      <Button variant="outline" onClick={logout}>
        Выйти
      </Button>
    </header>
  );
}
