export type RuoloUtente = 'studente' | 'docente' | 'ata' | 'admin';

export interface Utente {
  id:         number;
  nome:       string;
  cognome:    string;
  email:      string;
  ruolo:      RuoloUtente;
  created_at: Date;
}

export interface Aula {
  id:          number;
  numero:      number;
  capienza:    number;
  descrizione: string;
  piano:       number;
}

export interface Classe {
  id:        number;
  nome:      string;
  indirizzo: string;
  anno:      number;
}

export interface Prenotazione {
  id:         number;
  aula_id:    number;
  utente_id:  number | null;
  data:       string;
  ora_inizio: string;
  ora_fine:   string;
  note:       string | null;
  created_at: Date;
}

export interface PrenotazioneDettaglio extends Prenotazione {
  aula_numero:    number;
  utente_nome:    string;
  utente_cognome: string;
  classi:         Classe[];
}

export interface JwtPayload {
  id:    number;
  email: string;
  ruolo: RuoloUtente;
}

import { Request } from 'express';
export interface AuthRequest extends Request {
  user?: JwtPayload;
}

export interface CreatePrenotazioneDto {
  aula_id:     number;
  data:        string;
  ora_inizio:  string;
  ora_fine:    string;
  classi_ids?: number[];
  note?:       string;
}
