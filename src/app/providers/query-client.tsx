import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

function shouldRetryQuery(failureCount: number /* , error: unknown */): boolean {
  if (failureCount >= 1 /* || !isApiError(error) */) {
    return false;
  }

  return true;
  // return error.status === 0 || error.status >= 500;
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      retry: shouldRetryQuery,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    },
  },
});

export function AppQueryClientProvider({ children }: { children: React.ReactNode }) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
