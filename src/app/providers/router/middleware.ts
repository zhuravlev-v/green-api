import { redirect, type MiddlewareFunction } from 'react-router';
import { useInstanceStore } from '@/entities/instance';

type AuthMiddlewareOptions = {
  unauthorizedOnly: boolean;
};

export const createAuthMiddleware =
  ({ unauthorizedOnly }: AuthMiddlewareOptions = { unauthorizedOnly: false }): MiddlewareFunction =>
  async (_, next) => {
    const { isAuth } = useInstanceStore.getState();

    if (unauthorizedOnly && isAuth) {
      throw redirect('/');
    }

    if (!unauthorizedOnly && !isAuth) {
      throw redirect('/login');
    }

    await next();
  };
