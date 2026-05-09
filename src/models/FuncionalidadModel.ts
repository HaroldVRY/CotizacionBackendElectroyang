import { database } from '../database/connection';

export interface Funcionalidad {
  id: number;
  nombre: string;
  ruta_frontend?: string;
  descripcion?: string;
  estado: boolean;
}

export class FuncionalidadModel {
  async getAll(): Promise<Funcionalidad[]> {
    const query = `
      SELECT id, nombre, ruta_frontend, descripcion, estado
      FROM funcionalidades
      ORDER BY nombre ASC
    `;
    return await database.query(query);
  }

  async getById(id: number): Promise<Funcionalidad | null> {
    const query = `
      SELECT id, nombre, ruta_frontend, descripcion, estado
      FROM funcionalidades
      WHERE id = $1
    `;
    const result = await database.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  async create(nombre: string, ruta_frontend?: string, descripcion?: string): Promise<Funcionalidad> {
    const query = `
      INSERT INTO funcionalidades (nombre, ruta_frontend, descripcion, estado)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
    const result = await database.query(query, [nombre, ruta_frontend || null, descripcion || null]);
    return result[0];
  }

  async update(id: number, nombre?: string, ruta_frontend?: string, descripcion?: string, estado?: boolean): Promise<Funcionalidad> {
    const query = `
      UPDATE funcionalidades
      SET nombre = COALESCE($1, nombre),
          ruta_frontend = COALESCE($2, ruta_frontend),
          descripcion = COALESCE($3, descripcion),
          estado = COALESCE($4, estado)
      WHERE id = $5
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
    const result = await database.query(query, [nombre || null, ruta_frontend || null, descripcion || null, estado !== undefined ? estado : null, id]);
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM funcionalidades WHERE id = $1`;
    await database.query(query, [id]);
    return true;
  }

  async toggleEstado(id: number): Promise<Funcionalidad> {
    const query = `
      UPDATE funcionalidades
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
    const result = await database.query(query, [id]);
    return result[0];
  }
}
