import { Router } from "express";
import { Classe } from "../models/Classe";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { isValidId } from "../utils/validate";

const router = Router();

// GET all
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const classi = await Classe.findAll({
      order: [["anno", "ASC"], ["nome", "ASC"]],
    });

    res.json(classi);
  } catch {
    res.status(500).json({ error: "Errore nel recupero classi" });
  }
});

// GET by id
router.get("/:id", authMiddleware, async (req, res) => {
  const id = Number(req.params.id);

  if (!isValidId(id)) {
    return res.status(400).json({ error: "ID non valido" });
  }

  try {
    const classe = await Classe.findByPk(id);

    if (!classe) {
      return res.status(404).json({ error: "Classe non trovata" });
    }

    res.json(classe);
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

// CREATE
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { nome, indirizzo, anno } = req.body;

      if (!nome || !anno) {
        return res.status(400).json({ error: "Dati mancanti" });
      }

      const annoNum = Number(anno);

      if (!Number.isInteger(annoNum) || annoNum < 1 || annoNum > 5) {
        return res.status(400).json({ error: "Anno non valido" });
      }

      const exists = await Classe.findOne({
        where: { nome: nome.trim(), anno: annoNum },
      });

      if (exists) {
        return res.status(409).json({ error: "Classe già esistente" });
      }

      const nuova = await Classe.create({
        nome: nome.trim(),
        indirizzo: indirizzo?.trim() ?? null,
        anno: annoNum,
      });

      res.status(201).json(nuova);
    } catch {
      res.status(500).json({ error: "Errore creazione classe" });
    }
  }
);

// DELETE
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({ error: "ID non valido" });
    }

    try {
      const classe = await Classe.findByPk(id);

      if (!classe) {
        return res.status(404).json({ error: "Classe non trovata" });
      }

      await classe.destroy();

      res.json({ message: "Eliminata" });
    } catch {
      res.status(500).json({ error: "Errore eliminazione" });
    }
  }
);

export default router;