"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ServicioController_1 = require("../controllers/ServicioController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const servicioController = new ServicioController_1.ServicioController();
// Validaciones para crear servicio
const servicioValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    (0, express_validator_1.body)('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0'),
    (0, express_validator_1.body)('unidad')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La unidad no puede exceder 50 caracteres'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('Activo debe ser true o false')
];
// Validaciones para actualizar servicio (todos los campos opcionales)
const servicioUpdateValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('La descripción no puede exceder 1000 caracteres'),
    (0, express_validator_1.body)('precio')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('El precio debe ser un número válido mayor o igual a 0'),
    (0, express_validator_1.body)('unidad')
        .optional()
        .isLength({ max: 50 })
        .withMessage('La unidad no puede exceder 50 caracteres'),
    (0, express_validator_1.body)('activo')
        .optional()
        .isBoolean()
        .withMessage('Activo debe ser true o false')
];
// Rutas
router.get('/', servicioController.getAll.bind(servicioController));
router.get('/activos', servicioController.getActive.bind(servicioController));
router.get('/search', servicioController.search.bind(servicioController));
router.get('/search/advanced', servicioController.advancedSearch.bind(servicioController));
router.get('/:id', servicioController.getById.bind(servicioController));
router.post('/', servicioValidation, servicioController.create.bind(servicioController));
router.put('/:id', servicioUpdateValidation, servicioController.update.bind(servicioController));
router.delete('/:id', servicioController.delete.bind(servicioController));
exports.default = router;
