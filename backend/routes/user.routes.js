const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); 
const { jwtAuth } = require('../middlewares/jwt.middleware.js');
const { register, login, profile } = require('../controllers/user.controller');

router.post(
    '/auth/register', 
    [
        body("name").notEmpty().withMessage("El nombre es obligatorio"),
        body("email").isEmail().withMessage("Debe ser un email válido"),
        body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    ],
    register
);

router.post(
    '/auth/login', 
    [
        body("email").isEmail().withMessage("Debe ser un email válido"),
        body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    ],
    login
);

router.get(
    '/auth/me', 
    jwtAuth,
    profile
);

module.exports = router;