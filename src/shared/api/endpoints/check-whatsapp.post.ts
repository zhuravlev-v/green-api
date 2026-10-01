import * as z from 'zod';

import { request } from '../http-client';

export const checkWhatsappResponseSchema = z.object({
  existsWhatsapp: z.boolean(),
  chatId: z.string(),
  username: z.string().optional(),
  phoneNumber: z.string().optional(),
  fromCache: z.boolean().optional(),
});

export type CheckWhatsappResponse = z.infer<typeof checkWhatsappResponseSchema>;

// https://green-api.com/docs/api/service/CheckWhatsapp/#checkwhatsapp

export function checkWhatsapp(chatId: string): Promise<CheckWhatsappResponse> {
  return request({
    method: 'POST',
    operation: 'checkWhatsapp',
    schema: checkWhatsappResponseSchema,
    body: { chatId: `${chatId}@c.us` },
  });
}
