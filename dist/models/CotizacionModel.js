"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CotizacionModel = void 0;
const connection_1 = require("../database/connection");
class CotizacionModel {
    async getAll() {
        const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.id DESC
    `;
        return await connection_1.database.query(query);
    }
    async getById(id) {
        const query = `
      SELECT 
        c.id, c.numero, c.fecha, c.cliente_id as "clienteId", c.usuario_id as "usuarioId",
        c.receptor, c.observaciones, c.tiempo_entrega as "tiempoEntrega", 
        c.forma_pago as "formaPago", c.estado, c.subtotal, c.igv, c.total,
        c.created_at as "createdAt", c.updated_at as "updatedAt",
        cl.nombre as "clienteNombre", u.nombre as "usuarioNombre"
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.id = $1
    `;
        const results = await connection_1.database.query(query, [id]);
        if (results.length === 0) {
            return null;
        }
        const cotizacion = results[0];
        console.log('Cotización raw desde BD:', JSON.stringify(cotizacion, null, 2));
        // Obtener los detalles de la cotización
        const detalles = await this.getDetallesByCotizacionId(id);
        console.log('Detalles raw desde BD:', JSON.stringify(detalles, null, 2));
        cotizacion.detalles = detalles;
        return cotizacion;
    }
    async getByNumero(numero) {
        const query = `
      SELECT 
        c.id, c.numero, c.fecha, c.cliente_id as "clienteId", c.usuario_id as "usuarioId",
        c.receptor, c.observaciones, c.tiempo_entrega as "tiempoEntrega", 
        c.forma_pago as "formaPago", c.estado, c.subtotal, c.igv, c.total,
        c.created_at as "createdAt", c.updated_at as "updatedAt",
        cl.nombre as "clienteNombre", u.nombre as "usuarioNombre"
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.numero = $1
    `;
        const results = await connection_1.database.query(query, [numero]);
        if (results.length === 0) {
            return null;
        }
        const cotizacion = results[0];
        const detalles = await this.getDetallesByCotizacionId(cotizacion.id);
        cotizacion.detalles = detalles;
        return cotizacion;
    }
    async create(data, usuarioId) {
        // Generar número de cotización
        const numero = await this.generateNumero();
        // Calcular totales
        const subtotal = data.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
        const igv = subtotal * 0.18;
        const total = subtotal + igv;
        const query = `
      INSERT INTO cotizacion (numero, fecha, cliente_id, usuario_id, receptor, observaciones, tiempo_entrega, forma_pago, estado, subtotal, igv, total)
      VALUES ($1, NOW(), $2, $3, $4, $5, $6, $7, 'borrador', $8, $9, $10)
      RETURNING *
    `;
        const result = await connection_1.database.query(query, [
            numero,
            data.clienteId,
            usuarioId,
            data.receptor,
            data.observaciones,
            data.tiempoEntrega,
            data.formaPago,
            subtotal,
            igv,
            total
        ]);
        const cotizacionId = result[0].id;
        // Insertar detalles
        await this.insertDetalles(cotizacionId, data.detalles);
        return await this.getById(cotizacionId);
    }
    async update(id, data) {
        const fields = [];
        const values = [];
        let paramCounter = 1;
        // Mapeo de campos camelCase a snake_case
        const fieldMapping = {
            'clienteId': 'cliente_id',
            'usuarioId': 'usuario_id',
            'tiempoEntrega': 'tiempo_entrega',
            'formaPago': 'forma_pago'
        };
        Object.entries(data).forEach(([key, value]) => {
            if (key !== 'detalles' && key !== 'id' && value !== undefined) {
                const columnName = fieldMapping[key] || key;
                fields.push(`${columnName} = $${paramCounter}`);
                values.push(value);
                paramCounter++;
            }
        });
        // Recalcular totales si se actualizaron los detalles
        if (data.detalles) {
            const subtotal = data.detalles.reduce((sum, detalle) => sum + (detalle.cantidad * detalle.precioUnitario), 0);
            const igv = subtotal * 0.18;
            const total = subtotal + igv;
            fields.push(`subtotal = $${paramCounter}`, `igv = $${paramCounter + 1}`, `total = $${paramCounter + 2}`);
            values.push(subtotal, igv, total);
            paramCounter += 3;
        }
        if (fields.length > 0) {
            values.push(id);
            const query = `UPDATE cotizacion SET ${fields.join(', ')} WHERE id = $${paramCounter}`;
            const result = await connection_1.database.execute(query, values);
            if (result.rowCount === 0) {
                return null; // Cotización no encontrada
            }
        }
        // Actualizar detalles si se proporcionaron
        if (data.detalles) {
            await this.deleteDetallesByCotizacionId(id);
            await this.insertDetalles(id, data.detalles);
        }
        return await this.getById(id);
    }
    async delete(id) {
        // Eliminar detalles primero
        await this.deleteDetallesByCotizacionId(id);
        const query = 'DELETE FROM cotizacion WHERE id = $1';
        const result = await connection_1.database.execute(query, [id]);
        return result.rowCount > 0;
    }
    async getDetallesByCotizacionId(cotizacionId) {
        const query = `
      SELECT 
        dc.id, dc.cotizacion_id as "cotizacionId", dc.servicio_id as "servicioId",
        dc.numero_item as "numeroItem", dc.cantidad, dc.descripcion, 
        dc.precio_unitario as "precioUnitario", dc.total,
        dc.created_at as "createdAt", dc.updated_at as "updatedAt",
        s.nombre as "servicioNombre"
      FROM detalle_cotizacion dc
      LEFT JOIN servicio s ON dc.servicio_id = s.id
      WHERE dc.cotizacion_id = $1
      ORDER BY dc.numero_item ASC
    `;
        return await connection_1.database.query(query, [cotizacionId]);
    }
    async insertDetalles(cotizacionId, detalles) {
        const query = `
      INSERT INTO detalle_cotizacion (cotizacion_id, servicio_id, numero_item, cantidad, descripcion, precio_unitario, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
        for (const detalle of detalles) {
            const total = detalle.cantidad * detalle.precioUnitario;
            await connection_1.database.query(query, [
                cotizacionId,
                detalle.servicioId,
                detalle.numeroItem,
                detalle.cantidad,
                detalle.descripcion,
                detalle.precioUnitario,
                total
            ]);
        }
    }
    async deleteDetallesByCotizacionId(cotizacionId) {
        const query = 'DELETE FROM detalle_cotizacion WHERE cotizacion_id = $1';
        await connection_1.database.execute(query, [cotizacionId]);
    }
    async generateNumero() {
        const year = new Date().getFullYear();
        const query = 'SELECT COUNT(*) as count FROM cotizacion WHERE EXTRACT(YEAR FROM fecha) = $1';
        const result = await connection_1.database.query(query, [year]);
        const count = result[0].count + 1;
        return `COT-${year}-${count.toString().padStart(4, '0')}`;
    }
    async getByCliente(clienteId) {
        const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.cliente_id = $1
      ORDER BY c.id DESC
    `;
        return await connection_1.database.query(query, [clienteId]);
    }
    async getByEstado(estado) {
        const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.estado = $1
      ORDER BY c.id DESC
    `;
        return await connection_1.database.query(query, [estado]);
    }
    async search(term) {
        const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.numero ILIKE $1 
         OR cl.nombre ILIKE $2 
         OR u.nombre ILIKE $3
         OR c.receptor ILIKE $4
         OR c.observaciones ILIKE $5
         OR c.estado ILIKE $6
         OR c.forma_pago ILIKE $7
         OR CAST(c.total AS TEXT) ILIKE $8
      ORDER BY 
        CASE 
          WHEN c.numero ILIKE $9 THEN 1
          WHEN cl.nombre ILIKE $10 THEN 2
          WHEN c.estado ILIKE $11 THEN 3
          ELSE 4
        END,
        c.id DESC
    `;
        const searchTerm = `%${term}%`;
        const exactSearchTerm = `${term}%`;
        return await connection_1.database.query(query, [
            searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, // Para las condiciones WHERE
            exactSearchTerm, exactSearchTerm, exactSearchTerm // Para el ORDER BY
        ]);
    }
    async advancedSearch(filters) {
        const conditions = [];
        const values = [];
        let paramCounter = 1;
        Object.entries(filters).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                if (key === 'clienteId' || key === 'usuarioId') {
                    const columnName = key === 'clienteId' ? 'cliente_id' : 'usuario_id';
                    conditions.push(`c.${columnName} = $${paramCounter}`);
                    values.push(value);
                }
                else if (key === 'fechaDesde') {
                    conditions.push(`c.fecha >= $${paramCounter}`);
                    values.push(value);
                }
                else if (key === 'fechaHasta') {
                    conditions.push(`c.fecha <= $${paramCounter}`);
                    values.push(value);
                }
                else if (key === 'totalMinimo') {
                    conditions.push(`c.total >= $${paramCounter}`);
                    values.push(value);
                }
                else if (key === 'totalMaximo') {
                    conditions.push(`c.total <= $${paramCounter}`);
                    values.push(value);
                }
                else if (key === 'estado' || key === 'formaPago') {
                    const columnName = key === 'formaPago' ? 'forma_pago' : key;
                    conditions.push(`c.${columnName} = $${paramCounter}`);
                    values.push(value);
                }
                else if (typeof value === 'string' && value.trim()) {
                    conditions.push(`c.${key} ILIKE $${paramCounter}`);
                    values.push(`%${value.trim()}%`);
                }
                paramCounter++;
            }
        });
        if (conditions.length === 0) {
            return this.getAll();
        }
        const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE ${conditions.join(' AND ')}
      ORDER BY c.id DESC
    `;
        return await connection_1.database.query(query, values);
    }
}
exports.CotizacionModel = CotizacionModel;
