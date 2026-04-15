import pool from '../db/pool';
import { Aula } from '../models/interfaces';

export class AuleRepository {

  async findAll(): Promise<Aula[]> {
    const [rows] = await pool.query(
      'SELECT id, numero, capienza, descrizione, piano FROM aula ORDER BY numero'
    ) as [any[], any];
    return rows;
  }

  async checkDisponibilita(
    aula_id: number, data: string, ora_inizio: string, ora_fine: string, exclude_id?: number
  ) {
    let query = `
      SELECT id, ora_inizio, ora_fine FROM prenotazione
      WHERE aula_id = ? AND data = ? AND ora_inizio < ? AND ora_fine > ?
    `;
    const params: unknown[] = [aula_id, data, ora_fine, ora_inizio];
    if (exclude_id) { params.push(exclude_id); query += ' AND id != ?'; }
    const [rows] = await pool.query(query, params) as [any[], any];
    return rows;
  }
}
