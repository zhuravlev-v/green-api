import * as z from 'zod';

import { request } from '../http-client';

export const chatHistoryMessageSchema = z
  .object({
    type: z.enum(['incoming', 'outgoing']),
    idMessage: z.string(),
    timestamp: z.number(),
    statusMessage: z.string().optional(),
    typeMessage: z.string(),
    chatId: z.string(),
    senderName: z.string().optional(),
    senderContactName: z.string().optional(),
    textMessage: z.string().optional(),
    extendedTextMessage: z
      .object({
        text: z.string().optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export const getChatHistoryResponseSchema = z.array(chatHistoryMessageSchema);

export type ChatHistoryMessage = z.infer<typeof chatHistoryMessageSchema>;
export type GetChatHistoryResponse = z.infer<typeof getChatHistoryResponseSchema>;

// https://green-api.com/docs/api/journals/GetChatHistory/#getchathistory

export function getChatHistory(
  chatId: string,
  count = 100,
  signal?: AbortSignal,
): Promise<GetChatHistoryResponse> {
  return request({
    method: 'POST',
    operation: 'getChatHistory',
    schema: getChatHistoryResponseSchema,
    body: { chatId, count },
    signal,
  });
}
