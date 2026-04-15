import { Request, Response, NextFunction } from "express";
import { ValidationError, UniqueConstraintError } from "sequelize";

export interface AppError extends Error {
  statusCode?: number;
  code?: string;
}

export function notFoundHandler(req: Request, res: Response): void {
  res.status(404).json({
    error: "Endpoint non trovato",
    code: "NOT_FOUND",
  });
}

export function errorMiddleware(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error("ERROR:", err);

  const error = err as AppError;

  if (error.statusCode) {
    res.status(error.statusCode).json({
      error: error.message,
      code: error.code || "APP_ERROR",
    });
    return;
  }

  if (err instanceof ValidationError) {
    res.status(400).json({
      error: "Errore di validazione",
      code: "VALIDATION_ERROR",
      details: err.errors.map((e) => ({
        field: e.path,
        message: e.message,
      })),
    });
    return;
  }

  if (err instanceof UniqueConstraintError) {
    res.status(409).json({
      error: "Risorsa già esistente",
      code: "DUPLICATE_ENTRY",
    });
    return;
  }

  res.status(500).json({
    error: "Errore interno del server",
    code: "INTERNAL_ERROR",
  });
}