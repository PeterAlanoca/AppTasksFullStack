const moment = require('moment');
require('moment/locale/es');
moment.locale('es');
const { Task } = require('../models');
const { validationResult } = require('express-validator');

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
     
        const user = req.user;

        const { title, description, status, dueDate } = req.body;
        
        const newTask = {
            userId: user.id,
            title,  
            description,
            status, 
            dueDate,
        };
        const task = await Task.create(newTask);

        const data = {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: task.dueDate
        };

        return res.status(201).json({
            success: true,
            data: data,
            message: 'Tarea registrada exitosamente.'
        });
    } catch (error) {
        console.error('Error en register:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

exports.getByUser = async (req, res) => {
    try {
     
        const user = req.user;

        const tasks = await Task.findAll({
            attributes: { 
                exclude: ['updatedAt', 'userId']
            },
            where: { 
                userId: user.id 
            },
            order: [['id', 'DESC']]
        });

        const data = tasks.map(t => {
            const task = t.get({ plain: true });
            return {
                id: task.id,
                title: task.title,
                description: task.description,
                status: task.status,
                dueDate: (task.dueDate && moment(task.dueDate).isValid()) 
                    ? moment(task.dueDate).format('D [de] MMMM [de] YYYY') 
                    : null,
                createdAt: moment(task.createdAt).format('D [de] MMMM [de] YYYY hh:mm A'),
            };
        });

        return res.status(200).json({
            success: true,
            data: data,
            message: 'Tarea registrada exitosamente.'
        });
    } catch (error) {
        console.error('Error en register:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

exports.getById = async (req, res) => {
    try {
     
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido.'
            });
        }

        const user = req.user;

        const task = await Task.findOne({
            attributes: { 
                exclude: ['updatedAt', 'userId']    
            },
            where: { 
              id: id,
              userId: user.id
            }
        });
          
        if (!task) {
            return res.status(400).json({
                success: false,
                message: 'Tarea no encontrada.'
            });
        }

        const data = {
            id: task.id,
            title: task.title,
            description: task.description,
            status: task.status,
            dueDate: (task.dueDate && moment(task.dueDate).isValid()) 
                    ? moment(task.dueDate).format('D [de] MMMM [de] YYYY') 
                    : null,
            createdAt: moment(task.createdAt).format('D [de] MMMM [de] YYYY hh:mm A'),
        };

        return res.status(200).json({
            success: true,
            data: data,
            message: 'Ok'
        });
    } catch (error) {
        console.error('Error en register:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};

/*
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

        return res.json({
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

        return res.status(201).json({
            success: true,
            data: userResponse,
            message: 'success'
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor'
        });
    }
};*/
