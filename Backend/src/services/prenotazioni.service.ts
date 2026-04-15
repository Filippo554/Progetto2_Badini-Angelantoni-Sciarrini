import { PrenotazioniRepository } from '../repositories/prenotazioni.repository';
import { CreatePrenotazioneDto } from '../models/interfaces';
import { broadcast } from '../websocket';

const repo = new PrenotazioniRepository();

export class PrenotazioniService {

  async getAll(filters: {
    aula_id?: number; classe_id?: number;
    data?: string; settimana?: number; anno?: number;
  }) {
    return repo.findAll(filters);
  }

  async getById(id: number) {
    const p = await repo.findById(id);
    if (!p) throw { status: 404, message: 'Prenotazione non trovata' };
    return p;
  }

  async create(dto: CreatePrenotazioneDto, utente_id: number) {
    if (!dto.aula_id || !dto.data || !dto.ora_inizio || !dto.ora_fine)
      throw { status: 400, message: 'Campi obbligatori mancanti: aula_id, data, ora_inizio, ora_fine' };
    if (dto.ora_fine <= dto.ora_inizio)
      throw { status: 400, message: 'ora_fine deve essere successiva a ora_inizio' };

    const conflitti = await repo.checkOverlap(dto.aula_id, dto.data, dto.ora_inizio, dto.ora_fine);
    if (conflitti.length > 0)
      throw { status: 409, message: 'L\'aula è già prenotata nell\'intervallo orario selezionato', code: 'OVERLAP_CONFLICT', conflitti };

    const id = await repo.create(dto, utente_id);
    broadcast('PRENOTAZIONE_CREATA', { id, ...dto });
    return id;
  }

  async delete(id: number, utente_id: number, ruolo: string) {
    const p = await repo.findOwner(id);
    if (!p) throw { status: 404, message: 'Prenotazione non trovata' };
    if (ruolo !== 'admin' && p.utente_id !== utente_id)
      throw { status: 403, message: 'Non puoi eliminare una prenotazione di un altro utente' };
    await repo.delete(id);
    broadcast('PRENOTAZIONE_ELIMINATA', { id });
  }
}
