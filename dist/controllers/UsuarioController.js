"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioController = void 0;
const UsuarioModel_1 = require("../models/UsuarioModel");
const express_validator_1 = require("express-validator");
const crypto = __importStar(require("crypto"));
const usuarioModel = new UsuarioModel_1.UsuarioModel();
class UsuarioController {
    async getAll(req, res) {
        try {
            const usuarios = await usuarioModel.getAll();
            res.json({
                success: true,
                data: usuarios,
                count: usuarios.length
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuarios',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async getById(req, res) {
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
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al obtener usuario',
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
            const { rol_id, nombres, apellidos, email, password } = req.body;
            // Verificar si el email ya existe
            const existingUsuario = await usuarioModel.getByEmail(email);
            if (existingUsuario) {
                res.status(400).json({
                    success: false,
                    message: 'El email ya está registrado'
                });
                return;
            }
            // Hash la contraseña
            const password_hash = crypto.createHash('sha256').update(password).digest('hex');
            const usuario = await usuarioModel.create(rol_id, nombres, apellidos, email, password_hash);
            res.status(201).json({
                success: true,
                message: 'Usuario creado exitosamente',
                data: usuario
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al crear usuario',
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
            const { rol_id, nombres, apellidos, email, estado } = req.body;
            const existingUsuario = await usuarioModel.getById(parseInt(id));
            if (!existingUsuario) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
                return;
            }
            const usuario = await usuarioModel.update(parseInt(id), rol_id, nombres, apellidos, email, estado);
            res.json({
                success: true,
                message: 'Usuario actualizado exitosamente',
                data: usuario
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al actualizar usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async delete(req, res) {
        try {
            const { id } = req.params;
            const existingUsuario = await usuarioModel.getById(parseInt(id));
            if (!existingUsuario) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
                return;
            }
            await usuarioModel.delete(parseInt(id));
            res.json({
                success: true,
                message: 'Usuario eliminado exitosamente'
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                message: 'Error al eliminar usuario',
                error: error instanceof Error ? error.message : 'Error desconocido'
            });
        }
    }
    async toggleEstado(req, res) {
        try {
            const { id } = req.params;
            const existingUsuario = await usuarioModel.getById(parseInt(id));
            if (!existingUsuario) {
                res.status(404).json({
                    success: false,
                    message: 'Usuario no encontrado'
                });
                return;
            }
            const usuario = await usuarioModel.toggleEstado(parseInt(id));
            res.json({
                success: true,
                message: 'Estado del usuario actualizado',
                data: usuario
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
exports.UsuarioController = UsuarioController;
