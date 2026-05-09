"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const MaestroController_1 = require("../controllers/MaestroController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const maestroController = new MaestroController_1.MaestroController();
// Validaciones para maestro cabecera
const maestroCabeceraValidation = [
    (0, express_validator_1.body)('codigo')
        .notEmpty()
        .withMessage('El código es requerido')
        .isLength({ min: 1, max: 50 })
        .withMessage('El código debe tener entre 1 y 50 caracteres'),
    (0, express_validator_1.body)('nombre')
        .notEmpty()
        .withMessage('El nombre es requerido')
        .isLength({ min: 2, max: 100 })
        .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .optional()
        .isLength({ max: 255 })
        .withMessage('La descripción no puede exceder 255 caracteres')
];
// Validaciones para maestro detalle
const maestroDetalleValidation = [
    (0, express_validator_1.body)('cabecera_id')
        .isInt({ min: 1 })
        .withMessage('Cabecera ID es requerido y debe ser un número válido'),
    (0, express_validator_1.body)('codigo_valor')
        .notEmpty()
        .withMessage('El código de valor es requerido')
        .isLength({ min: 1, max: 50 })
        .withMessage('El código de valor debe tener entre 1 y 50 caracteres'),
    (0, express_validator_1.body)('descripcion')
        .notEmpty()
        .withMessage('La descripción es requerida')
        .isLength({ min: 1, max: 255 })
        .withMessage('La descripción debe tener entre 1 y 255 caracteres'),
    (0, express_validator_1.body)('estado')
        .optional()
        .isBoolean()
        .withMessage('Estado debe ser true o false')
];
// CABECERA ROUTES
router.get('/cabecera', maestroController.getAllCabeceras.bind(maestroController));
router.get('/cabecera/:id', maestroController.getCabeceraById.bind(maestroController));
router.post('/cabecera', maestroCabeceraValidation, maestroController.createCabecera.bind(maestroController));
router.put('/cabecera/:id', maestroCabeceraValidation, maestroController.updateCabecera.bind(maestroController));
router.delete('/cabecera/:id', maestroController.deleteCabecera.bind(maestroController));
// DETALLE ROUTES
router.get('/detalle', maestroController.getAllDetalles.bind(maestroController));
router.get('/detalle/:id', maestroController.getDetalleById.bind(maestroController));
router.get('/detalle/cabecera/:cabecera_id', maestroController.getDetallesByCabecera.bind(maestroController));
router.post('/detalle', maestroDetalleValidation, maestroController.createDetalle.bind(maestroController));
router.put('/detalle/:id', maestroDetalleValidation, maestroController.updateDetalle.bind(maestroController));
router.delete('/detalle/:id', maestroController.deleteDetalle.bind(maestroController));
router.patch('/detalle/:id/toggle-estado', maestroController.toggleDetalleEstado.bind(maestroController));
exports.default = router;
