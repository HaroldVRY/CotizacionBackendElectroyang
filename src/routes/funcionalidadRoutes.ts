import { Router } from 'express';
import { FuncionalidadController } from '../controllers/FuncionalidadController';
import { body } from 'express-validator';

const router = Router();
const funcionalidadController = new FuncionalidadController();

// Validaciones para crear funcionalidad
const funcionalidadValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('ruta_frontend')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La ruta frontend no puede exceder 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres')
];

// Validaciones para actualizar funcionalidad
const funcionalidadUpdateValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre debe tener entre 2 y 100 caracteres'),
  
  body('ruta_frontend')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La ruta frontend no puede exceder 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres'),
  
  body('estado')
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

export default router;
