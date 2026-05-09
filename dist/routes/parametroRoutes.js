"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ParametroController_1 = require("../controllers/ParametroController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const parametroController = new ParametroController_1.ParametroController();
// Validaciones para crear parámetro
const parametroValidation = [
    (0, express_validator_1.body)('codigo')
        .notEmpty()
        .withMessage('El código es requerido')
        .isLength({ min: 1, max: 50 })
        .withMessage('El código debe tener entre 1 y 50 caracteres'),
    (0, express_validator_1.body)('valor')
        .notEmpty()
        .withMessage('El valor es requerido')
        .isLength({ min: 1, max: 255 })
        .withMessage('El valor debe tener entre 1 y 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
];
// Validaciones para actualizar parámetro
const parametroUpdateValidation = [
    (0, express_validator_1.body)('codigo')
        .optional()
        .isLength({ min: 1, max: 50 })
        .withMessage('El código debe tener entre 1 y 50 caracteres'),
    (0, express_validator_1.body)('valor')
        .optional()
        .isLength({ min: 1, max: 255 })
        .withMessage('El valor debe tener entre 1 y 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
];
// Rutas
router.get('/', parametroController.getAll.bind(parametroController));
router.get('/codigo/:codigo', parametroController.getByCodigo.bind(parametroController));
router.get('/:id', parametroController.getById.bind(parametroController));
router.post('/', parametroValidation, parametroController.create.bind(parametroController));
router.put('/:id', parametroUpdateValidation, parametroController.update.bind(parametroController));
router.delete('/:id', parametroController.delete.bind(parametroController));
exports.default = router;
