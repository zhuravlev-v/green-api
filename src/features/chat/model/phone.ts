import * as z from 'zod';

export const phoneNumberSchema = z
  .string()
  .refine((value) => /^\+[1-9]\d{0,14}$/.test(value), {
    message: 'Введите номер в международном формате, например +79991234567',
  })
  .transform((value) => value.slice(1));

export function phoneChatId(phoneNumber: string): string {
  return `${phoneNumber}@c.us`;
}
