const { User } = require('../models');
const { validationResult } = require('express-validator');
const bcrypt = require("bcryptjs");
const jwt = require('jsonwebtoken');

require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

exports.register = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorMessages = errors.array()
                .map(err => err.msg)
                .join('\n'); 
            
            return res.status(400).json({
                success: false,
                message: errorMessages 
            }); 
        }
     
        const { name, email, password } = req.body;
        
        const existingUser = await User.findOne({ where: { email } });
        
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'El correo electrónico ya está registrado.'
            });
        }
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = { 
            name,  
            email, 
            password: hashedPassword 
        };

        const user = await User.create(newUser);

        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        return res.status(201).json({
            success: true,
            data: userResponse,
            message: 'Usuario registrado exitosamente.'
        });

    } catch (error) {
        console.error('Error en register:', error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Este correo ya está registrado. Si ya tienes una cuenta intenta iniciar sesión.',
            });
        
        } else if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico no es correcto.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
};

exports.login = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array().map(err => ({
                    field: err.path,
                    message: err.msg
                }))
            });
        }

        const { email, password } = req.body;
        
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Este correo no está registrado.'
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'La contraseña ingresada es incorrecta. Por favor, vuelve a intentarlo.'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email
            },
            JWT_SECRET,
            { 
                expiresIn: TOKEN_EXPIRATION,
                algorithm: 'HS256'
            }
        );

        return res.status(200).json({
            success: true,
            data: {
                token,
                expiresIn: TOKEN_EXPIRATION,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                }
            },
            message: `Bienvenido ${user.name}`
        });

    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};

exports.profile = async (req, res) => {
    try {
        const user = req.user;

        if (!user)  {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        return res.status(200).json({
            success: true,
            data: userResponse,
            message: 'Ok'
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};
