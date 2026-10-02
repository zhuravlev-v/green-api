import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router';

import { instanceStateLabels, useInstanceStore, useInstanceState } from '@/entities/instance';
import { useChatStore } from '@/entities/chat';
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
    useChatStore.getState().clear();
    queryClient.clear();
    await navigate('/login');
  };

  return (
    <header className="z-10 flex min-h-16 items-center justify-between border-b bg-white px-4 shadow-sm">
      <div>
        <span className="font-semibold text-primary">GREEN-API WhatsApp</span>
        <p className="text-xs text-muted-foreground">Состояние инстанса: {instanceStateLabel}</p>
      </div>
      <Button variant="outline" onClick={logout}>
        Выйти
      </Button>
    </header>
  );
}
