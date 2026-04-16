
import { AuthSocket, WSUser } from "./types";
import { WS_EVENTS } from "./events";

export function handleConnection(socket: any, io: any) {
  const user = (socket as AuthSocket).user as WSUser | undefined;

  if (!user) {
    socket.disconnect();
    return;
  }

  // room utente personale
  socket.join(`user:${user.id}`);

  // room per ruolo
  socket.join(`role:${user.ruolo}`);

  // admin room
  if (user.ruolo === "admin") {
    socket.join("admins");
  }

  console.log(`[WS] User connected: ${user.email} (${user.ruolo})`);

  socket.on("disconnect", () => {
    console.log(`[WS] User disconnected: ${user.email}`);
  });

  socket.on("ping", (cb: any) => {
    if (typeof cb === "function") cb("pong");
  });


  socket.on("join:aula", (aulaId: number) => {
    socket.join(`aula:${aulaId}`);
  });

  socket.on("leave:aula", (aulaId: number) => {
    socket.leave(`aula:${aulaId}`);
  });
}

export function emitPrenotazioneCreata(io: any, data: unknown) {
  io.emit(WS_EVENTS.PRENOTAZIONE_CREATED, data);
}

export function emitPrenotazioneAggiornata(io: any, data: unknown) {
  io.emit(WS_EVENTS.PRENOTAZIONE_UPDATED, data);
}

export function emitPrenotazioneEliminata(io: any, id: number) {
  io.emit(WS_EVENTS.PRENOTAZIONE_DELETED, { id });
}

export function emitAulaAggiornata(io: any, data: unknown) {
  io.emit(WS_EVENTS.AULA_UPDATED, data);
}

export function emitClasseAggiornata(io: any, data: unknown) {
  io.emit(WS_EVENTS.CLASSE_UPDATED, data);
}