import { Request, Response, NextFunction } from 'express';

export const validate =
  (schema: any) =>
  (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      res.status(400).json({
        error: 'Validazione fallita',
        code: 'VALIDATION_ERROR',
        details: result.error.issues.map((issue: any) => ({
          campo: issue.path.join('.'),
          messaggio: issue.message,
        })),
      });
      return;
    }

    req.body = result.data.body ?? req.body;
    req.params = result.data.params ?? req.params;
    next();
  };