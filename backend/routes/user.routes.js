const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); 
const { create } = require('../controllers/user.controller');

const validateUser = [
    body('name')
      .notEmpty().withMessage('El nombre es obligatorio')
      .isLength({ min: 2 }).withMessage('Mínimo 2 caracteres')
      .trim()
      .escape(),
      
    body('email')
      .notEmpty().withMessage('El email es obligatorio')
      .isEmail().withMessage('Formato de email inválido')
      .normalizeEmail(),
      
    body('password')
      .notEmpty().withMessage('La contraseña es obligatoria')
      .isLength({ min: 8 }).withMessage('Mínimo 8 caracteres')
      .matches(/[A-Z]/).withMessage('Debe contener al menos una mayúscula')
      .matches(/[0-9]/).withMessage('Debe contener al menos un número')
  ];

router.post(
    '/auth/register', 
    [
        body("name").notEmpty().withMessage("El nombre es obligatorio"),
        body("email").isEmail().withMessage("Debe ser un email válido"),
        body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    ],
    create
);

module.exports = router;