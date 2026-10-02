import { MutationCache, QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'sonner';

import { router } from '@/app/providers/router/router';
import { useChatStore } from '@/entities/chat';
import { useInstanceStore } from '@/entities/instance';
import { configureApiClient, isApiError } from '@/shared/api';

function getApiErrorMessage(error: unknown): string {
  if (!isApiError(error)) {
    return 'Произошла непредвиденная ошибка';
  }

  if (error.kind === 'network') {
    return 'Не удалось подключиться к GREEN-API';
  }

  if (error.kind === 'invalid-response') {
    return 'GREEN-API вернул ответ в неожиданном формате';
  }

  if (error.kind === 'configuration') {
    return 'Не заданы параметры подключения к GREEN-API';
  }

  switch (error.status) {
    case 400:
      return 'GREEN-API отклонил параметры запроса';
    case 401:
      return 'Неверный API Token Instance';
    case 403:
      return 'Неверный ID Instance или адрес API';
    case 404:
      return 'Метод GREEN-API не найден';
    case 429:
      return 'Слишком много запросов. Попробуйте позже';
    case 466:
      return 'Достигнут лимит тарифа GREEN-API';
    case 499:
      return 'GREEN-API не успел обработать запрос';
    default:
      return error.status && error.status >= 500
        ? 'GREEN-API временно недоступен'
        : 'Не удалось выполнить запрос к GREEN-API';
  }
}

function isCancelledRequest(error: unknown): boolean {
  return error instanceof DOMException && error.name === 'AbortError';
}

function handleApiError(error: unknown): void {
  if (isCancelledRequest(error)) {
    return;
  }

  toast.error(getApiErrorMessage(error));

  if (!isApiError(error) || (error.status !== 401 && error.status !== 403)) {
    return;
  }

  const { isAuth, clearCredentials } = useInstanceStore.getState();

  if (!isAuth) {
    return;
  }

  clearCredentials();
  useChatStore.getState().clear();
  queryClient.clear();
  void router.navigate('/login');
}

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  if (failureCount >= 2 || !isApiError(error)) {
    return false;
  }

  return (
    error.kind === 'network' || error.status === 499 || Boolean(error.status && error.status >= 500)
  );
}

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: handleApiError,
  }),
  mutationCache: new MutationCache({
    onError: handleApiError,
  }),
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: shouldRetryQuery,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 5000),
      refetchOnWindowFocus: false,
      throwOnError: false,
    },
    mutations: {
      retry: 0,
      throwOnError: false,
    },
  },
});

configureApiClient({
  getCredentials: () => {
    const { idInstance, apiTokenInstance } = useInstanceStore.getState().credentials;

    return idInstance && apiTokenInstance ? { idInstance, apiTokenInstance } : null;
  },
});

export function AppQueryClientProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
