import { Request, Response } from 'express';
import { ParametroModel } from '../models/ParametroModel';
import { validationResult } from 'express-validator';

const parametroModel = new ParametroModel();

export class ParametroController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const parametros = await parametroModel.getAll();
      res.json({
        success: true,
        data: parametros,
        count: parametros.length
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener parámetros',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const parametro = await parametroModel.getById(parseInt(id));
      
      if (!parametro) {
        res.status(404).json({
          success: false,
          message: 'Parámetro no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: parametro
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener parámetro',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getByCodigo(req: Request, res: Response): Promise<void> {
    try {
      const { codigo } = req.params;
      const parametro = await parametroModel.getByCodigo(codigo);
      
      if (!parametro) {
        res.status(404).json({
          success: false,
          message: 'Parámetro no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: parametro
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener parámetro',
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

      const { codigo, valor, descripcion } = req.body;
      const parametro = await parametroModel.create(codigo, valor, descripcion);
      
      res.status(201).json({
        success: true,
        message: 'Parámetro creado exitosamente',
        data: parametro
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear parámetro',
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
      const { codigo, valor, descripcion } = req.body;
      
      const existingParametro = await parametroModel.getById(parseInt(id));
      if (!existingParametro) {
        res.status(404).json({
          success: false,
          message: 'Parámetro no encontrado'
        });
        return;
      }

      const parametro = await parametroModel.update(parseInt(id), codigo, valor, descripcion);
      
      res.json({
        success: true,
        message: 'Parámetro actualizado exitosamente',
        data: parametro
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar parámetro',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      const existingParametro = await parametroModel.getById(parseInt(id));
      if (!existingParametro) {
        res.status(404).json({
          success: false,
          message: 'Parámetro no encontrado'
        });
        return;
      }

      await parametroModel.delete(parseInt(id));
      
      res.json({
        success: true,
        message: 'Parámetro eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar parámetro',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
