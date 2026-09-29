export class ApiError<T = unknown> extends Error {
  readonly name = 'ApiError';
  readonly status: number;
  readonly info: T;
  readonly headers: Headers;

  constructor(status: number, info: T, headers: Headers) {
    super(`API request failed with status ${status}`);
    this.status = status;
    this.info = info;
    this.headers = headers;
  }
}

export type ErrorType<T> = ApiError<T>;

type ApiClientConfig = {
  prepareHeaders?: (headers: Headers) => void | Promise<void>;
  onError?: (error: ApiError) => void | Promise<void>;
};

let apiClientConfig: ApiClientConfig = {};

export function configureApiClient(config: ApiClientConfig): void {
  apiClientConfig = config;
}

async function parseResponse(response: Response): Promise<unknown> {
  if ([204, 205, 304].includes(response.status)) {
    return undefined;
  }

  const body = await response.text();

  if (!body) {
    return undefined;
  }

  const contentType = response.headers.get('content-type');

  return contentType?.includes('json') ? JSON.parse(body) : body;
}

export async function customInstance<T>(url: string, options: RequestInit): Promise<T> {
  const headers = new Headers(options.headers);
  await apiClientConfig.prepareHeaders?.(headers);

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const data = await parseResponse(response);

  if (!response.ok) {
    const error = new ApiError(response.status, data, response.headers);

    await apiClientConfig.onError?.(error);
    throw error;
  }

  return {
    data,
    status: response.status,
    headers: response.headers,
  } as T;
}
