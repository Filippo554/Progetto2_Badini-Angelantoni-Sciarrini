import { Socket } from "socket.io";

export type RuoloUtente = "studente" | "docente" | "ata" | "admin";

export interface WSUser {
  id: number;
  email: string;
  ruolo: RuoloUtente;
}

export interface AuthSocket extends Socket {
  user?: WSUser;
}

export interface PrenotazionePayload {
  id: number;
  aula_id: number;
  utente_id: number | null;
  data: string;
  ora_inizio: string;
  ora_fine: string;
}

export interface AulaPayload {
  id: number;
  numero: number;
  capienza: number;
}

export interface ClassePayload {
  id: number;
  nome: string;
  anno: number;
}

export interface WSMessage<T = unknown> {
  event: string;
  data: T;
}