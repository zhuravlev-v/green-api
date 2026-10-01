import type * as z from 'zod';

import { env } from '@/shared/config/env';

export type InstanceCredentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type ApiErrorKind = 'http' | 'network' | 'invalid-response' | 'configuration';

export class ApiError extends Error {
  readonly name = 'ApiError';
  readonly kind: ApiErrorKind;
  readonly status?: number;
  readonly details?: unknown;

  constructor(
    message: string,
    kind: ApiErrorKind,
    status?: number,
    details?: unknown,
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.kind = kind;
    this.status = status;
    this.details = details;
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

type ApiClientConfig = {
  getCredentials?: () => InstanceCredentials | null;
};

type RequestOptions<T> = {
  method: 'GET' | 'POST' | 'DELETE';
  operation: string;
  schema: z.ZodType<T>;
  body?: unknown;
  signal?: AbortSignal;
  credentials?: InstanceCredentials;
  pathSegments?: Array<string | number>;
  searchParams?: Record<string, string | number | boolean | undefined>;
};

let apiClientConfig: ApiClientConfig = {};

export function configureApiClient(config: ApiClientConfig): void {
  apiClientConfig = config;
}

function getCredentials(credentials?: InstanceCredentials): InstanceCredentials {
  const resolvedCredentials = credentials ?? apiClientConfig.getCredentials?.();

  if (!resolvedCredentials?.idInstance || !resolvedCredentials.apiTokenInstance) {
    throw new ApiError('Instance credentials are not configured', 'configuration');
  }

  return resolvedCredentials;
}

function createInstanceUrl(
  operation: string,
  credentials: InstanceCredentials,
  pathSegments: Array<string | number> = [],
  searchParams: Record<string, string | number | boolean | undefined> = {},
): string {
  const baseUrl = env.API_URL.replace(/\/+$/, '');
  const idInstance = encodeURIComponent(credentials.idInstance);
  const apiTokenInstance = encodeURIComponent(credentials.apiTokenInstance);
  const encodedOperation = encodeURIComponent(operation);
  const encodedPath = pathSegments.map((segment) => encodeURIComponent(segment)).join('/');
  const query = new URLSearchParams();

  Object.entries(searchParams).forEach(([key, value]) => {
    if (value !== undefined) {
      query.set(key, String(value));
    }
  });

  const pathname = `${baseUrl}/waInstance${idInstance}/${encodedOperation}/${apiTokenInstance}${encodedPath ? `/${encodedPath}` : ''}`;
  const queryString = query.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

async function parseResponse(response: Response): Promise<unknown> {
  const responseText = await response.text();

  if (!responseText) {
    return undefined;
  }

  if (!response.headers.get('content-type')?.includes('json')) {
    return responseText;
  }

  try {
    return JSON.parse(responseText);
  } catch (cause) {
    if (!response.ok) {
      return responseText;
    }

    throw new ApiError(
      'API returned malformed JSON',
      'invalid-response',
      response.status,
      undefined,
      {
        cause,
      },
    );
  }
}

export async function request<T>({
  method,
  operation,
  schema,
  body,
  signal,
  credentials,
  pathSegments,
  searchParams,
}: RequestOptions<T>): Promise<T> {
  const url = createInstanceUrl(operation, getCredentials(credentials), pathSegments, searchParams);
  const headers = new Headers();

  if (body !== undefined) {
    headers.set('Content-Type', 'application/json');
  }

  let response: Response;

  try {
    response = await fetch(url, {
      method,
      headers,
      body: body === undefined ? undefined : JSON.stringify(body),
      signal,
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError') {
      throw cause;
    }

    throw new ApiError('Network request failed', 'network', undefined, undefined, { cause });
  }

  const data = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError('API request failed', 'http', response.status, data);
  }

  const parsedData = schema.safeParse(data);

  if (!parsedData.success) {
    throw new ApiError(
      'API response does not match the expected contract',
      'invalid-response',
      response.status,
      {
        issues: parsedData.error.issues,
      },
    );
  }

  return parsedData.data;
}
