import { redirect, type MiddlewareFunction } from 'react-router';
import { useUser } from '@/entities/user';

type AuthMiddlewareOptions = {
  unauthorizedOnly: boolean;
};

export const createAuthMiddleware =
  ({ unauthorizedOnly }: AuthMiddlewareOptions = { unauthorizedOnly: false }): MiddlewareFunction =>
  async (_, next) => {
    const { isAuth } = useUser.getState();

    if (unauthorizedOnly && isAuth) {
      throw redirect('/');
    }

    if (!unauthorizedOnly && !isAuth) {
      throw redirect('/login');
    }

    await next();
  };
