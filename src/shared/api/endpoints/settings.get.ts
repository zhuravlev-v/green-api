import * as z from 'zod';

import { request } from '../http-client';

export const getSettingsResponseSchema = z.object({
  wid: z.string(),
  webhookUrl: z.string(),
  incomingWebhook: z.enum(['yes', 'no']),
  enableLidMode: z.enum(['yes', 'no']).optional(),
});

export type GetSettingsResponse = z.infer<typeof getSettingsResponseSchema>;

// https://green-api.com/docs/api/account/GetSettings/#getsettings

export function getSettings(signal?: AbortSignal): Promise<GetSettingsResponse> {
  return request({
    method: 'GET',
    operation: 'getSettings',
    schema: getSettingsResponseSchema,
    signal,
  });
}
