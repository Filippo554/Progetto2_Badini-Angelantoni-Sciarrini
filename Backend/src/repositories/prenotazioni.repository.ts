import pool from '../db/pool';
import { PrenotazioneDettaglio, CreatePrenotazioneDto } from '../models/interfaces';

export class PrenotazioniRepository {

  async findAll(filters: {
    aula_id?:   number;
    classe_id?: number;
    data?:      string;
    settimana?: number;
    anno?:      number;
  }): Promise<PrenotazioneDettaglio[]> {
    const params: unknown[] = [];
    let query = `
      SELECT
        p.id, p.data, p.ora_inizio, p.ora_fine, p.note, p.created_at,
        a.id   AS aula_id,      a.numero AS aula_numero,
        u.id   AS utente_id,    u.nome   AS utente_nome, u.cognome AS utente_cognome,
        IFNULL(
          JSON_ARRAYAGG(
            IF(c.id IS NOT NULL,
              JSON_OBJECT('id', c.id, 'nome', c.nome, 'indirizzo', c.indirizzo),
              NULL)
          ), JSON_ARRAY()
        ) AS classi
      FROM prenotazione p
      JOIN aula a ON a.id = p.aula_id
      LEFT JOIN utente u ON u.id = p.utente_id
      LEFT JOIN prenotazione_classe pc ON pc.prenotazione_id = p.id
      LEFT JOIN classe c ON c.id = pc.classe_id
      WHERE 1=1
    `;

    if (filters.aula_id) {
      params.push(filters.aula_id);
      query += ' AND p.aula_id = ?';
    }
    if (filters.data) {
      params.push(filters.data);
      query += ' AND p.data = ?';
    }
    if (filters.settimana && filters.anno) {
      params.push(filters.anno, filters.settimana);
      query += ' AND YEAR(p.data) = ? AND WEEK(p.data, 3) = ?';
    }
    if (filters.classe_id) {
      params.push(filters.classe_id);
      query += ' AND p.id IN (SELECT prenotazione_id FROM prenotazione_classe WHERE classe_id = ?)';
    }

    query += ' GROUP BY p.id, a.id, u.id ORDER BY p.data, p.ora_inizio';

    const [rows] = await pool.query(query, params) as [any[], any];
    return rows.map(r => ({ ...r, classi: typeof r.classi === 'string' ? JSON.parse(r.classi) : r.classi }));
  }

  async findById(id: number): Promise<PrenotazioneDettaglio | null> {
    const [rows] = await pool.query(`
      SELECT
        p.id, p.data, p.ora_inizio, p.ora_fine, p.note, p.created_at,
        a.id AS aula_id, a.numero AS aula_numero, a.piano,
        u.id AS utente_id, u.nome AS utente_nome, u.cognome AS utente_cognome,
        IFNULL(
          JSON_ARRAYAGG(
            IF(c.id IS NOT NULL,
              JSON_OBJECT('id', c.id, 'nome', c.nome, 'indirizzo', c.indirizzo),
              NULL)
          ), JSON_ARRAY()
        ) AS classi
      FROM prenotazione p
      JOIN aula a ON a.id = p.aula_id
      LEFT JOIN utente u ON u.id = p.utente_id
      LEFT JOIN prenotazione_classe pc ON pc.prenotazione_id = p.id
      LEFT JOIN classe c ON c.id = pc.classe_id
      WHERE p.id = ?
      GROUP BY p.id, a.id, u.id
    `, [id]) as [any[], any];

    if (rows.length === 0) return null;
    const r = rows[0];
    return { ...r, classi: typeof r.classi === 'string' ? JSON.parse(r.classi) : r.classi };
  }

  async checkOverlap(aula_id: number, data: string, ora_inizio: string, ora_fine: string, exclude_id?: number) {
    let query = `
      SELECT id, ora_inizio, ora_fine
      FROM prenotazione
      WHERE aula_id   = ?
        AND data      = ?
        AND ora_inizio < ?
        AND ora_fine   > ?
    `;
    const params: unknown[] = [aula_id, data, ora_fine, ora_inizio];
    if (exclude_id) {
      params.push(exclude_id);
      query += ' AND id != ?';
    }
    const [rows] = await pool.query(query, params) as [any[], any];
    return rows;
  }

  async create(dto: CreatePrenotazioneDto, utente_id: number): Promise<number> {
    const conn = await pool.getConnection();
    try {
      await conn.beginTransaction();

      const [result] = await conn.query(`
        INSERT INTO prenotazione (aula_id, utente_id, data, ora_inizio, ora_fine, note)
        VALUES (?, ?, ?, ?, ?, ?)
      `, [dto.aula_id, utente_id, dto.data, dto.ora_inizio, dto.ora_fine, dto.note || null]) as [any, any];

      const prenotazione_id = result.insertId;

      for (const classe_id of dto.classi_ids || []) {
        await conn.query(
          'INSERT INTO prenotazione_classe (prenotazione_id, classe_id) VALUES (?, ?)',
          [prenotazione_id, classe_id]
        );
      }

      await conn.commit();
      return prenotazione_id;
    } catch (err) {
      await conn.rollback();
      throw err;
    } finally {
      conn.release();
    }
  }

  async findOwner(id: number): Promise<{ utente_id: number } | null> {
    const [rows] = await pool.query(
      'SELECT utente_id FROM prenotazione WHERE id = ?', [id]
    ) as [any[], any];
    return rows[0] || null;
  }

  async delete(id: number): Promise<boolean> {
    const [result] = await pool.query(
      'DELETE FROM prenotazione WHERE id = ?', [id]
    ) as [any, any];
    return result.affectedRows > 0;
  }
}
