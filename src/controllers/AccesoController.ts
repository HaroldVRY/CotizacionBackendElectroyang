import { Request, Response } from 'express';
import { AccesoModel } from '../models/AccesoModel';
import { validationResult } from 'express-validator';

const accesoModel = new AccesoModel();

export class AccesoController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const accesos = await accesoModel.getAll();
      res.json({
        success: true,
        data: accesos,
        count: accesos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener accesos',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByRol(req: Request, res: Response): Promise<void> {
    try {
      const { rol_id } = req.params;
      const accesos = await accesoModel.getByRol(parseInt(rol_id));
      
      res.json({
        success: true,
        data: accesos,
        count: accesos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener accesos del rol',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByFuncionalidad(req: Request, res: Response): Promise<void> {
    try {
      const { funcionalidad_id } = req.params;
      const accesos = await accesoModel.getByFuncionalidad(parseInt(funcionalidad_id));
      
      res.json({
        success: true,
        data: accesos,
        count: accesos.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener accesos de la funcionalidad',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getAcceso(req: Request, res: Response): Promise<void> {
    try {
      const { rol_id, funcionalidad_id } = req.params;
      const acceso = await accesoModel.getAcceso(parseInt(rol_id), parseInt(funcionalidad_id));
      
      if (!acceso) {
        res.status(404).json({
          success: false,
          message: 'Acceso no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: acceso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener acceso',
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
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar } = req.body;
      const acceso = await accesoModel.create(rol_id, funcionalidad_id, puede_crear, puede_leer, puede_editar, puede_eliminar);
      
      res.status(201).json({
        success: true,
        message: 'Acceso creado exitosamente',
        data: acceso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear acceso',
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
          message: 'Errores de validación',
          errors: errors.array()
        });
        return;
      }

      const { rol_id, funcionalidad_id } = req.params;
      const { puede_crear, puede_leer, puede_editar, puede_eliminar } = req.body;
      
      const existingAcceso = await accesoModel.getAcceso(parseInt(rol_id), parseInt(funcionalidad_id));
      if (!existingAcceso) {
        res.status(404).json({
          success: false,
          message: 'Acceso no encontrado'
        });
        return;
      }

      const acceso = await accesoModel.update(parseInt(rol_id), parseInt(funcionalidad_id), puede_crear, puede_leer, puede_editar, puede_eliminar);
      
      res.json({
        success: true,
        message: 'Acceso actualizado exitosamente',
        data: acceso
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar acceso',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { rol_id, funcionalidad_id } = req.params;
      
      const existingAcceso = await accesoModel.getAcceso(parseInt(rol_id), parseInt(funcionalidad_id));
      if (!existingAcceso) {
        res.status(404).json({
          success: false,
          message: 'Acceso no encontrado'
        });
        return;
      }

      await accesoModel.delete(parseInt(rol_id), parseInt(funcionalidad_id));
      
      res.json({
        success: true,
        message: 'Acceso eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar acceso',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
