"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const FuncionalidadController_1 = require("../controllers/FuncionalidadController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const funcionalidadController = new FuncionalidadController_1.FuncionalidadController();
// Validaciones para crear funcionalidad
const funcionalidadValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('ruta_frontend')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La ruta frontend no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
];
// Validaciones para actualizar funcionalidad
const funcionalidadUpdateValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('ruta_frontend')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La ruta frontend no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isBoolean()
        .withMessage('Estado debe ser true o false')
];
// Rutas
router.get('/', funcionalidadController.getAll.bind(funcionalidadController));
router.get('/:id', funcionalidadController.getById.bind(funcionalidadController));
router.post('/', funcionalidadValidation, funcionalidadController.create.bind(funcionalidadController));
router.put('/:id', funcionalidadUpdateValidation, funcionalidadController.update.bind(funcionalidadController));
router.delete('/:id', funcionalidadController.delete.bind(funcionalidadController));
router.patch('/:id/toggle-estado', funcionalidadController.toggleEstado.bind(funcionalidadController));
exports.default = router;
