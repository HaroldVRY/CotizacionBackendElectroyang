"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ServicioModel = void 0;
const connection_1 = require("../database/connection");
class ServicioModel {
    async getAll() {
        const query = 'SELECT id, nombre, descripcion, precio, unidad, activo FROM servicio ORDER BY nombre ASC';
        return await connection_1.database.query(query);
    }
    async getActive() {
        const query = 'SELECT id, nombre, descripcion, precio, unidad, activo FROM servicio WHERE activo = true ORDER BY nombre ASC';
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = 'SELECT id, nombre, descripcion, precio, unidad, activo FROM servicio WHERE id = $1';
        const results = await connection_1.database.query(query, [id]);
        return results.length > 0 ? results[0] : null;
    }
    async create(servicio) {
        const query = `
      INSERT INTO servicio (nombre, descripcion, precio, unidad, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await connection_1.database.query(query, [
            servicio.nombre,
            servicio.descripcion,
            servicio.precio,
            servicio.unidad,
            servicio.activo
        ]);
        return result.length > 0 ? result[0] : null;
    }
    async update(id, servicio) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        Object.entries(servicio).forEach(([key, value]) => {
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
        const query = `UPDATE servicio SET ${fields.join(', ')} WHERE id = $${paramCounter}`;
        const result = await connection_1.database.execute(query, values);
        if (result.rowCount === 0) {
            return null; // Servicio no encontrado
        }
        return await this.getById(id);
    }
    async delete(id) {
        const query = 'DELETE FROM servicio WHERE id = $1';
        const result = await connection_1.database.execute(query, [id]);
        return result.rowCount > 0;
    }
    async search(term) {
        const query = `
      SELECT id, nombre, descripcion, precio, unidad, activo FROM servicio 
      WHERE nombre ILIKE $1 
         OR descripcion ILIKE $2 
         OR unidad ILIKE $3
         OR CAST(precio AS TEXT) ILIKE $4
      ORDER BY 
        CASE 
          WHEN nombre ILIKE $5 THEN 1
          WHEN descripcion ILIKE $6 THEN 2
          ELSE 3
        END,
        nombre ASC
    `;
        const searchTerm = `%${term}%`;
        const exactSearchTerm = `${term}%`;
        return await connection_1.database.query(query, [
            searchTerm, searchTerm, searchTerm, searchTerm, // Para las condiciones WHERE
            exactSearchTerm, exactSearchTerm // Para el ORDER BY
        ]);
    }
    async advancedSearch(filters) {
        const conditions = [];
        const values = [];
        let paramCounter = 1;
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'precio') {
                    // Para precio, permitir búsqueda por rango o valor exacto
                    conditions.push(`CAST(precio AS TEXT) ILIKE $${paramCounter}`);
                    values.push(`%${value}%`);
                }
                else if (key === 'activo') {
                    // Para activo, búsqueda exacta
                    conditions.push(`activo = $${paramCounter}`);
                    values.push(value);
                }
                else if (typeof value === 'string' && value.trim()) {
                    // Para campos de texto
                    conditions.push(`${key} ILIKE $${paramCounter}`);
                    values.push(`%${value.trim()}%`);
                }
                paramCounter++;
            }
        });
        if (conditions.length === 0) {
            return this.getAll();
        }
        const query = `
      SELECT id, nombre, descripcion, precio, unidad, activo FROM servicio 
      WHERE ${conditions.join(' AND ')}
      ORDER BY nombre ASC
    `;
        return await connection_1.database.query(query, values);
    }
}
exports.ServicioModel = ServicioModel;
