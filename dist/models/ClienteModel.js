"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClienteModel = void 0;
const connection_1 = require("../database/connection");
class ClienteModel {
    async getAll() {
        const query = 'SELECT * FROM cliente ORDER BY nombre ASC';
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = 'SELECT * FROM cliente WHERE id = $1';
        const results = await connection_1.database.query(query, [id]);
        return results.length > 0 ? results[0] : null;
    }
    async create(cliente) {
        const query = `
      INSERT INTO cliente (nombre, ruc, direccion, telefono, email, contacto)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
        const result = await connection_1.database.query(query, [
            cliente.nombre,
            cliente.ruc,
            cliente.direccion,
            cliente.telefono,
            cliente.email,
            cliente.contacto
        ]);
        return result.length > 0 ? result[0] : null;
    }
    async update(id, cliente) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        Object.entries(cliente).forEach(([key, value]) => {
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
        const query = `UPDATE cliente SET ${fields.join(', ')} WHERE id = $${paramCounter}`;
        const result = await connection_1.database.execute(query, values);
        if (result.rowCount === 0) {
            return null; // Cliente no encontrado
        }
        return await this.getById(id);
    }
    async delete(id) {
        const query = 'DELETE FROM cliente WHERE id = $1';
        const result = await connection_1.database.execute(query, [id]);
        return result.rowCount > 0;
    }
    async search(term) {
        const query = `
      SELECT * FROM cliente 
      WHERE nombre ILIKE $1 
         OR ruc ILIKE $2 
         OR direccion ILIKE $3 
         OR telefono ILIKE $4 
         OR email ILIKE $5 
         OR contacto ILIKE $6
      ORDER BY 
        CASE 
          WHEN nombre ILIKE $7 THEN 1
          WHEN ruc ILIKE $8 THEN 2
          WHEN email ILIKE $9 THEN 3
          ELSE 4
        END,
        nombre ASC
    `;
        const searchTerm = `%${term}%`;
        const exactSearchTerm = `${term}%`;
        return await connection_1.database.query(query, [
            searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, // Para las condiciones WHERE
            exactSearchTerm, exactSearchTerm, exactSearchTerm // Para el ORDER BY (resultados que empiecen con el término tienen prioridad)
        ]);
    }
    async advancedSearch(filters) {
        const conditions = [];
        const values = [];
        let paramCounter = 1;
        Object.entries(filters).forEach(([key, value]) => {
            if (value && value.trim()) {
                conditions.push(`${key} ILIKE $${paramCounter}`);
                values.push(`%${value.trim()}%`);
                paramCounter++;
            }
        });
        if (conditions.length === 0) {
            return this.getAll();
        }
        const query = `
      SELECT * FROM cliente 
      WHERE ${conditions.join(' AND ')}
      ORDER BY nombre ASC
    `;
        return await connection_1.database.query(query, values);
    }
}
exports.ClienteModel = ClienteModel;
