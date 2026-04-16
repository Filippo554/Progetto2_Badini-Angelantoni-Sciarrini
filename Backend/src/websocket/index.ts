const { Server: SocketIOServer } = require("socket.io");
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import { WSUser } from "./types";
import { WS_EVENTS } from "./events";
import { handleConnection } from "./handlers";

type JwtDecoded = {
  id: number;
  email: string;
  ruolo: "studente" | "docente" | "ata" | "admin";
};

let io: any;

function getJWTSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET mancante");
  return secret;
}

function verifyToken(token: string): WSUser {
  const decoded = jwt.verify(token, getJWTSecret()) as JwtDecoded;

  const validRuoli = ["studente", "docente", "ata", "admin"] as const;

  if (
    typeof decoded.id !== "number" ||
    typeof decoded.email !== "string" ||
    !validRuoli.includes(decoded.ruolo)
  ) {
    throw new Error("Token non valido");
  }

  return {
    id: decoded.id,
    email: decoded.email,
    ruolo: decoded.ruolo,
  };
}

export function initWebSocket(server: HttpServer): any {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.FRONTEND_URL || "http://localhost:4200",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket: any, next: any) => {
    try {
      const token =
        socket.handshake.auth?.token ||
        socket.handshake.headers.authorization?.split(" ")[1];

      if (!token) {
        return next(new Error("Token mancante"));
      }

      const user = verifyToken(token);
      (socket as any).user = user;

      return next();
    } catch {
      return next(new Error("Autenticazione fallita"));
    }
  });

  io.on("connection", (socket: any) => {
    handleConnection(socket, io);
  });

  return io;
}

export function getIO(): any {
  if (!io) throw new Error("WebSocket non inizializzato");
  return io;
}

export function emitPrenotazioneCreata(data: unknown) {
  getIO().emit(WS_EVENTS.PRENOTAZIONE_CREATED, data);
}

export function emitPrenotazioneAggiornata(data: unknown) {
  getIO().emit(WS_EVENTS.PRENOTAZIONE_UPDATED, data);
}

export function emitPrenotazioneEliminata(id: number) {
  getIO().emit(WS_EVENTS.PRENOTAZIONE_DELETED, { id });
}