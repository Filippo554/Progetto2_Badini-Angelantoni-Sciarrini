import { Router } from "express";
import { Aula } from "../models/Aula";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

function isValidId(id: unknown): id is number {
  return typeof id === "number" && Number.isInteger(id) && id > 0;
}

// GET tutte le aule
router.get("/", authMiddleware, async (_req, res) => {
  try {
    const aule = await Aula.findAll({
      order: [["numero", "ASC"]],
    });

    res.json({ success: true, data: aule });
  } catch {
    res.status(500).json({
      success: false,
      error: "Errore nel recupero delle aule",
    });
  }
});

// GET aula per ID
router.get("/:id", authMiddleware, async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (!isValidId(id)) {
      return res.status(400).json({
        success: false,
        error: "ID aula non valido",
      });
    }

    const aula = await Aula.findByPk(id);

    if (!aula) {
      return res.status(404).json({
        success: false,
        error: "Aula non trovata",
      });
    }

    res.json({ success: true, data: aula });
  } catch {
    res.status(500).json({
      success: false,
      error: "Errore server",
    });
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

      const numeroAula = Number(numero);

      if (!Number.isInteger(numeroAula) || numeroAula < 1 || numeroAula > 119) {
        return res.status(400).json({
          success: false,
          error: "Numero aula non valido (1-119)",
        });
      }

      const esistente = await Aula.findOne({
        where: { numero: numeroAula },
      });

      if (esistente) {
        return res.status(409).json({
          success: false,
          error: "Aula già esistente",
        });
      }

      const nuovaAula = await Aula.create({
        numero: numeroAula,
        capienza: Number(capienza) || 30,
        descrizione: descrizione ?? null,
        piano: piano ?? null,
      });

      res.status(201).json({
        success: true,
        data: nuovaAula,
      });
    } catch {
      res.status(500).json({
        success: false,
        error: "Errore creazione aula",
      });
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

      if (!isValidId(id)) {
        return res.status(400).json({
          success: false,
          error: "ID aula non valido",
        });
      }

      const aula = await Aula.findByPk(id);

      if (!aula) {
        return res.status(404).json({
          success: false,
          error: "Aula non trovata",
        });
      }

      await aula.destroy();

      res.json({
        success: true,
        message: "Aula eliminata con successo",
      });
    } catch {
      res.status(500).json({
        success: false,
        error: "Errore eliminazione aula",
      });
    }
  }
);

export default router;