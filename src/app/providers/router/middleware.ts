import { redirect, type MiddlewareFunction } from 'react-router';
import { env } from '@/shared/config/env';

export const devMiddleware: MiddlewareFunction = async (_, next) => {
  if (env.DEV) {
    await next();
  } else {
    throw redirect('/');
  }
};
