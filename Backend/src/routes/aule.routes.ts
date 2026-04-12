import { Router } from "express";
import { Aula } from "../models/Aula";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// GET tutte le aule
router.get("/", authMiddleware, async (req, res) => {
  try {
    const aule = await Aula.findAll({
      order: [["numero", "ASC"]],
    });

    res.json({ data: aule });
  } catch {
    res.status(500).json({ error: "Errore nel recupero delle aule" });
  }
});

// GET aula per ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(400).json({ error: "ID aula non valido" });
      return;
    }

    const aula = await Aula.findByPk(id);

    if (!aula) {
      res.status(404).json({ error: "Aula non trovata" });
      return;
    }

    res.json({ data: aula });
  } catch {
    res.status(500).json({ error: "Errore server" });
  }
});

// CREATE aula (solo admin)
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const { numero, capienza, descrizione, piano } = req.body;

      if (numero === undefined) {
        res.status(400).json({ error: "Numero aula obbligatorio" });
        return;
      }

      const numeroAula = Number(numero);

      if (Number.isNaN(numeroAula)) {
        res.status(400).json({ error: "Numero aula non valido" });
        return;
      }

      if (numeroAula < 1 || numeroAula > 119) {
        res.status(400).json({
          error: "Numero aula deve essere tra 1 e 119",
        });
        return;
      }

      const esistente = await Aula.findOne({
        where: { numero: numeroAula },
      });

      if (esistente) {
        res.status(409).json({ error: "Aula già esistente" });
        return;
      }

      const nuovaAula = await Aula.create({
        numero: numeroAula,
        capienza: capienza ?? 30,
        descrizione: descrizione ?? null,
        piano: piano ?? null,
      });

      res.status(201).json({ data: nuovaAula });
    } catch {
      res.status(500).json({ error: "Errore creazione aula" });
    }
  }
);

// DELETE aula (solo admin)
router.delete(
  "/:id",
  authMiddleware,
  roleMiddleware(["admin"]),
  async (req, res) => {
    try {
      const id = Number(req.params.id);

      if (Number.isNaN(id)) {
        res.status(400).json({ error: "ID aula non valido" });
        return;
      }

      const aula = await Aula.findByPk(id);

      if (!aula) {
        res.status(404).json({ error: "Aula non trovata" });
        return;
      }

      await aula.destroy();

      res.json({ message: "Aula eliminata con successo" });
    } catch {
      res.status(500).json({ error: "Errore eliminazione aula" });
    }
  }
);

export default router;