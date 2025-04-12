const jwt = require('jsonwebtoken');
const { User } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1h';

exports.jwtAuth = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Acceso denegado. Verifica tus credenciales o permisos e intenta nuevamente.'
            });
        }

        const decoded = jwt.verify(token, JWT_SECRET);

        const user = await User.findByPk(decoded.id, {
            attributes: { exclude: ['password'] }
        });
        if (!user)  {
            return res.status(404).json({ message: "Usuario no encontrado." });
        }

        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };

        return res.status(201).json({
            success: true,
            data: userResponse,
            message: 'Infomación'
        });
    } catch (error) {
        console.error('Error en auth:', error);
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Token expirado'
            });
        }

        return res.status(401).json({
            success: false,
            message: 'Token inválido'
        });
    }

};