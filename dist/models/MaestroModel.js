"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MaestroModel = void 0;
const connection_1 = require("../database/connection");
class MaestroModel {
    // ===== CABECERA =====
    async getAllCabeceras() {
        const query = `
      SELECT id, codigo, nombre, descripcion
      FROM maestro_cabecera
      ORDER BY nombre ASC
    `;
        return await connection_1.database.query(query);
    }
    async getCabeceraById(id) {
        const query = `
      SELECT id, codigo, nombre, descripcion
      FROM maestro_cabecera
      WHERE id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async getCabeceraByCodigo(codigo) {
        const query = `
      SELECT id, codigo, nombre, descripcion
      FROM maestro_cabecera
      WHERE codigo = $1
    `;
        const result = await connection_1.database.query(query, [codigo]);
        return result.length > 0 ? result[0] : null;
    }
    async createCabecera(codigo, nombre, descripcion) {
        const query = `
      INSERT INTO maestro_cabecera (codigo, nombre, descripcion)
      VALUES ($1, $2, $3)
      RETURNING id, codigo, nombre, descripcion
    `;
        const result = await connection_1.database.query(query, [codigo, nombre, descripcion || null]);
        return result[0];
    }
    async updateCabecera(id, codigo, nombre, descripcion) {
        const query = `
      UPDATE maestro_cabecera
      SET codigo = COALESCE($1, codigo),
          nombre = COALESCE($2, nombre),
          descripcion = COALESCE($3, descripcion)
      WHERE id = $4
      RETURNING id, codigo, nombre, descripcion
    `;
        const result = await connection_1.database.query(query, [codigo || null, nombre || null, descripcion || null, id]);
        return result[0];
    }
    async deleteCabecera(id) {
        const query = `DELETE FROM maestro_cabecera WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    // ===== DETALLE =====
    async getAllDetalles() {
        const query = `
      SELECT md.id, md.cabecera_id, md.codigo_valor, md.descripcion, md.estado, mc.codigo as cabecera_codigo
      FROM maestro_detalle md
      LEFT JOIN maestro_cabecera mc ON md.cabecera_id = mc.id
      ORDER BY md.cabecera_id, md.codigo_valor ASC
    `;
        return await connection_1.database.query(query);
    }
    async getDetalleById(id) {
        const query = `
      SELECT md.id, md.cabecera_id, md.codigo_valor, md.descripcion, md.estado, mc.codigo as cabecera_codigo
      FROM maestro_detalle md
      LEFT JOIN maestro_cabecera mc ON md.cabecera_id = mc.id
      WHERE md.id = $1
    `;
        const result = await connection_1.database.query(query, [id]);
        return result.length > 0 ? result[0] : null;
    }
    async getDetallesByCabecera(cabecera_id) {
        const query = `
      SELECT md.id, md.cabecera_id, md.codigo_valor, md.descripcion, md.estado, mc.codigo as cabecera_codigo
      FROM maestro_detalle md
      LEFT JOIN maestro_cabecera mc ON md.cabecera_id = mc.id
      WHERE md.cabecera_id = $1
      ORDER BY md.codigo_valor ASC
    `;
        return await connection_1.database.query(query, [cabecera_id]);
    }
    async getDetalleByCabeceraAndCodigo(cabecera_id, codigo_valor) {
        const query = `
      SELECT md.id, md.cabecera_id, md.codigo_valor, md.descripcion, md.estado, mc.codigo as cabecera_codigo
      FROM maestro_detalle md
      LEFT JOIN maestro_cabecera mc ON md.cabecera_id = mc.id
      WHERE md.cabecera_id = $1 AND md.codigo_valor = $2
    `;
        const result = await connection_1.database.query(query, [cabecera_id, codigo_valor]);
        return result.length > 0 ? result[0] : null;
    }
    async createDetalle(cabecera_id, codigo_valor, descripcion, estado = true) {
        const query = `
      INSERT INTO maestro_detalle (cabecera_id, codigo_valor, descripcion, estado)
      VALUES ($1, $2, $3, $4)
      RETURNING id, cabecera_id, codigo_valor, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [cabecera_id, codigo_valor, descripcion, estado]);
        return await this.getDetalleById(result[0].id);
    }
    async updateDetalle(id, codigo_valor, descripcion, estado) {
        const query = `
      UPDATE maestro_detalle
      SET codigo_valor = COALESCE($1, codigo_valor),
          descripcion = COALESCE($2, descripcion),
          estado = COALESCE($3, estado)
      WHERE id = $4
      RETURNING id, cabecera_id, codigo_valor, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [codigo_valor || null, descripcion || null, estado !== undefined ? estado : null, id]);
        return await this.getDetalleById(id);
    }
    async deleteDetalle(id) {
        const query = `DELETE FROM maestro_detalle WHERE id = $1`;
        await connection_1.database.query(query, [id]);
        return true;
    }
    async toggleDetalleEstado(id) {
        const query = `
      UPDATE maestro_detalle
      SET estado = NOT estado
      WHERE id = $1
      RETURNING id, cabecera_id, codigo_valor, descripcion, estado
    `;
        const result = await connection_1.database.query(query, [id]);
        return await this.getDetalleById(id);
    }
}
exports.MaestroModel = MaestroModel;
