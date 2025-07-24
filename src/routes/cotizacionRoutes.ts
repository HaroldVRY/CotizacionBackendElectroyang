import { Router } from 'express';
import { CotizacionController } from '../controllers/CotizacionController';
import { body } from 'express-validator';

const router = Router();
const cotizacionController = new CotizacionController();

// Validaciones para crear cotización
const cotizacionValidation = [
  body('clienteId')
    .isInt({ min: 1 })
    .withMessage('Cliente ID es requerido y debe ser un número válido'),
  
  body('receptor')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El receptor no puede exceder 255 caracteres'),
  
  body('observaciones')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  
  body('tiempoEntrega')
    .notEmpty()
    .withMessage('Tiempo de entrega es requerido')
    .isLength({ max: 255 })
    .withMessage('Tiempo de entrega no puede exceder 255 caracteres'),
  
  body('formaPago')
    .notEmpty()
    .withMessage('Forma de pago es requerida')
    .isLength({ max: 255 })
    .withMessage('Forma de pago no puede exceder 255 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['borrador', 'enviada', 'aprobada', 'rechazada'])
    .withMessage('Estado debe ser: borrador, enviada, aprobada o rechazada'),
  
  body('detalles')
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un detalle'),
  
  body('detalles.*.numeroItem')
    .isInt({ min: 1 })
    .withMessage('Número de item debe ser un entero mayor a 0'),
  
  body('detalles.*.cantidad')
    .isFloat({ min: 0.01 })
    .withMessage('Cantidad debe ser mayor a 0'),
  
  body('detalles.*.descripcion')
    .notEmpty()
    .withMessage('Descripción es requerida')
    .isLength({ max: 500 })
    .withMessage('Descripción no puede exceder 500 caracteres'),
  
  body('detalles.*.precioUnitario')
    .isFloat({ min: 0 })
    .withMessage('Precio unitario debe ser un número válido mayor o igual a 0'),
  
  body('detalles.*.servicioId')
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
  body('clienteId')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Cliente ID debe ser un número válido'),
  
  body('receptor')
    .optional()
    .isLength({ max: 255 })
    .withMessage('El receptor no puede exceder 255 caracteres'),
  
  body('observaciones')
    .optional()
    .isLength({ max: 1000 })
    .withMessage('Las observaciones no pueden exceder 1000 caracteres'),
  
  body('tiempoEntrega')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Tiempo de entrega no puede exceder 255 caracteres'),
  
  body('formaPago')
    .optional()
    .isLength({ max: 255 })
    .withMessage('Forma de pago no puede exceder 255 caracteres'),
  
  body('estado')
    .optional()
    .isIn(['borrador', 'enviada', 'aprobada', 'rechazada'])
    .withMessage('Estado debe ser: borrador, enviada, aprobada o rechazada'),
  
  body('detalles')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Debe incluir al menos un detalle si se proporciona'),
  
  body('detalles.*.numeroItem')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Número de item debe ser un entero mayor a 0'),
  
  body('detalles.*.cantidad')
    .optional()
    .isFloat({ min: 0.01 })
    .withMessage('Cantidad debe ser mayor a 0'),
  
  body('detalles.*.descripcion')
    .optional()
    .isLength({ max: 500 })
    .withMessage('Descripción no puede exceder 500 caracteres'),
  
  body('detalles.*.precioUnitario')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Precio unitario debe ser un número válido mayor o igual a 0'),
  
  body('detalles.*.servicioId')
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

export default router;
