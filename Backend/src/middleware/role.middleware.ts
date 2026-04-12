import { Response, NextFunction } from "express";
import { AuthRequest, RuoloUtente } from "./auth.middleware";

export function roleMiddleware(allowedRoles: RuoloUtente[]) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const user = req.user;

    if (!user) {
      res.status(401).json({ error: "Non autenticato" });
      return;
    }

    if (!allowedRoles.includes(user.ruolo)) {
      res.status(403).json({
        error: "Accesso negato: permessi insufficienti",
      });
      return;
    }

    next();
  };
}