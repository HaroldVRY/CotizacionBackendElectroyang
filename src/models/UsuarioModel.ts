import { database } from '../database/connection';
import { Usuario } from '../types/index';

export class UsuarioModel {
  async getAll(): Promise<Usuario[]> {
    const query = 'SELECT id, nombre, email, rol, activo FROM usuario ORDER BY nombre ASC';
    return await database.query(query);
  }

  async getById(id: number): Promise<Usuario | null> {
    const query = 'SELECT id, nombre, email, rol, activo FROM usuario WHERE id = $1';
    const results = await database.query(query, [id]);
    return results.length > 0 ? results[0] : null;
  }

  async getByEmail(email: string): Promise<Usuario | null> {
    const query = 'SELECT * FROM usuario WHERE email = $1';
    const results = await database.query(query, [email]);
    return results.length > 0 ? results[0] : null;
  }

  async create(usuario: Omit<Usuario, 'id' | 'createdAt' | 'updatedAt'>): Promise<Usuario | null> {
    const query = `
      INSERT INTO usuario (nombre, email, password, rol, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const result = await database.query(query, [
      usuario.nombre,
      usuario.email,
      usuario.password,
      usuario.rol,
      usuario.activo
    ]);
    
    return result.length > 0 ? result[0] : null;
  }

  async update(id: number, usuario: Partial<Usuario>): Promise<Usuario | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;
    
    Object.entries(usuario).forEach(([key, value]) => {
      if (key !== 'id' && value !== undefined) {
        fields.push(`${key} = $${paramCounter}`);
        values.push(value);
        paramCounter++;
      }
    });
    
    if (fields.length === 0) {
      return await this.getById(id);
    }
    
    values.push(id);
    const query = `UPDATE usuario SET ${fields.join(', ')} WHERE id = $${paramCounter}`;
    
    const result = await database.execute(query, values);
    if (result.rowCount === 0) {
      return null; // Usuario no encontrado
    }
    
    return await this.getById(id);
  }

  async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM usuario WHERE id = $1';
    const result = await database.execute(query, [id]);
    return result.rowCount > 0;
  }
}
