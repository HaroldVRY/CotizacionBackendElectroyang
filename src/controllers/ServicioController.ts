import { Request, Response } from 'express';
import { ServicioModel } from '../models/ServicioModel';
import { validationResult } from 'express-validator';

const servicioModel = new ServicioModel();

export class ServicioController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const servicios = await servicioModel.getAll();
      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getActive(req: Request, res: Response): Promise<void> {
    try {
      const servicios = await servicioModel.getActive();
      res.json({
        success: true,
        data: servicios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicios activos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const servicio = await servicioModel.getById(parseInt(id));
      
      if (!servicio) {
        res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: servicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener servicio',
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

      const servicio = await servicioModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Servicio creado exitosamente',
        data: servicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear servicio',
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
      const servicio = await servicioModel.update(parseInt(id), req.body);
      
      if (!servicio) {
        res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Servicio actualizado exitosamente',
        data: servicio
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar servicio',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await servicioModel.delete(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Servicio no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Servicio eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar servicio',
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
          help: 'Uso: /api/servicios/search?term=texto_a_buscar'
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
      
      const servicios = await servicioModel.search(searchTerm);
      res.json({
        success: true,
        message: `Se encontraron ${servicios.length} servicio(s) con el término "${searchTerm}"`,
        searchTerm: searchTerm,
        searchFields: ['nombre', 'descripcion', 'unidad', 'precio'],
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar servicios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async advancedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, descripcion, unidad, precio, activo } = req.query;
      
      const filters = {
        ...(nombre && { nombre: nombre.toString() }),
        ...(descripcion && { descripcion: descripcion.toString() }),
        ...(unidad && { unidad: unidad.toString() }),
        ...(precio && { precio: precio.toString() }),
        ...(activo !== undefined && { activo: activo === 'true' })
      };

      if (Object.keys(filters).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un filtro de búsqueda',
          availableFilters: ['nombre', 'descripcion', 'unidad', 'precio', 'activo'],
          help: 'Uso: /api/servicios/search/advanced?nombre=valor&precio=100&activo=true'
        });
        return;
      }
      
      const servicios = await servicioModel.advancedSearch(filters);
      res.json({
        success: true,
        message: `Búsqueda avanzada completada. ${servicios.length} servicio(s) encontrado(s)`,
        appliedFilters: filters,
        count: servicios.length,
        data: servicios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda avanzada de servicios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
