import { Utente } from "../models/Utente";
import { RuoloUtente } from "../models/Utente";

export interface CreateUtenteDTO {
  email: string;
  nome: string;
  cognome: string;
  ruolo?: RuoloUtente;
  attivo?: boolean;
}

export interface UpdateUtenteDTO {
  email?: string;
  nome?: string;
  cognome?: string;
  ruolo?: RuoloUtente;
  attivo?: boolean;
}

function clean(value?: string): string | undefined {
  if (typeof value !== "string") return undefined;
  const v = value.trim();
  return v.length ? v : undefined;
}

export class UtenteService {
  static async create(data: CreateUtenteDTO) {
    return Utente.create({
      email: data.email.trim().toLowerCase(),
      nome: data.nome.trim(),
      cognome: data.cognome.trim(),
      ruolo: data.ruolo ?? "studente",
      attivo: data.attivo ?? true,
    });
  }

  static async getAll() {
    return Utente.findAll();
  }

  static async getById(id: number) {
    return Utente.findByPk(id);
  }

  static async update(id: number, data: UpdateUtenteDTO) {
    const utente = await Utente.findByPk(id);
    if (!utente) return null;

    const payload: any = {};

    const email = clean(data.email);
    const nome = clean(data.nome);
    const cognome = clean(data.cognome);

    if (email !== undefined) payload.email = email.toLowerCase();
    if (nome !== undefined) payload.nome = nome;
    if (cognome !== undefined) payload.cognome = cognome;
    if (data.ruolo !== undefined) payload.ruolo = data.ruolo;
    if (data.attivo !== undefined) payload.attivo = data.attivo;

    await utente.update(payload);

    return utente;
  }

  static async delete(id: number) {
    const utente = await Utente.findByPk(id);
    if (!utente) return false;

    await utente.destroy();
    return true;
  }
}