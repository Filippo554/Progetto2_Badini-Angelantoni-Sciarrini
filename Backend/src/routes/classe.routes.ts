import { Router } from "express";
import { Classe } from "../models/Classe";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { classeIdParamSchema, createClasseSchema, updateClasseSchema } from "../schemas/classe.schema";

const router = Router();

router.get("/", authMiddleware, async (_req, res, next) => {
  try {
    const classi = await Classe.findAll({ order: [["anno", "ASC"], ["nome", "ASC"]] });
    res.json({ data: classi });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, validate(classeIdParamSchema), async (req, res, next) => {
  try {
    const classe = await Classe.findByPk(Number(req.params.id));
    if (!classe) {
      res.status(404).json({ error: "Classe non trovata", code: "NOT_FOUND" });
      return;
    }
    res.json({ data: classe });
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, roleMiddleware(["admin"]), validate(createClasseSchema), async (req, res, next) => {
  try {
    const payload = { ...req.body, nome: req.body.nome.trim().toUpperCase() };
    const exists = await Classe.findOne({ where: { nome: payload.nome } });
    if (exists) {
      res.status(409).json({ error: "Classe già esistente", code: "ALREADY_EXISTS" });
      return;
    }
    const nuova = await Classe.create(payload);
    res.status(201).json({ data: nuova });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, roleMiddleware(["admin"]), validate(classeIdParamSchema), validate(updateClasseSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const classe = await Classe.findByPk(id);
    if (!classe) {
      res.status(404).json({ error: "Classe non trovata", code: "NOT_FOUND" });
      return;
    }
    const payload = { ...req.body };
    if (payload.nome) payload.nome = payload.nome.trim().toUpperCase();
    if (payload.nome && payload.nome !== classe.nome) {
      const dup = await Classe.findOne({ where: { nome: payload.nome } });
      if (dup) {
        res.status(409).json({ error: "Classe già esistente", code: "ALREADY_EXISTS" });
        return;
      }
    }
    await classe.update(payload);
    res.json({ data: classe });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), validate(classeIdParamSchema), async (req, res, next) => {
  try {
    const classe = await Classe.findByPk(Number(req.params.id));
    if (!classe) {
      res.status(404).json({ error: "Classe non trovata", code: "NOT_FOUND" });
      return;
    }
    await classe.destroy();
    res.json({ message: "Classe eliminata con successo" });
  } catch (err) {
    next(err);
  }
});

export default router;
