import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppRouterProvider } from '@/app/providers/router';
import { AppQueryClientProvider } from '@/app/providers/query-client';

export function AppProvider() {
  return (
    <AppQueryClientProvider>
      <AppRouterProvider />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppQueryClientProvider>
  );
}
