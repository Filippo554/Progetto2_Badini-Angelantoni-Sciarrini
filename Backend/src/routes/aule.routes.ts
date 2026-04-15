import { Router } from "express";
import { Aula } from "../models/Aula";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { aulaIdParamSchema, createAulaSchema, updateAulaSchema } from "../schemas/aula.schema";

const router = Router();

router.get("/", authMiddleware, async (_req, res, next) => {
  try {
    const aule = await Aula.findAll({ order: [["numero", "ASC"]] });
    res.json({ data: aule });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, validate(aulaIdParamSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const aula = await Aula.findByPk(id);
    if (!aula) {
      res.status(404).json({ error: "Aula non trovata", code: "NOT_FOUND" });
      return;
    }
    res.json({ data: aula });
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, roleMiddleware(["admin"]), validate(createAulaSchema), async (req, res, next) => {
  try {
    const payload = req.body;
    const esistente = await Aula.findOne({ where: { numero: payload.numero } });
    if (esistente) {
      res.status(409).json({ error: "Aula già esistente", code: "ALREADY_EXISTS" });
      return;
    }
    const nuovaAula = await Aula.create(payload);
    res.status(201).json({ data: nuovaAula });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, roleMiddleware(["admin"]), validate(aulaIdParamSchema), validate(updateAulaSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const aula = await Aula.findByPk(id);
    if (!aula) {
      res.status(404).json({ error: "Aula non trovata", code: "NOT_FOUND" });
      return;
    }
    if (req.body.numero !== undefined && req.body.numero !== aula.numero) {
      const dup = await Aula.findOne({ where: { numero: req.body.numero } });
      if (dup) {
        res.status(409).json({ error: "Numero aula già in uso", code: "ALREADY_EXISTS" });
        return;
      }
    }
    await aula.update(req.body);
    res.json({ data: aula });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), validate(aulaIdParamSchema), async (req, res, next) => {
  try {
    const id = Number(req.params.id);
    const aula = await Aula.findByPk(id);
    if (!aula) {
      res.status(404).json({ error: "Aula non trovata", code: "NOT_FOUND" });
      return;
    }
    await aula.destroy();
    res.json({ message: "Aula eliminata con successo" });
  } catch (err) {
    next(err);
  }
});

export default router;
