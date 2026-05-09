"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const AccesoController_1 = require("../controllers/AccesoController");
const express_validator_1 = require("express-validator");
const router = (0, express_1.Router)();
const accesoController = new AccesoController_1.AccesoController();
// Validaciones para crear acceso
const accesoValidation = [
    (0, express_validator_1.body)('rol_id')
        .isInt({ min: 1 })
        .withMessage('Rol ID es requerido y debe ser un número válido'),
    (0, express_validator_1.body)('funcionalidad_id')
        .isInt({ min: 1 })
        .withMessage('Funcionalidad ID es requerido y debe ser un número válido'),
    (0, express_validator_1.body)('puede_crear')
        .optional()
        .isBoolean()
        .withMessage('puede_crear debe ser true o false'),
    (0, express_validator_1.body)('puede_leer')
        .optional()
        .isBoolean()
        .withMessage('puede_leer debe ser true o false'),
    (0, express_validator_1.body)('puede_editar')
        .optional()
        .isBoolean()
        .withMessage('puede_editar debe ser true o false'),
    (0, express_validator_1.body)('puede_eliminar')
        .optional()
        .isBoolean()
        .withMessage('puede_eliminar debe ser true o false')
];
// Validaciones para actualizar acceso
const accesoUpdateValidation = [
    (0, express_validator_1.body)('puede_crear')
        .optional()
        .isBoolean()
        .withMessage('puede_crear debe ser true o false'),
    (0, express_validator_1.body)('puede_leer')
        .optional()
        .isBoolean()
        .withMessage('puede_leer debe ser true o false'),
    (0, express_validator_1.body)('puede_editar')
        .optional()
        .isBoolean()
        .withMessage('puede_editar debe ser true o false'),
    (0, express_validator_1.body)('puede_eliminar')
        .optional()
        .isBoolean()
        .withMessage('puede_eliminar debe ser true o false')
];
// Rutas
router.get('/', accesoController.getAll.bind(accesoController));
router.get('/rol/:rol_id', accesoController.getByRol.bind(accesoController));
router.get('/funcionalidad/:funcionalidad_id', accesoController.getByFuncionalidad.bind(accesoController));
router.get('/:rol_id/:funcionalidad_id', accesoController.getAcceso.bind(accesoController));
router.post('/', accesoValidation, accesoController.create.bind(accesoController));
router.put('/:rol_id/:funcionalidad_id', accesoUpdateValidation, accesoController.update.bind(accesoController));
router.delete('/:rol_id/:funcionalidad_id', accesoController.delete.bind(accesoController));
exports.default = router;
