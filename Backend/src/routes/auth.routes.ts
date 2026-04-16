import { Router, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Utente } from "../models/Utente";
import { authMiddleware, AuthRequest } from "../middleware/auth.middleware";
import { validate } from "../middleware/validation.middleware";
import { googleAuthSchema } from "../schemas/auth.schema";

const router = Router();
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

router.post("/google", validate(googleAuthSchema), async (req: Request, res: Response): Promise<void> => {
  const { credential } = req.body as { credential: string };

  let email: string;

  try {
    const ticket = await googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID!,
    });

    const payload = ticket.getPayload();

    if (!payload?.email) {
      res.status(401).json({ error: "Token Google non valido", code: "INVALID_GOOGLE_TOKEN" });
      return;
    }

    email = payload.email.toLowerCase().trim();
  } catch {
    res.status(401).json({ error: "Verifica token Google fallita", code: "GOOGLE_VERIFY_FAILED" });
    return;
  }

  const utente = await Utente.findOne({ where: { email } });

  if (!utente) {
    res.status(403).json({ error: "Utente non autorizzato", code: "USER_NOT_FOUND" });
    return;
  }

  if (!utente.attivo) {
    res.status(403).json({ error: "Account disabilitato", code: "ACCOUNT_DISABLED" });
    return;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    res.status(500).json({ error: "JWT_SECRET non configurato", code: "SERVER_ERROR" });
    return;
  }

  const token = jwt.sign({ id: utente.id, email: utente.email, ruolo: utente.ruolo }, secret, { expiresIn: "8h" });

  res.json({
    token,
    user: {
      id: utente.id,
      email: utente.email,
      nome: utente.nome,
      cognome: utente.cognome,
      ruolo: utente.ruolo,
      attivo: utente.attivo,
    },
  });
});

router.get("/me", authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  const user = req.user!;
  const utente = await Utente.findByPk(user.id, { attributes: ["id", "email", "nome", "cognome", "ruolo", "attivo"] });
  if (!utente) {
    res.status(404).json({ error: "Utente non trovato", code: "NOT_FOUND" });
    return;
  }
  res.json({ user: utente });
});

router.post("/logout", (_req: Request, res: Response): void => {
  res.json({ message: "Logout effettuato. Rimuovi il token lato client." });
});

export default router;
