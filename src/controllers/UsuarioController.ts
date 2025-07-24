import { Request, Response } from 'express';
import { UsuarioModel } from '../models/UsuarioModel';
import { validationResult } from 'express-validator';

const usuarioModel = new UsuarioModel();

export class UsuarioController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const usuarios = await usuarioModel.getAll();
      res.json({
        success: true,
        data: usuarios
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuarios',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const usuario = await usuarioModel.getById(parseInt(id));
      
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: usuario
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener usuario',
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

      const usuario = await usuarioModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Usuario creado exitosamente',
        data: usuario
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear usuario',
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
      const usuario = await usuarioModel.update(parseInt(id), req.body);
      
      if (!usuario) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: usuario
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await usuarioModel.delete(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Usuario no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Usuario eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar usuario',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
