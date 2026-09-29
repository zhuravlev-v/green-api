import { RouterProvider } from 'react-router';
import { router } from './router';

export function AppRouterProvider() {
  return <RouterProvider router={router} />;
}
