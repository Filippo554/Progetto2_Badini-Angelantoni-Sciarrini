import { Op, Transaction, WhereOptions } from 'sequelize';
import { sequelize } from '../models';
import { Prenotazione } from '../models/Prenotazione';
import { Aula } from '../models/Aula';
import { Classe } from '../models/Classe';
import { Utente } from '../models/Utente';
import { AuthUser } from '../middleware/auth.middleware';
import { badRequest, conflict, forbidden, notFound } from '../utils/appError';
import { getWeekRange, isValidTimeRange, normalizeOptionalText } from '../utils/prenotazioni';

const INCLUDE_FULL = [
  { model: Aula, as: 'aula' },
  { model: Utente, as: 'utente', attributes: ['id', 'nome', 'cognome', 'email'] },
  { model: Classe, as: 'classi', through: { attributes: [] } },
] as const;

export interface PrenotazioniQueryDTO {
  data?: string;
  settimana?: string;
  aula_id?: number;
  classe_id?: number;
}

export interface CreatePrenotazioneDTO {
  utente_id: number;
  aula_id: number;
  data: string;
  ora_inizio: string;
  ora_fine: string;
  note?: string | null;
  classi?: number[];
}

export interface UpdatePrenotazioneDTO {
  aula_id?: number;
  data?: string;
  ora_inizio?: string;
  ora_fine?: string;
  note?: string | null;
  classi?: number[];
}

export class PrenotazioniService {
  static async list(query: PrenotazioniQueryDTO) {
    const where: WhereOptions = {};

    if (query.data) {
      where['data'] = query.data;
    } else if (query.settimana) {
      const range = getWeekRange(query.settimana);
      if (!range) throw badRequest('Data settimana non valida', 'INVALID_DATE');
      where['data'] = { [Op.between]: [range.lunedi, range.domenica] };
    }

    if (query.aula_id) where['aula_id'] = query.aula_id;

    return Prenotazione.findAll({
      where,
      include: [
        { model: Aula, as: 'aula' },
        { model: Utente, as: 'utente', attributes: ['id', 'nome', 'cognome', 'email'] },
        query.classe_id
          ? { model: Classe, as: 'classi', where: { id: query.classe_id }, through: { attributes: [] } }
          : { model: Classe, as: 'classi', through: { attributes: [] } },
      ],
      order: [['data', 'ASC'], ['ora_inizio', 'ASC']],
    });
  }

  static async getById(id: number) {
    const prenotazione = await Prenotazione.findByPk(id, { include: INCLUDE_FULL as any });
    if (!prenotazione) throw notFound('Prenotazione non trovata');
    return prenotazione;
  }

  static async assertCanModify(user: AuthUser, prenotazione: Prenotazione): Promise<void> {
    if (user.ruolo === 'admin') return;
    if (prenotazione.utente_id !== user.id) {
      throw forbidden('Puoi modificare o eliminare solo le tue prenotazioni');
    }
  }

  static async create(payload: CreatePrenotazioneDTO) {
    this.ensureTimeRange(payload.ora_inizio, payload.ora_fine);
    await this.ensureAulaExists(payload.aula_id);
    await this.ensureClassiExist(payload.classi);
    await this.ensureAvailability({
      aula_id: payload.aula_id,
      data: payload.data,
      ora_inizio: payload.ora_inizio,
      ora_fine: payload.ora_fine,
    });

    return sequelize.transaction(async (transaction) => {
      const prenotazione = await Prenotazione.create(
        {
          utente_id: payload.utente_id,
          aula_id: payload.aula_id,
          data: payload.data,
          ora_inizio: payload.ora_inizio,
          ora_fine: payload.ora_fine,
          note: normalizeOptionalText(payload.note),
        },
        { transaction },
      );

      if (payload.classi?.length) {
        const classi = await Classe.findAll({ where: { id: payload.classi }, transaction });
        await prenotazione.setClassi(classi, { transaction });
      }

      return this.getById(prenotazione.id);
    });
  }

  static async update(id: number, user: AuthUser, payload: UpdatePrenotazioneDTO) {
    const prenotazione = await Prenotazione.findByPk(id);
    if (!prenotazione) throw notFound('Prenotazione non trovata');
    await this.assertCanModify(user, prenotazione);

    const nextAulaId = payload.aula_id ?? prenotazione.aula_id;
    const nextData = payload.data ?? prenotazione.data;
    const nextOraInizio = payload.ora_inizio ?? prenotazione.ora_inizio;
    const nextOraFine = payload.ora_fine ?? prenotazione.ora_fine;

    this.ensureTimeRange(nextOraInizio, nextOraFine);
    await this.ensureAulaExists(nextAulaId);
    await this.ensureClassiExist(payload.classi);
    await this.ensureAvailability(
      {
        aula_id: nextAulaId,
        data: nextData,
        ora_inizio: nextOraInizio,
        ora_fine: nextOraFine,
      },
      id,
    );

    return sequelize.transaction(async (transaction) => {
      await prenotazione.update(
        {
          aula_id: nextAulaId,
          data: nextData,
          ora_inizio: nextOraInizio,
          ora_fine: nextOraFine,
          note: payload.note !== undefined ? normalizeOptionalText(payload.note) : prenotazione.note,
        },
        { transaction },
      );

      if (payload.classi) {
        const classi = payload.classi.length
          ? await Classe.findAll({ where: { id: payload.classi }, transaction })
          : [];
        await prenotazione.setClassi(classi, { transaction });
      }

      return this.getById(prenotazione.id);
    });
  }

  static async delete(id: number, user: AuthUser) {
    const prenotazione = await Prenotazione.findByPk(id);
    if (!prenotazione) throw notFound('Prenotazione non trovata');
    await this.assertCanModify(user, prenotazione);
    await prenotazione.destroy();
    return { message: 'Prenotazione eliminata con successo' };
  }

  private static ensureTimeRange(ora_inizio: string, ora_fine: string): void {
    if (!isValidTimeRange(ora_inizio, ora_fine)) {
      throw badRequest("L'orario di inizio deve essere precedente all'orario di fine", 'INVALID_TIME_RANGE');
    }
  }

  private static async ensureAulaExists(aulaId: number): Promise<void> {
    const aula = await Aula.findByPk(aulaId);
    if (!aula) throw notFound('Aula non trovata');
  }

  private static async ensureClassiExist(classi?: number[]): Promise<void> {
    if (classi === undefined) return;
    const uniqueIds = [...new Set(classi)];
    const count = await Classe.count({ where: { id: uniqueIds } });
    if (count !== uniqueIds.length) {
      throw badRequest('Una o più classi non esistono', 'INVALID_CLASSES');
    }
  }

  private static async ensureAvailability(
    slot: { aula_id: number; data: string; ora_inizio: string; ora_fine: string },
    excludeId?: number,
    transaction?: Transaction,
  ): Promise<void> {
    const where: WhereOptions = {
      aula_id: slot.aula_id,
      data: slot.data,
      ora_inizio: { [Op.lt]: slot.ora_fine },
      ora_fine: { [Op.gt]: slot.ora_inizio },
    };

    if (excludeId) where['id'] = { [Op.ne]: excludeId };

    const existing = await Prenotazione.findOne({ where, ...(transaction ? { transaction } : {}) });
    if (existing) {
      throw conflict('Aula già prenotata in questa fascia oraria', 'OVERLAP', {
        prenotazione_id: existing.id,
      });
    }
  }
}
