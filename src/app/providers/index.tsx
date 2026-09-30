import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from 'sonner';
import { AppRouterProvider } from '@/app/providers/router';
import { AppQueryClientProvider } from '@/app/providers/query-client';

export function AppProvider() {
  return (
    <AppQueryClientProvider>
      <AppRouterProvider />
      <Toaster position="top-right" richColors />
      <ReactQueryDevtools initialIsOpen={false} />
    </AppQueryClientProvider>
  );
}
