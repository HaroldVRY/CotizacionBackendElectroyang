"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const usuarioController = new UsuarioController_1.UsuarioController();
// Validaciones para crear usuario
const usuarioValidation = [
    (0, express_validator_1.body)('rol_id')
        .isInt({ min: 1 })
        .withMessage('Rol ID es requerido y debe ser un número válido'),
    (0, express_validator_1.body)('nombres')
        .notEmpty()
        .withMessage('Los nombres son requeridos')
        .isLength({ min: 2, max: 100 })
        .withMessage('Los nombres deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('apellidos')
        .notEmpty()
        .withMessage('Los apellidos son requeridos')
        .isLength({ min: 2, max: 100 })
        .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password debe tener entre 6 y 100 caracteres')
];
// Validaciones para actualizar usuario (todos los campos opcionales)
const usuarioUpdateValidation = [
    (0, express_validator_1.body)('rol_id')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Rol ID debe ser un número válido'),
    (0, express_validator_1.body)('nombres')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Los nombres deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('apellidos')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('Los apellidos deben tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('estado')
        .optional()
        .isBoolean()
        .withMessage('Estado debe ser true o false')
];
// Rutas
router.get('/', usuarioController.getAll.bind(usuarioController));
router.get('/:id', usuarioController.getById.bind(usuarioController));
router.post('/', usuarioValidation, usuarioController.create.bind(usuarioController));
router.put('/:id', usuarioUpdateValidation, usuarioController.update.bind(usuarioController));
router.delete('/:id', usuarioController.delete.bind(usuarioController));
router.patch('/:id/toggle-estado', usuarioController.toggleEstado.bind(usuarioController));
exports.default = router;
