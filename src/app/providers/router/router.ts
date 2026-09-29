import { createBrowserRouter } from 'react-router';

import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';

import { createAuthMiddleware } from './middleware';

export const router = createBrowserRouter([
  {
    index: true,
    Component: HomePage,
    middleware: [createAuthMiddleware()],
  },
  {
    path: '/login',
    Component: LoginPage,
    middleware: [createAuthMiddleware({ unauthorizedOnly: true })],
  },
]);
