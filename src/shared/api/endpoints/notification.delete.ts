import * as z from 'zod';

import { request } from '../http-client';

export const deleteNotificationResponseSchema = z.object({
  result: z.boolean(),
  reason: z.string().optional(),
});

export type DeleteNotificationResponse = z.infer<typeof deleteNotificationResponseSchema>;

// https://green-api.com/docs/api/receiving/technology-http-api/DeleteNotification/#deletenotification

export function deleteNotification(receiptId: number): Promise<DeleteNotificationResponse> {
  return request({
    method: 'DELETE',
    operation: 'deleteNotification',
    schema: deleteNotificationResponseSchema,
    pathSegments: [receiptId],
  });
}
