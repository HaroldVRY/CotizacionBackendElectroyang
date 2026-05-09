import { database } from '../database/connection';

export interface Rol {
  id: number;
  nombre: string;
  descripcion?: string;
  estado: boolean;
  created_at?: string;
}

export class RolModel {
  async getAll(): Promise<Rol[]> {
    const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      ORDER BY created_at DESC
    `;
    return await database.query(query);
  }

  async getById(id: number): Promise<Rol | null> {
    const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      WHERE id = $1
    `;
    const result = await database.query(query, [id]);
    return result.length > 0 ? result[0] : null;
  }

  async getByNombre(nombre: string): Promise<Rol | null> {
    const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      WHERE nombre = $1
    `;
    const result = await database.query(query, [nombre]);
    return result.length > 0 ? result[0] : null;
  }

  async create(nombre: string, descripcion?: string): Promise<Rol> {
    const query = `
      INSERT INTO roles (nombre, descripcion, estado)
      VALUES ($1, $2, TRUE)
      RETURNING id, nombre, descripcion, estado, created_at
    `;
    const result = await database.query(query, [nombre, descripcion || null]);
    return result[0];
  }

  async update(id: number, nombre: string, descripcion?: string, estado?: boolean): Promise<Rol> {
    const query = `
      UPDATE roles
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          estado = COALESCE($3, estado)
      WHERE id = $4
      RETURNING id, nombre, descripcion, estado, created_at
    `;
    const result = await database.query(query, [nombre || null, descripcion || null, estado !== undefined ? estado : null, id]);
    return result[0];
  }

  async delete(id: number): Promise<boolean> {
    const query = `DELETE FROM roles WHERE id = $1`;
    await database.query(query, [id]);
    return true;
  }

  async toggleEstado(id: number): Promise<Rol> {
    const query = `
      UPDATE roles
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, nombre, descripcion, estado, created_at
    `;
    const result = await database.query(query, [id]);
    return result[0];
  }
}
