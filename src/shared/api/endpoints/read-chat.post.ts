import * as z from 'zod';

import { request } from '../http-client';

export const readChatResponseSchema = z.object({
  setRead: z.boolean(),
});

export type ReadChatResponse = z.infer<typeof readChatResponseSchema>;

// https://green-api.com/docs/api/marks/ReadChat/#readchat

export function readChat(chatId: string): Promise<ReadChatResponse> {
  return request({
    method: 'POST',
    operation: 'readChat',
    schema: readChatResponseSchema,
    body: { chatId },
  });
}
