import { Router } from 'express';
import { ServicioController } from '../controllers/ServicioController';
import { body } from 'express-validator';

const router = Router();
const servicioController = new ServicioController();

// Validaciones para crear servicio
const servicioValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número válido mayor o igual a 0'),
  
  body('unidad')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La unidad no puede exceder 50 caracteres'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser true o false')
];

// Validaciones para actualizar servicio (todos los campos opcionales)
const servicioUpdateValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('descripcion')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('La descripción no puede exceder 1000 caracteres'),
  
  body('precio')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El precio debe ser un número válido mayor o igual a 0'),
  
  body('unidad')
    .optional()
    .isLength({ max: 50 })
    .withMessage('La unidad no puede exceder 50 caracteres'),
  
  body('activo')
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

export default router;
