import { Request, Response } from 'express';
import { CotizacionModel } from '../models/CotizacionModel';
import { validationResult } from 'express-validator';

const cotizacionModel = new CotizacionModel();

export class CotizacionController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const cotizaciones = await cotizacionModel.getAll();
      res.json({
        success: true,
        data: cotizaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cotizacion = await cotizacionModel.getById(parseInt(id));
      
      if (!cotizacion) {
        res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        data: cotizacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByNumero(req: Request, res: Response): Promise<void> {
    try {
      const { numero } = req.params;
      const cotizacion = await cotizacionModel.getByNumero(numero);
      
      if (!cotizacion) {
        res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        data: cotizacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async create(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
        return;
      }

      // TODO: Obtener usuarioId del token de autenticación
      const usuarioId = 1; // Por ahora hardcodeado
      
      const cotizacion = await cotizacionModel.create(req.body, usuarioId);
      res.status(201).json({
        success: true,
        message: 'Cotización creada exitosamente',
        data: cotizacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Datos de entrada inválidos',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const cotizacion = await cotizacionModel.update(parseInt(id), req.body);
      
      if (!cotizacion) {
        res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Cotización actualizada exitosamente',
        data: cotizacion
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await cotizacionModel.delete(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Cotización no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Cotización eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar cotización',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByCliente(req: Request, res: Response): Promise<void> {
    try {
      const { clienteId } = req.params;
      const cotizaciones = await cotizacionModel.getByCliente(parseInt(clienteId));
      
      res.json({
        success: true,
        data: cotizaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones del cliente',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByEstado(req: Request, res: Response): Promise<void> {
    try {
      const { estado } = req.params;
      const cotizaciones = await cotizacionModel.getByEstado(estado);
      
      res.json({
        success: true,
        data: cotizaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cotizaciones por estado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async search(req: Request, res: Response): Promise<void> {
    try {
      const { term } = req.query;
      
      if (!term) {
        res.status(400).json({
          success: false,
          message: 'Parámetro de búsqueda requerido',
          help: 'Uso: /api/cotizaciones/search?term=texto_a_buscar'
        });
        return;
      }

      const searchTerm = term.toString().trim();
      if (searchTerm.length < 2) {
        res.status(400).json({
          success: false,
          message: 'El término de búsqueda debe tener al menos 2 caracteres'
        });
        return;
      }
      
      const cotizaciones = await cotizacionModel.search(searchTerm);
      res.json({
        success: true,
        message: `Se encontraron ${cotizaciones.length} cotización(es) con el término "${searchTerm}"`,
        searchTerm: searchTerm,
        searchFields: ['numero', 'cliente', 'usuario', 'receptor', 'observaciones', 'estado', 'formaPago', 'total'],
        count: cotizaciones.length,
        data: cotizaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar cotizaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async advancedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { 
        numero, clienteId, usuarioId, receptor, estado, formaPago, 
        fechaDesde, fechaHasta, totalMinimo, totalMaximo 
      } = req.query;
      
      const filters = {
        ...(numero && { numero: numero.toString() }),
        ...(clienteId && { clienteId: parseInt(clienteId.toString()) }),
        ...(usuarioId && { usuarioId: parseInt(usuarioId.toString()) }),
        ...(receptor && { receptor: receptor.toString() }),
        ...(estado && { estado: estado.toString() }),
        ...(formaPago && { formaPago: formaPago.toString() }),
        ...(fechaDesde && { fechaDesde: fechaDesde.toString() }),
        ...(fechaHasta && { fechaHasta: fechaHasta.toString() }),
        ...(totalMinimo && { totalMinimo: parseFloat(totalMinimo.toString()) }),
        ...(totalMaximo && { totalMaximo: parseFloat(totalMaximo.toString()) })
      };

      if (Object.keys(filters).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un filtro de búsqueda',
          availableFilters: [
            'numero', 'clienteId', 'usuarioId', 'receptor', 'estado', 
            'formaPago', 'fechaDesde', 'fechaHasta', 'totalMinimo', 'totalMaximo'
          ],
          help: 'Uso: /api/cotizaciones/search/advanced?estado=borrador&clienteId=1&totalMinimo=1000'
        });
        return;
      }
      
      const cotizaciones = await cotizacionModel.advancedSearch(filters);
      res.json({
        success: true,
        message: `Búsqueda avanzada completada. ${cotizaciones.length} cotización(es) encontrada(s)`,
        appliedFilters: filters,
        count: cotizaciones.length,
        data: cotizaciones
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda avanzada de cotizaciones',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
