import * as z from 'zod';

import { request } from '../http-client';

export const chatSchema = z
  .object({
    archive: z.boolean(),
    id: z.string(),
    ephemeralExpiration: z.number(),
    ephemeralSettingTimestamp: z.number(),
    name: z.string(),
    type: z.enum(['user', 'group']),
    unreadCount: z.number(),
    newChatId: z.string().optional(),
  })
  .passthrough();

export const getChatsResponseSchema = z.array(chatSchema);

export type ApiChat = z.infer<typeof chatSchema>;
export type GetChatsResponse = z.infer<typeof getChatsResponseSchema>;

// https://green-api.com/docs/api/service/GetChats/#getchats

export function getChats(signal?: AbortSignal): Promise<GetChatsResponse> {
  return request({
    method: 'GET',
    operation: 'getChats',
    schema: getChatsResponseSchema,
    signal,
  });
}
