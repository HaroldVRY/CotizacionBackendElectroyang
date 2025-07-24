"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ClienteController_1 = require("../controllers/ClienteController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const clienteController = new ClienteController_1.ClienteController();
// Validaciones para crear cliente
const clienteValidation = [
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('email')
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('telefono')
        .optional()
        .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .withMessage('Teléfono debe tener un formato válido (7-20 caracteres, puede incluir +, espacios, - y paréntesis)'),
    (0, express_validator_1.body)('ruc')
        .optional()
        .isLength({ min: 8, max: 20 })
        .withMessage('RUC debe tener entre 8 y 20 caracteres'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La dirección no puede exceder 500 caracteres'),
    (0, express_validator_1.body)('contacto')
        .optional()
        .isLength({ max: 255 })
        .withMessage('El contacto no puede exceder 255 caracteres')
];
// Validaciones para actualizar cliente (todos los campos opcionales)
const clienteUpdateValidation = [
    (0, express_validator_1.body)('nombre')
        .optional()
        .isLength({ min: 2, max: 255 })
        .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
    (0, express_validator_1.body)('email')
        .optional()
        .isEmail()
        .withMessage('Email debe ser válido')
        .normalizeEmail(),
    (0, express_validator_1.body)('telefono')
        .optional()
        .matches(/^[\+]?[0-9\s\-\(\)]{7,20}$/)
        .withMessage('Teléfono debe tener un formato válido'),
    (0, express_validator_1.body)('ruc')
        .optional()
        .isLength({ min: 8, max: 20 })
        .withMessage('RUC debe tener entre 8 y 20 caracteres'),
    (0, express_validator_1.body)('direccion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('La dirección no puede exceder 500 caracteres'),
    (0, express_validator_1.body)('contacto')
        .optional()
        .isLength({ max: 255 })
        .withMessage('El contacto no puede exceder 255 caracteres')
];
// Rutas
router.get('/', clienteController.getAll.bind(clienteController));
router.get('/search', clienteController.search.bind(clienteController));
router.get('/search/advanced', clienteController.advancedSearch.bind(clienteController));
router.get('/:id', clienteController.getById.bind(clienteController));
router.post('/', clienteValidation, clienteController.create.bind(clienteController));
router.put('/:id', clienteUpdateValidation, clienteController.update.bind(clienteController));
router.delete('/:id', clienteController.delete.bind(clienteController));
exports.default = router;
