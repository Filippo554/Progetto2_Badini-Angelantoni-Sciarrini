import { Request, Response, NextFunction } from 'express';
import { ValidationError, UniqueConstraintError } from 'sequelize';
import { AppError } from '../utils/appError';

export function notFoundHandler(_req: Request, res: Response): void {
  res.status(404).json({
    error: 'Endpoint non trovato',
    code: 'NOT_FOUND',
  });
}

export function errorMiddleware(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[ERROR]', err);

  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      ...(err.details !== undefined ? { details: err.details } : {}),
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: 'Errore di validazione del database',
      code: 'VALIDATION_ERROR',
      details: err.errors.map((e) => ({ campo: e.path, messaggio: e.message })),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      error: 'Risorsa già esistente',
      code: 'DUPLICATE_ENTRY',
    });
    return;
  }

  if (err instanceof Error) {
    res.status(500).json({
      error: err.message || 'Errore interno del server',
      code: 'INTERNAL_ERROR',
    });
    return;
  }

  res.status(500).json({
    error: 'Errore interno del server',
    code: 'INTERNAL_ERROR',
  });
}
