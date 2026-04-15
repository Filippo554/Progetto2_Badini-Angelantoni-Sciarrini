import { Router } from "express";
import { Utente, RuoloUtente } from "../models/Utente";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { validate } from "../middleware/validation.middleware";
import { z } from "zod";

const router = Router();

const idParamSchema = z.object({ params: z.object({ id: z.coerce.number().int().positive() }) });
const userBodySchema = z.object({
  body: z.object({
    email: z.string().email(),
    nome: z.string().trim().min(2).max(100),
    cognome: z.string().trim().min(2).max(100),
    ruolo: z.enum(["studente", "docente", "ata", "admin"] as [RuoloUtente, ...RuoloUtente[]]).optional(),
    attivo: z.boolean().optional(),
  }),
});
const updateUserBodySchema = z.object({ body: userBodySchema.shape.body.partial().refine((data: any) => Object.keys(data).length > 0, { message: "Almeno un campo da aggiornare è obbligatorio" }) });

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

router.get("/", authMiddleware, roleMiddleware(["admin"]), async (_req, res, next) => {
  try {
    const utenti = await Utente.findAll({ order: [["cognome", "ASC"], ["nome", "ASC"]] });
    res.json({ data: utenti });
  } catch (err) {
    next(err);
  }
});

router.get("/:id", authMiddleware, validate(idParamSchema), async (req, res, next) => {
  try {
    const utente = await Utente.findByPk(Number(req.params.id));
    if (!utente) {
      res.status(404).json({ error: "Utente non trovato", code: "NOT_FOUND" });
      return;
    }
    res.json({ data: utente });
  } catch (err) {
    next(err);
  }
});

router.post("/", authMiddleware, roleMiddleware(["admin"]), validate(userBodySchema), async (req, res, next) => {
  try {
    const payload = { ...req.body, email: normalizeEmail(req.body.email) };
    const esistente = await Utente.findOne({ where: { email: payload.email } });
    if (esistente) {
      res.status(409).json({ error: "Utente già esistente", code: "ALREADY_EXISTS" });
      return;
    }
    const nuovo = await Utente.create(payload);
    res.status(201).json({ data: nuovo });
  } catch (err) {
    next(err);
  }
});

router.put("/:id", authMiddleware, roleMiddleware(["admin"]), validate(idParamSchema), validate(updateUserBodySchema), async (req, res, next) => {
  try {
    const utente = await Utente.findByPk(Number(req.params.id));
    if (!utente) {
      res.status(404).json({ error: "Utente non trovato", code: "NOT_FOUND" });
      return;
    }
    const payload = { ...req.body };
    if (payload.email) {
      payload.email = normalizeEmail(payload.email);
      if (payload.email !== utente.email) {
        const dup = await Utente.findOne({ where: { email: payload.email } });
        if (dup) {
          res.status(409).json({ error: "Email già in uso", code: "ALREADY_EXISTS" });
          return;
        }
      }
    }
    await utente.update(payload);
    res.json({ data: utente });
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", authMiddleware, roleMiddleware(["admin"]), validate(idParamSchema), async (req, res, next) => {
  try {
    const utente = await Utente.findByPk(Number(req.params.id));
    if (!utente) {
      res.status(404).json({ error: "Utente non trovato", code: "NOT_FOUND" });
      return;
    }
    await utente.destroy();
    res.json({ message: "Utente eliminato con successo" });
  } catch (err) {
    next(err);
  }
});

export default router;
