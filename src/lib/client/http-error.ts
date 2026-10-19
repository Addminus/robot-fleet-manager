// Note: Carries the status code, so callers can tell a wrong request (4xx) from a failing server (5xx)
export class HttpError extends Error {
  readonly status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

// Note: A 4xx means the request itself is wrong, e.g. an unknown robot. Repeating it can not succeed
export const isClientError = (error: unknown) =>
  error instanceof HttpError && error.status >= 400 && error.status < 500;
