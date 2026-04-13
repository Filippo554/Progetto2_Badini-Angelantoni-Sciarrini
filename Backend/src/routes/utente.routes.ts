import { Router } from "express";
import { Utente } from "../models/Utente";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

function parseId(id: unknown): number | null {
  const n = Number(id);
  return Number.isInteger(n) && n > 0 ? n : null;
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// GET tutti utenti (solo admin)
router.get(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (_req, res) => {
    try {
      const utenti = await Utente.findAll({
        order: [["cognome", "ASC"]],
      });

      res.json({ data: utenti });
    } catch {
      res.status(500).json({ error: "Errore recupero utenti" });
    }
  }
);

// GET utente per ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = parseId(req.params.id);

    if (!id) {
      res.status(400).json({ error: "ID non valido" });
      return;
    }

    const utente = await Utente.findByPk(id);

    if (!utente) {
      res.status(404).json({ error: "Utente non trovato" });
      return;
    }

    res.json({ data: utente });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

// CREATE utente (solo admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { email, nome, cognome, ruolo } = req.body;

      if (!email || !nome || !cognome) {
        res.status(400).json({ error: "Dati mancanti" });
        return;
      }

      const emailNorm = normalizeEmail(email);

      const esistente = await Utente.findOne({
        where: { email: emailNorm },
      });

      if (esistente) {
        res.status(409).json({ error: "Utente già esistente" });
        return;
      }

      const nuovo = await Utente.create({
        email: emailNorm,
        nome: nome.trim(),
        cognome: cognome.trim(),
        ruolo: ruolo ?? "studente",
      });

      res.status(201).json({ data: nuovo });
    } catch {
      res.status(500).json({ error: "Errore creazione utente" });
    }
  }
);

// DELETE utente (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const id = parseId(req.params.id);

      if (!id) {
        res.status(400).json({ error: "ID non valido" });
        return;
      }

      const utente = await Utente.findByPk(id);

      if (!utente) {
        res.status(404).json({ error: "Utente non trovato" });
        return;
      }

      await utente.destroy();

      res.json({ message: "Utente eliminato con successo" });
    } catch {
      res.status(500).json({ error: "Errore eliminazione utente" });
    }
  }
);

export default router;