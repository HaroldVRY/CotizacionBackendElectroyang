import { Request, Response } from 'express';
import { MaestroModel } from '../models/MaestroModel';
import { validationResult } from 'express-validator';

const maestroModel = new MaestroModel();

export class MaestroController {
  // ===== CABECERA =====
  async getAllCabeceras(req: Request, res: Response): Promise<void> {
    try {
      const cabeceras = await maestroModel.getAllCabeceras();
      res.json({
        success: true,
        data: cabeceras,
        count: cabeceras.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener maestro cabeceras',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getCabeceraById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cabecera = await maestroModel.getCabeceraById(parseInt(id));
      
      if (!cabecera) {
        res.status(404).json({
          success: false,
          message: 'Maestro cabecera no encontrada'
        });
        return;
      }
      
      res.json({
        success: true,
        data: cabecera
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener maestro cabecera',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async createCabecera(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { codigo, nombre, descripcion } = req.body;
      const cabecera = await maestroModel.createCabecera(codigo, nombre, descripcion);
      
      res.status(201).json({
        success: true,
        message: 'Maestro cabecera creada exitosamente',
        data: cabecera
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear maestro cabecera',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async updateCabecera(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { codigo, nombre, descripcion } = req.body;
      
      const existingCabecera = await maestroModel.getCabeceraById(parseInt(id));
      if (!existingCabecera) {
        res.status(404).json({
          success: false,
          message: 'Maestro cabecera no encontrada'
        });
        return;
      }

      const cabecera = await maestroModel.updateCabecera(parseInt(id), codigo, nombre, descripcion);
      
      res.json({
        success: true,
        message: 'Maestro cabecera actualizada exitosamente',
        data: cabecera
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar maestro cabecera',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async deleteCabecera(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingCabecera = await maestroModel.getCabeceraById(parseInt(id));
      if (!existingCabecera) {
        res.status(404).json({
          success: false,
          message: 'Maestro cabecera no encontrada'
        });
        return;
      }

      await maestroModel.deleteCabecera(parseInt(id));
      
      res.json({
        success: true,
        message: 'Maestro cabecera eliminada exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar maestro cabecera',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  // ===== DETALLE =====
  async getAllDetalles(req: Request, res: Response): Promise<void> {
    try {
      const detalles = await maestroModel.getAllDetalles();
      res.json({
        success: true,
        data: detalles,
        count: detalles.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener maestro detalles',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getDetalleById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const detalle = await maestroModel.getDetalleById(parseInt(id));
      
      if (!detalle) {
        res.status(404).json({
          success: false,
          message: 'Maestro detalle no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: detalle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener maestro detalle',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getDetallesByCabecera(req: Request, res: Response): Promise<void> {
    try {
      const { cabecera_id } = req.params;
      const detalles = await maestroModel.getDetallesByCabecera(parseInt(cabecera_id));
      
      res.json({
        success: true,
        data: detalles,
        count: detalles.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener detalles de maestro',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async createDetalle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { cabecera_id, codigo_valor, descripcion, estado } = req.body;
      const detalle = await maestroModel.createDetalle(cabecera_id, codigo_valor, descripcion, estado);
      
      res.status(201).json({
        success: true,
        message: 'Maestro detalle creado exitosamente',
        data: detalle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear maestro detalle',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async updateDetalle(req: Request, res: Response): Promise<void> {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(400).json({
          success: false,
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { id } = req.params;
      const { codigo_valor, descripcion, estado } = req.body;
      
      const existingDetalle = await maestroModel.getDetalleById(parseInt(id));
      if (!existingDetalle) {
        res.status(404).json({
          success: false,
          message: 'Maestro detalle no encontrado'
        });
        return;
      }

      const detalle = await maestroModel.updateDetalle(parseInt(id), codigo_valor, descripcion, estado);
      
      res.json({
        success: true,
        message: 'Maestro detalle actualizado exitosamente',
        data: detalle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar maestro detalle',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async deleteDetalle(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingDetalle = await maestroModel.getDetalleById(parseInt(id));
      if (!existingDetalle) {
        res.status(404).json({
          success: false,
          message: 'Maestro detalle no encontrado'
        });
        return;
      }

      await maestroModel.deleteDetalle(parseInt(id));
      
      res.json({
        success: true,
        message: 'Maestro detalle eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar maestro detalle',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async toggleDetalleEstado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingDetalle = await maestroModel.getDetalleById(parseInt(id));
      if (!existingDetalle) {
        res.status(404).json({
          success: false,
          message: 'Maestro detalle no encontrado'
        });
        return;
      }

      const detalle = await maestroModel.toggleDetalleEstado(parseInt(id));
      
      res.json({
        success: true,
        message: 'Estado del maestro detalle actualizado',
        data: detalle
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar estado',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
