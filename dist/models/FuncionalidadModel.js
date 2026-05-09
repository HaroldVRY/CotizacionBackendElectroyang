"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionalidadModel = void 0;
const connection_1 = require("../database/connection");
class FuncionalidadModel {
    async getAll() {
        const query = `
      SELECT id, nombre, ruta_frontend, descripcion, estado
      FROM funcionalidades
      ORDER BY nombre ASC
    `;
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = `
      SELECT id, nombre, ruta_frontend, descripcion, estado
      FROM funcionalidades
      WHERE id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async create(nombre, ruta_frontend, descripcion) {
        const query = `
      INSERT INTO funcionalidades (nombre, ruta_frontend, descripcion, estado)
      VALUES ($1, $2, $3, TRUE)
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [nombre, ruta_frontend || null, descripcion || null]);
        return result[0];
    }
    async update(id, nombre, ruta_frontend, descripcion, estado) {
        const query = `
      UPDATE funcionalidades
      SET nombre = COALESCE($1, nombre),
          ruta_frontend = COALESCE($2, ruta_frontend),
          descripcion = COALESCE($3, descripcion),
          estado = COALESCE($4, estado)
      WHERE id = $5
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [nombre || null, ruta_frontend || null, descripcion || null, estado !== undefined ? estado : null, id]);
        return result[0];
    }
    async delete(id) {
        const query = `DELETE FROM funcionalidades WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    async toggleEstado(id) {
        const query = `
      UPDATE funcionalidades
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, nombre, ruta_frontend, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [id]);
        return result[0];
    }
}
exports.FuncionalidadModel = FuncionalidadModel;
