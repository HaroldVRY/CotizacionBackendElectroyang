import { Request, Response } from 'express';
import { RolModel } from '../models/RolModel';
import { validationResult } from 'express-validator';

const rolModel = new RolModel();

export class RolController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const roles = await rolModel.getAll();
      res.json({
        success: true,
        data: roles,
        count: roles.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener roles',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const rol = await rolModel.getById(parseInt(id));
      
      if (!rol) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: rol
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener rol',
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

      const { nombre, descripcion } = req.body;
      const rol = await rolModel.create(nombre, descripcion);
      
      res.status(201).json({
        success: true,
        message: 'Rol creado exitosamente',
        data: rol
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear rol',
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

      const { id } = req.params;
      const { nombre, descripcion, estado } = req.body;
      
      const existingRol = await rolModel.getById(parseInt(id));
      if (!existingRol) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
        return;
      }

      const rol = await rolModel.update(parseInt(id), nombre, descripcion, estado);
      
      res.json({
        success: true,
        message: 'Rol actualizado exitosamente',
        data: rol
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar rol',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingRol = await rolModel.getById(parseInt(id));
      if (!existingRol) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
        return;
      }

      await rolModel.delete(parseInt(id));
      
      res.json({
        success: true,
        message: 'Rol eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar rol',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async toggleEstado(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingRol = await rolModel.getById(parseInt(id));
      if (!existingRol) {
        res.status(404).json({
          success: false,
          message: 'Rol no encontrado'
        });
        return;
      }

      const rol = await rolModel.toggleEstado(parseInt(id));
      
      res.json({
        success: true,
        message: 'Estado del rol actualizado',
        data: rol
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
