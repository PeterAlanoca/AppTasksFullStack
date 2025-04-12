const express = require('express');
const router = express.Router();
const { body } = require('express-validator'); 
const { jwtAuth } = require('../middlewares/jwt.middleware.js');
const { register } = require('../controllers/task.controller');

router.post(
    '/tasks', 
    jwtAuth,
    [
        body("title").notEmpty().withMessage("El título es obligatorio"),
        body("description").notEmpty().withMessage("La description es obligatoria"),
        body("status").notEmpty().withMessage("El estado es obligatorio")
    ],
    register
);

module.exports = router;