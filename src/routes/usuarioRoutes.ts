import { Router } from 'express';
import { UsuarioController } from '../controllers/UsuarioController';
import { body } from 'express-validator';

const router = Router();
const usuarioController = new UsuarioController();

// Validaciones para crear usuario
const usuarioValidation = [
  body('nombre')
    .notEmpty()
    .withMessage('El nombre es requerido')
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('email')
    .isEmail()
    .withMessage('Email debe ser válido')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6, max: 100 })
    .withMessage('Password debe tener entre 6 y 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password debe contener al menos una minúscula, una mayúscula y un número'),
  
  body('rol')
    .isIn(['admin', 'usuario'])
    .withMessage('Rol debe ser admin o usuario'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser true o false')
];

// Validaciones para actualizar usuario (todos los campos opcionales)
const usuarioUpdateValidation = [
  body('nombre')
    .optional()
    .isLength({ min: 2, max: 255 })
    .withMessage('El nombre debe tener entre 2 y 255 caracteres'),
  
  body('email')
    .optional()
    .isEmail()
    .withMessage('Email debe ser válido')
    .normalizeEmail(),
  
  body('password')
    .optional()
    .isLength({ min: 6, max: 100 })
    .withMessage('Password debe tener entre 6 y 100 caracteres')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password debe contener al menos una minúscula, una mayúscula y un número'),
  
  body('rol')
    .optional()
    .isIn(['admin', 'usuario'])
    .withMessage('Rol debe ser admin o usuario'),
  
  body('activo')
    .optional()
    .isBoolean()
    .withMessage('Activo debe ser true o false')
];

// Rutas
router.get('/', usuarioController.getAll.bind(usuarioController));
router.get('/:id', usuarioController.getById.bind(usuarioController));
router.post('/', usuarioValidation, usuarioController.create.bind(usuarioController));
router.put('/:id', usuarioUpdateValidation, usuarioController.update.bind(usuarioController));
router.delete('/:id', usuarioController.delete.bind(usuarioController));

export default router;
