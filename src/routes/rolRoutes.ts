import { Router } from 'express';
import { RolController } from '../controllers/RolController';
import { body } from 'express-validator';

const router = Router();
const rolController = new RolController();

// Validaciones para crear rol
const rolValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres')
];

// Validaciones para actualizar rol
const rolUpdateValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 50 })
    .withMessage('El nombre debe tener entre 2 y 50 caracteres'),
  
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
router.get('/', rolController.getAll.bind(rolController));
router.get('/:id', rolController.getById.bind(rolController));
router.post('/', rolValidation, rolController.create.bind(rolController));
router.put('/:id', rolUpdateValidation, rolController.update.bind(rolController));
router.delete('/:id', rolController.delete.bind(rolController));
router.patch('/:id/toggle-estado', rolController.toggleEstado.bind(rolController));

export default router;
