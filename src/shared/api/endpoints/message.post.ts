import * as z from 'zod';

import { request } from '../http-client';

export const sendMessageResponseSchema = z.object({
  idMessage: z.string(),
});

export type SendMessageResponse = z.infer<typeof sendMessageResponseSchema>;

export type SendMessagePayload = {
  chatId: string;
  message: string;
};

// https://green-api.com/docs/api/sending/SendMessage/#sendmessage

export function sendMessage(payload: SendMessagePayload): Promise<SendMessageResponse> {
  return request({
    method: 'POST',
    operation: 'sendMessage',
    schema: sendMessageResponseSchema,
    body: payload,
  });
}
