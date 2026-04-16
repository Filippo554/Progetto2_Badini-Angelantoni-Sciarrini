import { Router } from 'express';
import { authMiddleware, AuthRequest } from '../middleware/auth.middleware';
import { roleMiddleware } from '../middleware/role.middleware';
import { validate } from '../middleware/validation.middleware';
import {
  createPrenotazioneSchema,
  prenotazioneIdParamSchema,
  prenotazioniQuerySchema,
  updatePrenotazioneSchema,
} from '../schemas/prenotazione.schema';
import { PrenotazioniService } from '../services/prenotazioni.service';

const router = Router();

router.get('/', authMiddleware, validate(prenotazioniQuerySchema), async (req, res, next) => {
  try {
    const data = await PrenotazioniService.list(req.query as any);
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.get('/:id', authMiddleware, validate(prenotazioneIdParamSchema), async (req, res, next) => {
  try {
    const data = await PrenotazioniService.getById(Number(req.params.id));
    res.json({ data });
  } catch (err) {
    next(err);
  }
});

router.post(
  '/',
  authMiddleware,
  roleMiddleware(['docente', 'ata', 'admin']),
  validate(createPrenotazioneSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const data = await PrenotazioniService.create({ ...req.body, utente_id: req.user!.id });
      res.status(201).json({ data });
    } catch (err) {
      next(err);
    }
  },
);

router.put(
  '/:id',
  authMiddleware,
  roleMiddleware(['docente', 'ata', 'admin']),
  validate(prenotazioneIdParamSchema),
  validate(updatePrenotazioneSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const data = await PrenotazioniService.update(Number(req.params.id), req.user!, req.body);
      res.json({ data });
    } catch (err) {
      next(err);
    }
  },
);

router.delete(
  '/:id',
  authMiddleware,
  roleMiddleware(['docente', 'ata', 'admin']),
  validate(prenotazioneIdParamSchema),
  async (req: AuthRequest, res, next) => {
    try {
      const data = await PrenotazioniService.delete(Number(req.params.id), req.user!);
      res.json(data);
    } catch (err) {
      next(err);
    }
  },
);

export default router;
