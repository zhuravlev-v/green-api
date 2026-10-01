import * as z from 'zod';

import { request } from '../http-client';

export const receiveNotificationResponseSchema = z.object({
  receiptId: z.number(),
  body: z.unknown(),
});

const nullableReceiveNotificationResponseSchema = z.union([
  receiveNotificationResponseSchema,
  z.null(),
  z.undefined(),
]);

export type ReceiveNotificationResponse = z.infer<typeof receiveNotificationResponseSchema>;

// https://green-api.com/docs/api/receiving/technology-http-api/ReceiveNotification/#receivenotification

export async function receiveNotification(
  receiveTimeout = 60,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  const response = await request({
    method: 'GET',
    operation: 'receiveNotification',
    schema: nullableReceiveNotificationResponseSchema,
    searchParams: { receiveTimeout },
    signal,
  });

  return response ?? null;
}
