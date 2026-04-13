import { Router } from "express";
import { Classe } from "../models/Classe";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

function isValidId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

// GET tutte le classi
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const classi = await Classe.findAll({
      order: [
        ["anno", "ASC"],
        ["nome", "ASC"],
      ],
    });

    res.json({ data: classi });
  } catch {
    res.status(500).json({ error: "Errore nel recupero delle classi" });
  }
});

// GET classe per ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      res.status(400).json({ error: "ID non valido" });
      return;
    }

    const classe = await Classe.findByPk(id);

    if (!classe) {
      res.status(404).json({ error: "Classe non trovata" });
      return;
    }

    res.json({ data: classe });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

// CREATE classe (solo admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { nome, indirizzo, anno } = req.body;

      if (!nome || !indirizzo || anno === undefined) {
        res.status(400).json({ error: "Dati mancanti" });
        return;
      }

      const annoNum = Number(anno);

      if (!Number.isInteger(annoNum)) {
        res.status(400).json({ error: "Anno non valido" });
        return;
      }

      if (annoNum < 1 || annoNum > 5) {
        res.status(400).json({
          error: "Anno deve essere tra 1 e 5",
        });
        return;
      }

      const esistente = await Classe.findOne({
        where: {
          nome: nome.trim(),
          anno: annoNum,
        },
      });

      if (esistente) {
        res.status(409).json({ error: "Classe già esistente" });
        return;
      }

      const nuovaClasse = await Classe.create({
        nome: nome.trim(),
        indirizzo: indirizzo.trim(),
        anno: annoNum,
      });

      res.status(201).json({ data: nuovaClasse });
    } catch {
      res.status(500).json({ error: "Errore creazione classe" });
    }
  }
);

// DELETE classe (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (!isValidId(id)) {
        res.status(400).json({ error: "ID non valido" });
        return;
      }

      const classe = await Classe.findByPk(id);

      if (!classe) {
        res.status(404).json({ error: "Classe non trovata" });
        return;
      }

      await classe.destroy();

      res.json({ message: "Classe eliminata con successo" });
    } catch {
      res.status(500).json({ error: "Errore eliminazione classe" });
    }
  }
);

export default router;