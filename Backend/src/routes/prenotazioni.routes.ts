import { Router } from "express";
import { Prenotazione } from "../models/Prenotazione";
import { Aula } from "../models/Aula";
import { Utente } from "../models/Utente";
import { Classe } from "../models/Classe";

import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// GET tutte prenotazioni
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const data = await Prenotazione.findAll({
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
      order: [
        ["data", "ASC"],
        ["ora_inizio", "ASC"],
      ],
    });

    res.json(data);
  } catch {
    res.status(500).json({ error: "Errore recupero prenotazioni" });
  }
});

// GET singola prenotazione
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID non valido" });
      return;
    }

    const prenotazione = await Prenotazione.findByPk(id, {
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
    });

    if (!prenotazione) {
      res.status(404).json({ error: "Prenotazione non trovata" });
      return;
    }

    res.json(prenotazione);
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

// CREATE prenotazione
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["docente", "admin", "ata"]),
  async (req, res) => {
    try {
      const { aula_id, data, ora_inizio, ora_fine, note, classi } = req.body;

      if (!aula_id || !data || !ora_inizio || !ora_fine) {
        res.status(400).json({ error: "Dati mancanti" });
        return;
      }

      if (ora_fine <= ora_inizio) {
        res.status(400).json({ error: "Orario non valido" });
        return;
      }

      const aulaId = Number(aula_id);

      if (Number.isNaN(aulaId)) {
        res.status(400).json({ error: "aula_id non valido" });
        return;
      }

      const aula = await Aula.findByPk(aulaId);

      if (!aula) {
        res.status(404).json({ error: "Aula non trovata" });
        return;
      }

      const conflitti = await Prenotazione.findAll({
        where: { aula_id: aulaId, data },
      });

      const overlap = conflitti.some((p) => {
        return !(ora_fine <= p.ora_inizio || ora_inizio >= p.ora_fine);
      });

      if (overlap) {
        res.status(409).json({ error: "Aula già occupata" });
        return;
      }

      const user = req.user;
      if (!user) {
        res.status(401).json({ error: "Non autenticato" });
        return;
      }

      const nuova = await Prenotazione.create({
        utente_id: user.id,
        aula_id: aulaId,
        data,
        ora_inizio,
        ora_fine,
        note: note ?? null,
      });

      if (Array.isArray(classi)) {
        await (nuova as any).setClassi(classi);
      }

      const result = await Prenotazione.findByPk(nuova.id, {
        include: [
          { model: Aula, as: "aula" },
          { model: Utente, as: "utente" },
          { model: Classe, as: "classi" },
        ],
      });

      res.status(201).json(result);
    } catch {
      res.status(500).json({ error: "Errore creazione prenotazione" });
    }
  }
);

// DELETE prenotazione
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin", "docente"]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        res.status(400).json({ error: "ID non valido" });
        return;
      }

      const prenotazione = await Prenotazione.findByPk(id);

      if (!prenotazione) {
        res.status(404).json({ error: "Prenotazione non trovata" });
        return;
      }

      const user = req.user;

      if (!user) {
        res.status(401).json({ error: "Non autenticato" });
        return;
      }

      if (user.ruolo !== "admin" && prenotazione.utente_id !== user.id) {
        res.status(403).json({ error: "Non autorizzato" });
        return;
      }

      await prenotazione.destroy();

      res.json({ message: "Eliminata con successo" });
    } catch {
      res.status(500).json({ error: "Errore eliminazione" });
    }
  }
);

export default router;