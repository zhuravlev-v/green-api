import * as z from 'zod';

export const loginCredentials = z.object({
  idInstance: z
    .string({ error: 'Введите ID Instance' })
    .regex(/^[0-9]+$/, { error: 'ID Instance должен содержать только цифры' })
    .min(10, { error: 'ID Instance должен содержать минимум 10 символов' }),

  apiTokenInstance: z.hex({
    error: 'Введите корректный API Token',
  }),
});
