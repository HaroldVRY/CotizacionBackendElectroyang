"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const connection_1 = require("../database/connection");
class UsuarioModel {
    async getAll() {
        const query = `
      SELECT u.id, u.rol_id, u.nombres, u.apellidos, u.email, u.password_hash, u.estado, u.created_at, r.nombre as rol_nombre
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      ORDER BY u.created_at DESC
    `;
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = `
      SELECT u.id, u.rol_id, u.nombres, u.apellidos, u.email, u.password_hash, u.estado, u.created_at, r.nombre as rol_nombre
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async getByEmail(email) {
        const query = `
      SELECT u.id, u.rol_id, u.nombres, u.apellidos, u.email, u.password_hash, u.estado, u.created_at, r.nombre as rol_nombre
      FROM usuarios u
      LEFT JOIN roles r ON u.rol_id = r.id
      WHERE u.email = $1
    `;
        const result = await connection_1.database.query(query, [email]);
        return result.length > 0 ? result[0] : null;
    }
    async create(rol_id, nombres, apellidos, email, password_hash) {
        const query = `
      INSERT INTO usuarios (rol_id, nombres, apellidos, email, password_hash, estado)
      VALUES ($1, $2, $3, $4, $5, TRUE)
      RETURNING id, rol_id, nombres, apellidos, email, password_hash, estado, created_at
    `;
        const result = await connection_1.database.query(query, [rol_id, nombres, apellidos, email, password_hash]);
        if (result.length > 0) {
            return await this.getById(result[0].id);
        }
        throw new Error('Error creando usuario');
    }
    async update(id, rol_id, nombres, apellidos, email, estado) {
        const query = `
      UPDATE usuarios
      SET rol_id = COALESCE($1, rol_id),
          nombres = COALESCE($2, nombres),
          apellidos = COALESCE($3, apellidos),
          email = COALESCE($4, email),
          estado = COALESCE($5, estado)
      WHERE id = $6
      RETURNING id, rol_id, nombres, apellidos, email, password_hash, estado, created_at
    `;
        const result = await connection_1.database.query(query, [rol_id || null, nombres || null, apellidos || null, email || null, estado !== undefined ? estado : null, id]);
        if (result.length > 0) {
            return await this.getById(id);
        }
        throw new Error('Error actualizando usuario');
    }
    async delete(id) {
        const query = `DELETE FROM usuarios WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    async toggleEstado(id) {
        const query = `
      UPDATE usuarios
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, rol_id, nombres, apellidos, email, password_hash, estado, created_at
    `;
        const result = await connection_1.database.query(query, [id]);
        if (result.length > 0) {
            return await this.getById(id);
        }
        throw new Error('Error toggling usuario estado');
    }
}
exports.UsuarioModel = UsuarioModel;
