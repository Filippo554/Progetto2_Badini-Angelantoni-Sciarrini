export class AppError extends Error {
  statusCode: number;
  code: string;
  details?: unknown;

  constructor(message: string, statusCode = 500, code = 'APP_ERROR', details?: unknown) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

export function badRequest(message: string, code = 'BAD_REQUEST', details?: unknown): AppError {
  return new AppError(message, 400, code, details);
}

export function unauthorized(message = 'Non autenticato', code = 'UNAUTHORIZED'): AppError {
  return new AppError(message, 401, code);
}

export function forbidden(message = 'Accesso negato', code = 'FORBIDDEN'): AppError {
  return new AppError(message, 403, code);
}

export function notFound(message: string, code = 'NOT_FOUND'): AppError {
  return new AppError(message, 404, code);
}

export function conflict(message: string, code = 'CONFLICT', details?: unknown): AppError {
  return new AppError(message, 409, code, details);
}
