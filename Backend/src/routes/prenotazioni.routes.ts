import { Router } from "express";
import { Op } from "sequelize";

import { Prenotazione } from "../models/Prenotazione";
import { Aula } from "../models/Aula";
import { Utente } from "../models/Utente";
import { Classe } from "../models/Classe";

import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { checkOwner } from "../middleware/checkOwner.middleware";

const router = Router();

const INCLUDE_FULL = [
  { model: Aula, as: "aula" },
  { model: Utente, as: "utente", attributes: ["id", "nome", "cognome", "email"] },
  { model: Classe, as: "classi" },
];

function parseId(id: unknown): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function isTimeValid(t: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(t);
}

router.get("/", authMiddleware, async (_req, res, next) => {
  try {
    const data = await Prenotazione.findAll({
      include: INCLUDE_FULL,
      order: [
        ["data", "ASC"],
        ["ora_inizio", "ASC"],
      ],
    });

    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, async (req, res, next) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({ error: "ID non valido", code: "INVALID_ID" });
      return;
    }

    const prenotazione = await Prenotazione.findByPk(id, {
      include: INCLUDE_FULL,
    });

    if (!prenotazione) {
      res.status(404).json({ error: "Prenotazione non trovata", code: "NOT_FOUND" });
      return;
    }

    res.json({ data: prenotazione });
  } catch (err) {
    next(err);
  }
});

router.post(
  "/",
  authMiddleware,
  roleMiddleware(["docente", "admin", "ata"]),
  async (req: AuthRequest, res, next) => {
    try {
      const { aula_id, data, ora_inizio, ora_fine, note, classi } = req.body;

      const aulaId = parseId(aula_id);

      if (!aulaId || !data || !ora_inizio || !ora_fine) {
        res.status(400).json({ error: "Campi mancanti", code: "MISSING_FIELDS" });
        return;
      }

      if (!/^\d{4}-\d{2}-\d{2}$/.test(data)) {
        res.status(400).json({ error: "Data non valida", code: "INVALID_DATE" });
        return;
      }

      if (!isTimeValid(ora_inizio) || !isTimeValid(ora_fine)) {
        res.status(400).json({ error: "Orario non valido", code: "INVALID_TIME" });
        return;
      }

      const start = Number(ora_inizio.replace(":", ""));
      const end = Number(ora_fine.replace(":", ""));

      if (end <= start) {
        res.status(400).json({ error: "Intervallo orario non valido", code: "INVALID_RANGE" });
        return;
      }

      const aula = await Aula.findByPk(aulaId);

      if (!aula) {
        res.status(404).json({ error: "Aula non trovata", code: "NOT_FOUND" });
        return;
      }

      const conflitti = await Prenotazione.findAll({
        where: {
          aula_id: aulaId,
          data,
          ora_inizio: { [Op.lt]: ora_fine },
          ora_fine: { [Op.gt]: ora_inizio },
        },
      });

      if (conflitti.length > 0) {
        res.status(409).json({ error: "Conflitto orario", code: "OVERLAP" });
        return;
      }

      if (!req.user) {
        res.status(401).json({ error: "Non autenticato", code: "UNAUTHORIZED" });
        return;
      }

      const nuova = await Prenotazione.create({
        utente_id: req.user.id,
        aula_id: aulaId,
        data,
        ora_inizio,
        ora_fine,
        note: note ?? null,
      });

      if (Array.isArray(classi) && classi.length > 0) {
        await nuova.setClassi(classi);
      }

      const result = await Prenotazione.findByPk(nuova.id, {
        include: INCLUDE_FULL,
      });

      res.status(201).json({ data: result });
    } catch (err) {
      next(err);
    }
  }
);

router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["docente", "ata", "admin"]),
  checkOwner,
  async (req, res, next) => {
    try {
      const id = parseId(req.params.id);

      if (!id) {
        res.status(400).json({ error: "ID non valido", code: "INVALID_ID" });
        return;
      }

      const prenotazione = await Prenotazione.findByPk(id);

      if (!prenotazione) {
        res.status(404).json({ error: "Non trovata", code: "NOT_FOUND" });
        return;
      }

      await prenotazione.destroy();

      res.json({ message: "Eliminata con successo" });
    } catch (err) {
      next(err);
    }
  }
);

export default router;