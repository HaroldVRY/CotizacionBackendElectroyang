"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const RolController_1 = require("../controllers/RolController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const rolController = new RolController_1.RolController();
// Validaciones para crear rol
const rolValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
];
// Validaciones para actualizar rol
const rolUpdateValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 50 })
        .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
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
router.get('/', rolController.getAll.bind(rolController));
router.get('/:id', rolController.getById.bind(rolController));
router.post('/', rolValidation, rolController.create.bind(rolController));
router.put('/:id', rolUpdateValidation, rolController.update.bind(rolController));
router.delete('/:id', rolController.delete.bind(rolController));
router.patch('/:id/toggle-estado', rolController.toggleEstado.bind(rolController));
exports.default = router;
