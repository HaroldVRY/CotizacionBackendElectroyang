"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolModel = void 0;
const connection_1 = require("../database/connection");
class RolModel {
    async getAll() {
        const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      ORDER BY created_at DESC
    `;
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      WHERE id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async getByNombre(nombre) {
        const query = `
      SELECT id, nombre, descripcion, estado, created_at
      FROM roles
      WHERE nombre = $1
    `;
        const result = await connection_1.database.query(query, [nombre]);
        return result.length > 0 ? result[0] : null;
    }
    async create(nombre, descripcion) {
        const query = `
      INSERT INTO roles (nombre, descripcion, estado)
      VALUES ($1, $2, TRUE)
      RETURNING id, nombre, descripcion, estado, created_at
    `;
        const result = await connection_1.database.query(query, [nombre, descripcion || null]);
        return result[0];
    }
    async update(id, nombre, descripcion, estado) {
        const query = `
      UPDATE roles
      SET nombre = COALESCE($1, nombre),
          descripcion = COALESCE($2, descripcion),
          estado = COALESCE($3, estado)
      WHERE id = $4
      RETURNING id, nombre, descripcion, estado, created_at
    `;
        const result = await connection_1.database.query(query, [nombre || null, descripcion || null, estado !== undefined ? estado : null, id]);
        return result[0];
    }
    async delete(id) {
        const query = `DELETE FROM roles WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    async toggleEstado(id) {
        const query = `
      UPDATE roles
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, nombre, descripcion, estado, created_at
    `;
        const result = await connection_1.database.query(query, [id]);
        return result[0];
    }
}
exports.RolModel = RolModel;
