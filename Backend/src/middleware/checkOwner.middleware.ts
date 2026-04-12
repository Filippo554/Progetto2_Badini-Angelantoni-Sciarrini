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

    // validazione id
    if (!id || Number.isNaN(id)) {
      res.status(400).json({ error: "ID prenotazione non valido" });
      return;
    }

    const prenotazione = await Prenotazione.findByPk(id);

    if (!prenotazione) {
      res.status(404).json({ error: "Prenotazione non trovata" });
      return;
    }

    //utente autenticato
    if (!req.user) {
      res.status(401).json({ error: "Non autenticato" });
      return;
    }

    // admin
    if (req.user.ruolo === "admin") {
      next();
      return;
    }

    // controllo
    if (prenotazione.utente_id !== req.user.id) {
      res.status(403).json({
        error: "Non hai i permessi per questa operazione",
      });
      return;
    }

    next();
  } catch (err) {
    console.error("checkOwner error:", err);

    res.status(500).json({
      error: "Errore interno nel controllo dei permessi",
    });
  }
}