"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccesoModel = void 0;
const connection_1 = require("../database/connection");
class AccesoModel {
    async getAll() {
        const query = `
      SELECT a.rol_id, a.funcionalidad_id, a.puede_crear, a.puede_leer, a.puede_editar, a.puede_eliminar,
             r.nombre as rol_nombre, f.nombre as funcionalidad_nombre
      FROM accesos a
      LEFT JOIN roles r ON a.rol_id = r.id
      LEFT JOIN funcionalidades f ON a.funcionalidad_id = f.id
      ORDER BY r.nombre, f.nombre
    `;
        return await connection_1.database.query(query);
    }
    async getByRol(rol_id) {
        const query = `
      SELECT a.rol_id, a.funcionalidad_id, a.puede_crear, a.puede_leer, a.puede_editar, a.puede_eliminar,
             r.nombre as rol_nombre, f.nombre as funcionalidad_nombre
      FROM accesos a
      LEFT JOIN roles r ON a.rol_id = r.id
      LEFT JOIN funcionalidades f ON a.funcionalidad_id = f.id
      WHERE a.rol_id = $1
      ORDER BY f.nombre
    `;
        return await connection_1.database.query(query, [rol_id]);
    }
    async getByFuncionalidad(funcionalidad_id) {
        const query = `
      SELECT a.rol_id, a.funcionalidad_id, a.puede_crear, a.puede_leer, a.puede_editar, a.puede_eliminar,
             r.nombre as rol_nombre, f.nombre as funcionalidad_nombre
      FROM accesos a
      LEFT JOIN roles r ON a.rol_id = r.id
      LEFT JOIN funcionalidades f ON a.funcionalidad_id = f.id
      WHERE a.funcionalidad_id = $1
      ORDER BY r.nombre
    `;
        return await connection_1.database.query(query, [funcionalidad_id]);
    }
    async getAcceso(rol_id, funcionalidad_id) {
        const query = `
      SELECT a.rol_id, a.funcionalidad_id, a.puede_crear, a.puede_leer, a.puede_editar, a.puede_eliminar,
             r.nombre as rol_nombre, f.nombre as funcionalidad_nombre
      FROM accesos a
      LEFT JOIN roles r ON a.rol_id = r.id
      LEFT JOIN funcionalidades f ON a.funcionalidad_id = f.id
      WHERE a.rol_id = $1 AND a.funcionalidad_id = $2
    `;
        const result = await connection_1.database.query(query, [rol_id, funcionalidad_id]);
        return result.length > 0 ? result[0] : null;
    }
    async create(rol_id, funcionalidad_id, puede_crear = false, puede_leer = true, puede_editar = false, puede_eliminar = false) {
        const query = `
      INSERT INTO accesos (rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar
    `;
        const result = await connection_1.database.query(query, [rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar]);
        return await this.getAcceso(rol_id, funcionalidad_id);
    }
    async update(rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar) {
        const query = `
      UPDATE accesos
      SET puede_crear = COALESCE($1, puede_crear),
          puede_leer = COALESCE($2, puede_leer),
          puede_editar = COALESCE($3, puede_editar),
          puede_eliminar = COALESCE($4, puede_eliminar)
      WHERE rol_id = $5 AND funcionalidad_id = $6
      RETURNING rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar
    `;
        const result = await connection_1.database.query(query, [puede_crear !== undefined ? puede_crear : null, puede_leer !== undefined ? puede_leer : null, puede_editar !== undefined ? puede_editar : null, puede_eliminar !== undefined ? puede_eliminar : null, rol_id, funcionalidad_id]);
        return await this.getAcceso(rol_id, funcionalidad_id);
    }
    async delete(rol_id, funcionalidad_id) {
        const query = `DELETE FROM accesos WHERE rol_id = $1 AND funcionalidad_id = $2`;
        await connection_1.database.query(query, [rol_id, funcionalidad_id]);
        return true;
    }
}
exports.AccesoModel = AccesoModel;
