import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import { Utente } from "../models/Utente";
import { RuoloUtente } from "../models/Utente";

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export interface GoogleAuthResult {
  token: string;
  user: {
    id: number;
    email: string;
    nome: string;
    cognome: string;
    ruolo: RuoloUtente;
  };
}

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET non configurato");
  return secret;
}

export async function loginWithGoogle(
  credential: string
): Promise<GoogleAuthResult> {
  if (!credential) {
    throw new Error("Credential mancante");
  }

  const ticket = await googleClient.verifyIdToken({
    idToken: credential,
    audience: process.env.GOOGLE_CLIENT_ID!,
  });

  const payload = ticket.getPayload();

  if (!payload || !payload.email) {
    throw new Error("Token Google non valido");
  }

  const email = payload.email.toLowerCase().trim();
  const nome = payload.given_name ?? email.split("@")[0] ?? "";
  const cognome = payload.family_name ?? "";

  const utente = await Utente.findOne({ where: { email } });

  if (!utente) {
    throw new Error("Utente non autorizzato");
  }

  if (!utente.attivo) {
    throw new Error("Account disabilitato");
  }

  const token = jwt.sign(
    {
      id: utente.id,
      email: utente.email,
      ruolo: utente.ruolo,
      nome,
      cognome,
    },
    getJWTSecret(),
    { expiresIn: "8h" }
  );

  return {
    token,
    user: {
      id: utente.id,
      email: utente.email,
      nome: utente.nome,
      cognome: utente.cognome,
      ruolo: utente.ruolo,
    },
  };
}

export async function getCurrentUser(userId: number) {
  const utente = await Utente.findByPk(userId, {
    attributes: ["id", "email", "nome", "cognome", "ruolo", "attivo"],
  });

  if (!utente) {
    throw new Error("Utente non trovato");
  }

  return utente;
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, getJWTSecret());
  } catch {
    throw new Error("Token non valido");
  }
}