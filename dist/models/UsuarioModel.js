"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioModel = void 0;
const connection_1 = require("../database/connection");
class UsuarioModel {
    async getAll() {
        const query = 'SELECT id, nombre, email, rol, activo FROM usuario ORDER BY nombre ASC';
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = 'SELECT id, nombre, email, rol, activo FROM usuario WHERE id = $1';
        const results = await connection_1.database.query(query, [id]);
        return results.length > 0 ? results[0] : null;
    }
    async getByEmail(email) {
        const query = 'SELECT * FROM usuario WHERE email = $1';
        const results = await connection_1.database.query(query, [email]);
        return results.length > 0 ? results[0] : null;
    }
    async create(usuario) {
        const query = `
      INSERT INTO usuario (nombre, email, password, rol, activo)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
        const result = await connection_1.database.query(query, [
            usuario.nombre,
            usuario.email,
            usuario.password,
            usuario.rol,
            usuario.activo
        ]);
        return result.length > 0 ? result[0] : null;
    }
    async update(id, usuario) {
        const fields = [];
        const values = [];
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
        const result = await connection_1.database.execute(query, values);
        if (result.rowCount === 0) {
            return null; // Usuario no encontrado
        }
        return await this.getById(id);
    }
    async delete(id) {
        const query = 'DELETE FROM usuario WHERE id = $1';
        const result = await connection_1.database.execute(query, [id]);
        return result.rowCount > 0;
    }
}
exports.UsuarioModel = UsuarioModel;
