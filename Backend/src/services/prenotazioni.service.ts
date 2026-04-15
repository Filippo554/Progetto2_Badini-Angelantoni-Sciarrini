import { Prenotazione } from "../models/Prenotazione";
import { Aula } from "../models/Aula";
import { Classe } from "../models/Classe";
import { Utente } from "../models/Utente";

export interface CreatePrenotazioneDTO {
  utente_id?: number | null;
  aula_id: number;
  data: string;
  ora_inizio: string;
  ora_fine: string;
  note?: string | null;
  classi_ids?: number[];
}

function cleanString(v?: string | null): string | undefined {
  if (typeof v !== "string") return undefined;
  const t = v.trim();
  return t.length ? t : undefined;
}

function isValidTimeRange(start: string, end: string): boolean {
  return start < end;
}

export class PrenotazioniService {
  static async create(data: CreatePrenotazioneDTO) {
    if (!isValidTimeRange(data.ora_inizio, data.ora_fine)) {
      throw new Error("Ora fine deve essere maggiore di ora inizio");
    }

    const aula = await Aula.findByPk(data.aula_id);
    if (!aula) throw new Error("Aula non trovata");

    const overlap = await Prenotazione.findOne({
      where: {
        aula_id: data.aula_id,
        data: data.data,
      },
    });

    if (overlap) {
      const startA = overlap.ora_inizio;
      const endA = overlap.ora_fine;

      if (
        (data.ora_inizio >= startA && data.ora_inizio < endA) ||
        (data.ora_fine > startA && data.ora_fine <= endA)
      ) {
        throw new Error("Conflitto orario con prenotazione esistente");
      }
    }

    const prenotazione = await Prenotazione.create({
      utente_id: data.utente_id ?? null,
      aula_id: data.aula_id,
      data: data.data,
      ora_inizio: data.ora_inizio,
      ora_fine: data.ora_fine,
      note: cleanString(data.note) ?? null,
    });

    if (data.classi_ids?.length) {
      const classi = await Classe.findAll({
        where: { id: data.classi_ids },
      });

      await prenotazione.setClassi(classi);
    }

    return prenotazione;
  }

  static async getAll() {
    return Prenotazione.findAll({
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
      order: [["data", "DESC"]],
    });
  }

  static async getById(id: number) {
    return Prenotazione.findByPk(id, {
      include: [
        { model: Aula, as: "aula" },
        { model: Utente, as: "utente" },
        { model: Classe, as: "classi" },
      ],
    });
  }

  static async delete(id: number) {
    const p = await Prenotazione.findByPk(id);
    if (!p) return false;

    await p.destroy();
    return true;
  }
}