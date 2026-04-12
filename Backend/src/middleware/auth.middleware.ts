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

// recupero secret
function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    throw new Error("JWT_SECRET non configurato");
  }

  return secret;
}

// estrazione token Bearer
function extractToken(header: string | undefined): string {
  if (!header) throw new Error("Authorization header mancante");

  const parts = header.trim().split(" ");

  if (parts.length !== 2) {
    throw new Error("Formato Authorization non valido");
  }

  const [scheme, token] = parts;

  if (scheme !== "Bearer" || !token) {
    throw new Error("Token Bearer non valido");
  }

  return token;
}

function isAuthUser(payload: unknown): payload is AuthUser {
  if (!payload || typeof payload !== "object") return false;

  const p = payload as Record<string, unknown>;

  const validRuoli: RuoloUtente[] = ["studente", "docente", "ata", "admin"];

  return (
    typeof p.id === "number" &&
    typeof p.email === "string" &&
    typeof p.ruolo === "string" &&
    validRuoli.includes(p.ruolo as RuoloUtente)
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

    const decoded = jwt.verify(token, getJWTSecret()) as JwtPayload | string;

    if (typeof decoded === "string") {
      res.status(401).json({
        error: "Token non valido",
        code: "INVALID_TOKEN",
      });
      return;
    }

    if (!isAuthUser(decoded)) {
      res.status(401).json({
        error: "Token malformato o non valido",
        code: "MALFORMED_TOKEN",
      });
      return;
    }

    req.user = {
      id: decoded.id,
      email: decoded.email,
      ruolo: decoded.ruolo,
    };

    next();
  } catch {
    res.status(401).json({
      error: "Non autorizzato",
      code: "UNAUTHORIZED",
    });
    return;
  }
}