import { Response, NextFunction } from "express";
import { AuthRequest, RuoloUtente } from "./auth.middleware";

export function roleMiddleware(allowedRoles: RuoloUtente[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        error: "Non autenticato",
        code: "UNAUTHORIZED",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.ruolo)) {
      res.status(403).json({
        error: "Accesso negato",
        code: "FORBIDDEN",
      });
      return;
    }

    next();
  };
}