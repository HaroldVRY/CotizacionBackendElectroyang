"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ParametroModel = void 0;
const connection_1 = require("../database/connection");
class ParametroModel {
    async getAll() {
        const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      ORDER BY codigo ASC
    `;
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      WHERE id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async getByCodigo(codigo) {
        const query = `
      SELECT id, codigo, valor, descripcion, fecha_actualizacion
      FROM parametros
      WHERE codigo = $1
    `;
        const result = await connection_1.database.query(query, [codigo]);
        return result.length > 0 ? result[0] : null;
    }
    async create(codigo, valor, descripcion) {
        const query = `
      INSERT INTO parametros (codigo, valor, descripcion, fecha_actualizacion)
      VALUES ($1, $2, $3, CURRENT_TIMESTAMP)
      RETURNING id, codigo, valor, descripcion, fecha_actualizacion
    `;
        const result = await connection_1.database.query(query, [codigo, valor, descripcion || null]);
        return result[0];
    }
    async update(id, codigo, valor, descripcion) {
        const query = `
      UPDATE parametros
      SET codigo = COALESCE($1, codigo),
          valor = COALESCE($2, valor),
          descripcion = COALESCE($3, descripcion),
          fecha_actualizacion = CURRENT_TIMESTAMP
      WHERE id = $4
      RETURNING id, codigo, valor, descripcion, fecha_actualizacion
    `;
        const result = await connection_1.database.query(query, [codigo || null, valor || null, descripcion || null, id]);
        return result[0];
    }
    async delete(id) {
        const query = `DELETE FROM parametros WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    async deleteByCodigo(codigo) {
        const query = `DELETE FROM parametros WHERE codigo = $1`;
        await connection_1.database.query(query, [codigo]);
        return true;
    }
}
exports.ParametroModel = ParametroModel;
