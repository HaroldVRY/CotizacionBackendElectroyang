import { database } from '../database/connection';

export interface Parametro {
  id: number;
  codigo: string;
  valor: string;
  descripcion?: string;
  fecha_actualizacion?: string;
}

export class ParametroModel {
  async getAll(): Promise<Parametro[]> {
    const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      ORDER BY codigo ASC
    `;
    return await database.query(query);
  }

  async getById(id: number): Promise<Parametro | null> {
    const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      WHERE id = $1
    `;
    const result = await database.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getByCodigo(codigo: string): Promise<Parametro | null> {
    const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      WHERE codigo = $1
    `;
    const result = await database.query(query, [codigo]);
    return result.length > 0 ? result[0] : null;
  }

  async create(codigo: string, valor: string, descripcion?: string): Promise<Parametro> {
    const query = `
      INSERT INTO parametros (codigo, valor, descripcion, fecha_actualizacion)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, codigo, valor, descripcion, fecha_actualizacion
    `;
    const result = await database.query(query, [codigo, valor, descripcion || null]);
    return result[0];
  }

  async update(id: number, codigo?: string, valor?: string, descripcion?: string): Promise<Parametro> {
    const query = `
      UPDATE parametros
      SET codigo = COALESCE($1, codigo),
          valor = COALESCE($2, valor),
          descripcion = COALESCE($3, descripcion),
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, codigo, valor, descripcion, fecha_actualizacion
    `;
    const result = await database.query(query, [codigo || null, valor || null, descripcion || null, id]);
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM parametros WHERE id = $1`;
    await database.query(query, [id]);
    return true;
  }

  async deleteByCodigo(codigo: string): Promise<boolean> {
    const query = `DELETE FROM parametros WHERE codigo = $1`;
    await database.query(query, [codigo]);
    return true;
  }
}
