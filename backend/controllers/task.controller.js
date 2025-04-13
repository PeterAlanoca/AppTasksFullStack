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
            return res.status(404).json({
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

exports.deleteById = async (req, res) => {
    try {
     
        const id = parseInt(req.params.id);
        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: 'ID inválido.'
            });
        }

        const user = req.user;

        const deletedRows = await Task.destroy({
            where: {
                id: id,
                userId: user.id
            }
        });
        
        if (deletedRows === 0) {
            return res.status(404).json({
                success: false,
                 message: 'Tarea no encontrada o no tienes permisos'
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Tarea eliminada correctamente.'
        });
    } catch (error) {
        console.error('Error en register:', error);
        return res.status(500).json({
            success: false,
            message: 'Error interno del servidor',
        });
    }
};
