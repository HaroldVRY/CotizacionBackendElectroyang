"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FuncionalidadController = void 0;
const FuncionalidadModel_1 = require("../models/FuncionalidadModel");
const express_validator_1 = require("express-validator");
const funcionalidadModel = new FuncionalidadModel_1.FuncionalidadModel();
class FuncionalidadController {
    async getAll(req, res) {
        try {
            const funcionalidades = await funcionalidadModel.getAll();
            res.json({
                success: true,
                data: funcionalidades,
                count: funcionalidades.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener funcionalidades',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async getById(req, res) {
        try {
            const { id } = req.params;
            const funcionalidad = await funcionalidadModel.getById(parseInt(id));
            if (!funcionalidad) {
                res.status(404).json({
                    success: false,
                    message: 'Funcionalidad no encontrada'
                });
                return;
            }
            res.json({
                success: true,
                data: funcionalidad
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener funcionalidad',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async create(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
                return;
            }
            const { nombre, ruta_frontend, descripcion } = req.body;
            const funcionalidad = await funcionalidadModel.create(nombre, ruta_frontend, descripcion);
            res.status(201).json({
                success: true,
                message: 'Funcionalidad creada exitosamente',
                data: funcionalidad
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear funcionalidad',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async update(req, res) {
        try {
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                res.status(400).json({
                    success: false,
                    message: 'Errores de validación',
                    errors: errors.array()
                });
                return;
            }
            const { id } = req.params;
            const { nombre, ruta_frontend, descripcion, estado } = req.body;
            const existingFuncionalidad = await funcionalidadModel.getById(parseInt(id));
            if (!existingFuncionalidad) {
                res.status(404).json({
                    success: false,
                    message: 'Funcionalidad no encontrada'
                });
                return;
            }
            const funcionalidad = await funcionalidadModel.update(parseInt(id), nombre, ruta_frontend, descripcion, estado);
            res.json({
                success: true,
                message: 'Funcionalidad actualizada exitosamente',
                data: funcionalidad
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar funcionalidad',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const existingFuncionalidad = await funcionalidadModel.getById(parseInt(id));
            if (!existingFuncionalidad) {
                res.status(404).json({
                    success: false,
                    message: 'Funcionalidad no encontrada'
                });
                return;
            }
            await funcionalidadModel.delete(parseInt(id));
            res.json({
                success: true,
                message: 'Funcionalidad eliminada exitosamente'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar funcionalidad',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async toggleEstado(req, res) {
        try {
            const { id } = req.params;
            const existingFuncionalidad = await funcionalidadModel.getById(parseInt(id));
            if (!existingFuncionalidad) {
                res.status(404).json({
                    success: false,
                    message: 'Funcionalidad no encontrada'
                });
                return;
            }
            const funcionalidad = await funcionalidadModel.toggleEstado(parseInt(id));
            res.json({
                success: true,
                message: 'Estado de la funcionalidad actualizado',
                data: funcionalidad
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar estado',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
}
exports.FuncionalidadController = FuncionalidadController;
