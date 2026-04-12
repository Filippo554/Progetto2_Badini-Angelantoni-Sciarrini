import { Response, NextFunction } from "express";
import { AuthRequest, RuoloUtente } from "./auth.middleware";

export function roleMiddleware(allowedRoles: RuoloUtente[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    try {
      const user = req.user;

      if (!user) {
        res.status(401).json({
          error: "Non autenticato",
          code: "UNAUTHORIZED",
        });
        return;
      }

      if (!Array.isArray(allowedRoles) || allowedRoles.length === 0) {
        throw new Error("Ruoli non configurati correttamente");
      }

      if (!allowedRoles.includes(user.ruolo)) {
        res.status(403).json({
          error: "Accesso negato: permessi insufficienti",
          code: "FORBIDDEN",
        });
        return;
      }

      next();
    } catch {
      res.status(500).json({
        error: "Errore interno nel controllo dei ruoli",
        code: "ROLE_MIDDLEWARE_ERROR",
      });
    }
  };
}