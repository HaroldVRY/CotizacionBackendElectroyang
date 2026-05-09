import { Router } from 'express';
import { AccesoController } from '../controllers/AccesoController';
import { body } from 'express-validator';

const router = Router();
const accesoController = new AccesoController();

// Validaciones para crear acceso
const accesoValidation = [
  body('rol_id')
    .isInt({ min: 1 })
    .withMessage('Rol ID es requerido y debe ser un número válido'),
  
  body('funcionalidad_id')
    .isInt({ min: 1 })
    .withMessage('Funcionalidad ID es requerido y debe ser un número válido'),
  
  body('puede_crear')
    .optional()
    .isBoolean()
    .withMessage('puede_crear debe ser true o false'),
  
  body('puede_leer')
    .optional()
    .isBoolean()
    .withMessage('puede_leer debe ser true o false'),
  
  body('puede_editar')
    .optional()
    .isBoolean()
    .withMessage('puede_editar debe ser true o false'),
  
  body('puede_eliminar')
    .optional()
    .isBoolean()
    .withMessage('puede_eliminar debe ser true o false')
];

// Validaciones para actualizar acceso
const accesoUpdateValidation = [
  body('puede_crear')
    .optional()
    .isBoolean()
    .withMessage('puede_crear debe ser true o false'),
  
  body('puede_leer')
    .optional()
    .isBoolean()
    .withMessage('puede_leer debe ser true o false'),
  
  body('puede_editar')
    .optional()
    .isBoolean()
    .withMessage('puede_editar debe ser true o false'),
  
  body('puede_eliminar')
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

export default router;
