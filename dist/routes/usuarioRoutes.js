"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const UsuarioController_1 = require("../controllers/UsuarioController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const usuarioController = new UsuarioController_1.UsuarioController();
// Validaciones para crear usuario
const usuarioValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .isLength({ min: 6, max: 100 })
        .withMessage('Password debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password debe contener al menos una minúscula, una mayúscula y un número'),
    (0, express_validator_1.body)('rol')
        .isIn(['admin', 'usuario'])
        .withMessage('Rol debe ser admin o usuario'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('Activo debe ser true o false')
];
// Validaciones para actualizar usuario (todos los campos opcionales)
const usuarioUpdateValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('password')
        .optional()
        .isLength({ min: 6, max: 100 })
        .withMessage('Password debe tener entre 6 y 100 caracteres')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password debe contener al menos una minúscula, una mayúscula y un número'),
    (0, express_validator_1.body)('rol')
        .optional()
        .isIn(['admin', 'usuario'])
        .withMessage('Rol debe ser admin o usuario'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('Activo debe ser true o false')
];
// Rutas
router.get('/', usuarioController.getAll.bind(usuarioController));
router.get('/:id', usuarioController.getById.bind(usuarioController));
router.post('/', usuarioValidation, usuarioController.create.bind(usuarioController));
router.put('/:id', usuarioUpdateValidation, usuarioController.update.bind(usuarioController));
router.delete('/:id', usuarioController.delete.bind(usuarioController));
exports.default = router;
