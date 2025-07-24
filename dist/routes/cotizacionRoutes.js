"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CotizacionController_1 = require("../controllers/CotizacionController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const cotizacionController = new CotizacionController_1.CotizacionController();
// Validaciones para crear cotización
const cotizacionValidation = [
    (0, express_validator_1.body)('clienteId')
        .isInt({ min: 1 })
        .withMessage('Cliente ID es requerido y debe ser un número válido'),
    (0, express_validator_1.body)('receptor')
        .optional()
        .isLength({ max: 255 })
        .withMessage('El receptor no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('observaciones')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
    (0, express_validator_1.body)('tiempoEntrega')
        .notEmpty()
        .withMessage('Tiempo de entrega es requerido')
        .isLength({ max: 255 })
        .withMessage('Tiempo de entrega no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('formaPago')
        .notEmpty()
        .withMessage('Forma de pago es requerida')
        .isLength({ max: 255 })
        .withMessage('Forma de pago no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isIn(['borrador', 'enviada', 'aprobada', 'rechazada'])
        .withMessage('Estado debe ser: borrador, enviada, aprobada o rechazada'),
    (0, express_validator_1.body)('detalles')
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un detalle'),
    (0, express_validator_1.body)('detalles.*.numeroItem')
        .isInt({ min: 1 })
        .withMessage('Número de item debe ser un entero mayor a 0'),
    (0, express_validator_1.body)('detalles.*.cantidad')
        .isFloat({ min: 0.01 })
        .withMessage('Cantidad debe ser mayor a 0'),
    (0, express_validator_1.body)('detalles.*.descripcion')
        .notEmpty()
        .withMessage('Descripción es requerida')
        .isLength({ max: 500 })
        .withMessage('Descripción no puede exceder 500 caracteres'),
    (0, express_validator_1.body)('detalles.*.precioUnitario')
        .isFloat({ min: 0 })
        .withMessage('Precio unitario debe ser un número válido mayor o igual a 0'),
    (0, express_validator_1.body)('detalles.*.servicioId')
        .optional({ nullable: true })
        .custom((value) => {
        if (value === null || value === undefined) {
            return true; // Permitir null/undefined
        }
        if (!Number.isInteger(value) || value < 1) {
            throw new Error('Servicio ID debe ser un número válido mayor a 0 o null');
        }
        return true;
    })
];
// Validaciones para actualizar cotización (todos los campos opcionales)
const cotizacionUpdateValidation = [
    (0, express_validator_1.body)('clienteId')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Cliente ID debe ser un número válido'),
    (0, express_validator_1.body)('receptor')
        .optional()
        .isLength({ max: 255 })
        .withMessage('El receptor no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('observaciones')
        .optional()
        .isLength({ max: 1000 })
        .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
    (0, express_validator_1.body)('tiempoEntrega')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Tiempo de entrega no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('formaPago')
        .optional()
        .isLength({ max: 255 })
        .withMessage('Forma de pago no puede exceder 255 caracteres'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isIn(['borrador', 'enviada', 'aprobada', 'rechazada'])
        .withMessage('Estado debe ser: borrador, enviada, aprobada o rechazada'),
    (0, express_validator_1.body)('detalles')
        .optional()
        .isArray({ min: 1 })
        .withMessage('Debe incluir al menos un detalle si se proporciona'),
    (0, express_validator_1.body)('detalles.*.numeroItem')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Número de item debe ser un entero mayor a 0'),
    (0, express_validator_1.body)('detalles.*.cantidad')
        .optional()
        .isFloat({ min: 0.01 })
        .withMessage('Cantidad debe ser mayor a 0'),
    (0, express_validator_1.body)('detalles.*.descripcion')
        .optional()
        .isLength({ max: 500 })
        .withMessage('Descripción no puede exceder 500 caracteres'),
    (0, express_validator_1.body)('detalles.*.precioUnitario')
        .optional()
        .isFloat({ min: 0 })
        .withMessage('Precio unitario debe ser un número válido mayor o igual a 0'),
    (0, express_validator_1.body)('detalles.*.servicioId')
        .optional({ nullable: true })
        .custom((value) => {
        if (value === null || value === undefined) {
            return true; // Permitir null/undefined
        }
        if (!Number.isInteger(value) || value < 1) {
            throw new Error('Servicio ID debe ser un número válido mayor a 0 o null');
        }
        return true;
    })
];
// Rutas
router.get('/', cotizacionController.getAll.bind(cotizacionController));
router.get('/search', cotizacionController.search.bind(cotizacionController));
router.get('/search/advanced', cotizacionController.advancedSearch.bind(cotizacionController));
router.get('/cliente/:clienteId', cotizacionController.getByCliente.bind(cotizacionController));
router.get('/estado/:estado', cotizacionController.getByEstado.bind(cotizacionController));
router.get('/numero/:numero', cotizacionController.getByNumero.bind(cotizacionController));
router.get('/:id', cotizacionController.getById.bind(cotizacionController));
router.post('/', cotizacionValidation, cotizacionController.create.bind(cotizacionController));
router.put('/:id', cotizacionUpdateValidation, cotizacionController.update.bind(cotizacionController));
router.delete('/:id', cotizacionController.delete.bind(cotizacionController));
exports.default = router;
