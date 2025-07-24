import { Request, Response } from 'express';
import { ClienteModel } from '../models/ClienteModel';
import { validationResult } from 'express-validator';

const clienteModel = new ClienteModel();

export class ClienteController {
  async getAll(req: Request, res: Response): Promise<void> {
    try {
      const clientes = await clienteModel.getAll();
      res.json({
        success: true,
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener clientes',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async getById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const cliente = await clienteModel.getById(parseInt(id));
      
      if (!cliente) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al obtener cliente',
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

      const cliente = await clienteModel.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Cliente creado exitosamente',
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al crear cliente',
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
      const cliente = await clienteModel.update(parseInt(id), req.body);
      
      if (!cliente) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Cliente actualizado exitosamente',
        data: cliente
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al actualizar cliente',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const deleted = await clienteModel.delete(parseInt(id));
      
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: 'Cliente no encontrado'
        });
        return;
      }
      
      res.json({
        success: true,
        message: 'Cliente eliminado exitosamente'
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al eliminar cliente',
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
          help: 'Uso: /api/clientes/search?term=texto_a_buscar'
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
      
      const clientes = await clienteModel.search(searchTerm);
      res.json({
        success: true,
        message: `Se encontraron ${clientes.length} cliente(s) con el término "${searchTerm}"`,
        searchTerm: searchTerm,
        searchFields: ['nombre', 'ruc', 'direccion', 'telefono', 'email', 'contacto'],
        count: clientes.length,
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error al buscar clientes',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }

  async advancedSearch(req: Request, res: Response): Promise<void> {
    try {
      const { nombre, ruc, email, telefono, direccion, contacto } = req.query;
      
      const filters = {
        ...(nombre && { nombre: nombre.toString() }),
        ...(ruc && { ruc: ruc.toString() }),
        ...(email && { email: email.toString() }),
        ...(telefono && { telefono: telefono.toString() }),
        ...(direccion && { direccion: direccion.toString() }),
        ...(contacto && { contacto: contacto.toString() })
      };

      if (Object.keys(filters).length === 0) {
        res.status(400).json({
          success: false,
          message: 'Debe proporcionar al menos un filtro de búsqueda',
          availableFilters: ['nombre', 'ruc', 'email', 'telefono', 'direccion', 'contacto'],
          help: 'Uso: /api/clientes/search/advanced?nombre=valor&ruc=valor'
        });
        return;
      }
      
      const clientes = await clienteModel.advancedSearch(filters);
      res.json({
        success: true,
        message: `Búsqueda avanzada completada. ${clientes.length} cliente(s) encontrado(s)`,
        appliedFilters: filters,
        count: clientes.length,
        data: clientes
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Error en búsqueda avanzada de clientes',
        error: error instanceof Error ? error.message : 'Error desconocido'
      });
    }
  }
}
