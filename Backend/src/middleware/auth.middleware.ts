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

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET non configurato");
  return secret;
}

function extractToken(header?: string): string | null {
  if (!header) return null;

  const [scheme, token] = header.split(" ");
  if (scheme !== "Bearer" || !token) return null;

  return token;
}

function isAuthUser(payload: any): payload is AuthUser {
  const validRoles: RuoloUtente[] = ["studente", "docente", "ata", "admin"];

  return (
    payload &&
    typeof payload.id === "number" &&
    typeof payload.email === "string" &&
    validRoles.includes(payload.ruolo)
  );
}

export function authMiddleware(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const token = extractToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({
      error: "Token mancante",
      code: "NO_TOKEN",
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, getJWTSecret()) as JwtPayload;

    if (!isAuthUser(decoded)) {
      res.status(401).json({
        error: "Token non valido",
        code: "INVALID_TOKEN",
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
      error: "Token non valido o scaduto",
      code: "UNAUTHORIZED",
    });
  }
}