import pool from '../db/pool';
import { Classe } from '../models/interfaces';

export class ClassiRepository {
  async findAll(): Promise<Classe[]> {
    const [rows] = await pool.query(
      'SELECT id, nome, indirizzo, anno FROM classe ORDER BY anno, nome'
    ) as [any[], any];
    return rows;
  }
}
