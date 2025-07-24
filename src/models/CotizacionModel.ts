import { database } from '../database/connection';
import { Cotizacion, DetalleCotizacion, CreateCotizacionRequest, UpdateCotizacionRequest } from '../types/index';

export class CotizacionModel {
  async getAll(): Promise<Cotizacion[]> {
    const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      ORDER BY c.id DESC
    `;
    return await database.query(query);
  }

  async getById(id: number): Promise<Cotizacion | null> {
    const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.id = $1
    `;
    const results = await database.query(query, [id]);
    
    if (results.length === 0) {
      return null;
    }
    
    const cotizacion = results[0];
    
    // Obtener los detalles de la cotización
    const detalles = await this.getDetallesByCotizacionId(id);
    cotizacion.detalles = detalles;
    
    return cotizacion;
  }

  async getByNumero(numero: string): Promise<Cotizacion | null> {
    const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.numero = $1
    `;
    const results = await database.query(query, [numero]);
    
    if (results.length === 0) {
      return null;
    }
    
    const cotizacion = results[0];
    const detalles = await this.getDetallesByCotizacionId(cotizacion.id);
    cotizacion.detalles = detalles;
    
    return cotizacion;
  }

  async create(data: CreateCotizacionRequest, usuarioId: number): Promise<Cotizacion | null> {
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
    
    const result = await database.query(query, [
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

  async update(id: number, data: UpdateCotizacionRequest): Promise<Cotizacion | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;
    
    // Mapeo de campos camelCase a snake_case
    const fieldMapping: { [key: string]: string } = {
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
      const result = await database.execute(query, values);
      
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

  async delete(id: number): Promise<boolean> {
    // Eliminar detalles primero
    await this.deleteDetallesByCotizacionId(id);
    
    const query = 'DELETE FROM cotizacion WHERE id = $1';
    const result = await database.execute(query, [id]);
    return result.rowCount > 0;
  }

  private async getDetallesByCotizacionId(cotizacionId: number): Promise<DetalleCotizacion[]> {
    const query = `
      SELECT dc.*, s.nombre as servicioNombre
      FROM detalle_cotizacion dc
      LEFT JOIN servicio s ON dc.servicio_id = s.id
      WHERE dc.cotizacion_id = $1
      ORDER BY dc.numero_item ASC
    `;
    return await database.query(query, [cotizacionId]);
  }

  private async insertDetalles(cotizacionId: number, detalles: Omit<DetalleCotizacion, 'id' | 'cotizacionId' | 'total' | 'createdAt' | 'updatedAt'>[]): Promise<void> {
    const query = `
      INSERT INTO detalle_cotizacion (cotizacion_id, servicio_id, numero_item, cantidad, descripcion, precio_unitario, total)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
    `;
    
    for (const detalle of detalles) {
      const total = detalle.cantidad * detalle.precioUnitario;
      await database.query(query, [
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

  private async deleteDetallesByCotizacionId(cotizacionId: number): Promise<void> {
    const query = 'DELETE FROM detalle_cotizacion WHERE cotizacion_id = $1';
    await database.execute(query, [cotizacionId]);
  }

  private async generateNumero(): Promise<string> {
    const year = new Date().getFullYear();
    const query = 'SELECT COUNT(*) as count FROM cotizacion WHERE EXTRACT(YEAR FROM fecha) = $1';
    const result = await database.query(query, [year]);
    const count = result[0].count + 1;
    return `COT-${year}-${count.toString().padStart(4, '0')}`;
  }

  async getByCliente(clienteId: number): Promise<Cotizacion[]> {
    const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.cliente_id = $1
      ORDER BY c.id DESC
    `;
    return await database.query(query, [clienteId]);
  }

  async getByEstado(estado: string): Promise<Cotizacion[]> {
    const query = `
      SELECT c.*, cl.nombre as clienteNombre, u.nombre as usuarioNombre
      FROM cotizacion c
      LEFT JOIN cliente cl ON c.cliente_id = cl.id
      LEFT JOIN usuario u ON c.usuario_id = u.id
      WHERE c.estado = $1
      ORDER BY c.id DESC
    `;
    return await database.query(query, [estado]);
  }

  async search(term: string): Promise<Cotizacion[]> {
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
    return await database.query(query, [
      searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, // Para las condiciones WHERE
      exactSearchTerm, exactSearchTerm, exactSearchTerm // Para el ORDER BY
    ]);
  }

  async advancedSearch(filters: {
    numero?: string;
    clienteId?: number;
    usuarioId?: number;
    receptor?: string;
    estado?: string;
    formaPago?: string;
    fechaDesde?: string;
    fechaHasta?: string;
    totalMinimo?: number;
    totalMaximo?: number;
  }): Promise<Cotizacion[]> {
    const conditions: string[] = [];
    const values: any[] = [];
    let paramCounter = 1;

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (key === 'clienteId' || key === 'usuarioId') {
          const columnName = key === 'clienteId' ? 'cliente_id' : 'usuario_id';
          conditions.push(`c.${columnName} = $${paramCounter}`);
          values.push(value);
        } else if (key === 'fechaDesde') {
          conditions.push(`c.fecha >= $${paramCounter}`);
          values.push(value);
        } else if (key === 'fechaHasta') {
          conditions.push(`c.fecha <= $${paramCounter}`);
          values.push(value);
        } else if (key === 'totalMinimo') {
          conditions.push(`c.total >= $${paramCounter}`);
          values.push(value);
        } else if (key === 'totalMaximo') {
          conditions.push(`c.total <= $${paramCounter}`);
          values.push(value);
        } else if (key === 'estado' || key === 'formaPago') {
          const columnName = key === 'formaPago' ? 'forma_pago' : key;
          conditions.push(`c.${columnName} = $${paramCounter}`);
          values.push(value);
        } else if (typeof value === 'string' && value.trim()) {
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

    return await database.query(query, values);
  }
}
