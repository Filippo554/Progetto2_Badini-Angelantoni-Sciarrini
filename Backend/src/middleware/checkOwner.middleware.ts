import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { Prenotazione } from "../models/Prenotazione";

export async function checkOwner(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id < 1) {
      res.status(400).json({
        error: "ID prenotazione non valido",
        code: "INVALID_ID",
      });
      return;
    }

    const prenotazione = await Prenotazione.findByPk(id);

    if (!prenotazione) {
      res.status(404).json({
        error: "Prenotazione non trovata",
        code: "NOT_FOUND",
      });
      return;
    }

    if (!req.user) {
      res.status(401).json({
        error: "Non autenticato",
        code: "UNAUTHORIZED",
      });
      return;
    }

    const { user } = req;

    if (user.ruolo === "admin") {
      next();
      return;
    }

    if (prenotazione.utente_id !== user.id) {
      res.status(403).json({
        error: "Non hai i permessi per questa operazione",
        code: "FORBIDDEN",
      });
      return;
    }

    next();
  } catch {
    res.status(500).json({
      error: "Errore interno nel controllo permessi",
      code: "CHECK_OWNER_ERROR",
    });
  }
}