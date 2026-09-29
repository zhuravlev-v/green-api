import { createBrowserRouter } from 'react-router';

import { devMiddleware } from './middleware';
import DefaultLayout from '@/layouts';
import AuthLayout from '@/layouts/auth';
import HomePage from '@/pages/home';
import LoginPage from '@/pages/login';

export const router = createBrowserRouter([
  {
    Component: DefaultLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
    ],
  },
  {
    Component: AuthLayout,
    children: [
      {
        path: '/login',
        Component: LoginPage,
        // middleware: [devMiddleware],
      },
    ],
  },
]);
