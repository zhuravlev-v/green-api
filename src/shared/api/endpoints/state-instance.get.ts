import * as z from 'zod';

import { request, type InstanceCredentials } from '../http-client';

export const instanceStateSchema = z.enum([
  'authorized',
  'notAuthorized',
  'blocked',
  'sleepMode',
  'starting',
  'pendingPassword',
  'yellowCard',
  'suspended',
]);

export const getStateInstanceResponseSchema = z.object({
  stateInstance: instanceStateSchema,
});

export type InstanceState = z.infer<typeof instanceStateSchema>;
export type GetStateInstanceResponse = z.infer<typeof getStateInstanceResponseSchema>;

// https://green-api.com/docs/api/account/GetStateInstance/#getstateinstance

export function getStateInstance(
  credentials?: InstanceCredentials,
  signal?: AbortSignal,
): Promise<GetStateInstanceResponse> {
  return request({
    method: 'GET',
    operation: 'getStateInstance',
    schema: getStateInstanceResponseSchema,
    credentials,
    signal,
  });
}
