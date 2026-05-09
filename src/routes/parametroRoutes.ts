import { Router } from 'express';
import { ParametroController } from '../controllers/ParametroController';
import { body } from 'express-validator';

const router = Router();
const parametroController = new ParametroController();

// Validaciones para crear parámetro
const parametroValidation = [
  body('codigo')
    .notEmpty()
    .withMessage('El código es requerido')
    .isLength({ min: 1, max: 50 })
    .withMessage('El código debe tener entre 1 y 50 caracteres'),
  
  body('valor')
    .notEmpty()
    .withMessage('El valor es requerido')
    .isLength({ min: 1, max: 255 })
    .withMessage('El valor debe tener entre 1 y 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 255 })
    .withMessage('La descripción no puede exceder 255 caracteres')
];

// Validaciones para actualizar parámetro
const parametroUpdateValidation = [
  body('codigo')
    .optional()
    .isLength({ min: 1, max: 50 })
    .withMessage('El código debe tener entre 1 y 50 caracteres'),
  
  body('valor')
    .optional()
    .isLength({ min: 1, max: 255 })
    .withMessage('El valor debe tener entre 1 y 255 caracteres'),
  
  body('descripcion')
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

export default router;
