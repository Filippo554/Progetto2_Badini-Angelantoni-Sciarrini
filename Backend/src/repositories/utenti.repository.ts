import pool from '../db/pool';
import { Utente, RuoloUtente } from '../models/interfaces';

export class UtentiRepository {

  async findAll(): Promise<Utente[]> {
    const [rows] = await pool.query(
      'SELECT id, nome, cognome, email, ruolo, created_at FROM utente ORDER BY cognome, nome'
    ) as [any[], any];
    return rows;
  }

  async findById(id: number): Promise<Utente | null> {
    const [rows] = await pool.query(
      'SELECT id, nome, cognome, email, ruolo, created_at FROM utente WHERE id = ?', [id]
    ) as [any[], any];
    return rows[0] || null;
  }

  async create(nome: string, cognome: string, email: string, ruolo: RuoloUtente): Promise<number> {
    const [result] = await pool.query(
      'INSERT INTO utente (nome, cognome, email, ruolo) VALUES (?, ?, ?, ?)',
      [nome, cognome, email, ruolo]
    ) as [any, any];
    return result.insertId;
  }

  async update(id: number, fields: Partial<Utente>): Promise<boolean> {
    const [result] = await pool.query(`
      UPDATE utente SET
        nome    = COALESCE(?, nome),
        cognome = COALESCE(?, cognome),
        email   = COALESCE(?, email),
        ruolo   = COALESCE(?, ruolo)
      WHERE id = ?
    `, [fields.nome || null, fields.cognome || null, fields.email || null, fields.ruolo || null, id]) as [any, any];
    return result.affectedRows > 0;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM utente WHERE id = ?', [id]
    ) as [any, any];
    return result.affectedRows > 0;
  }
}
