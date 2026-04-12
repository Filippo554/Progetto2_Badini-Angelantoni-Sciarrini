import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

export type RuoloUtente = "studente" | "docente" | "ata" | "admin";

export interface AuthUser {
  id: number;
  email: string;
  ruolo: RuoloUtente;
}

export interface AuthRequest extends Request {
  user?: AuthUser;
}

// secret sicuro
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET non definito");
  }

  return secret;
}

// estrazione token robusta
function extractToken(header?: string): string {
  if (!header) {
    throw new Error("Token mancante");
  }

  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    throw new Error("Formato Authorization non valido");
  }

  return token;
}

// type guard
function isAuthUser(payload: unknown): payload is AuthUser {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;

  return (
    typeof p.id === "number" &&
    typeof p.email === "string" &&
    typeof p.ruolo === "string"
  );
}

// middleware auth
export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  try {
    const token = extractToken(req.headers.authorization);

    const decoded = jwt.verify(token, getJWTSecret());

    if (typeof decoded === "string") {
      res.status(401).json({ error: "Token non valido" });
      return;
    }

    const payload = decoded as JwtPayload;

    if (!isAuthUser(payload)) {
      res.status(401).json({ error: "Token malformato" });
      return;
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      ruolo: payload.ruolo as RuoloUtente,
    };

    next();
  } catch (err) {
    res.status(401).json({
      error:
        err instanceof Error ? err.message : "Token non valido o scaduto",
    });
  }
}