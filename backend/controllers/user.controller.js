const { User } = require('../models');

exports.create = async (req, res) => {
    try {
        const user = await User.create(req.body);
        const userResponse = {
            id: user.id,
            email: user.email,
            name: user.name,
        };
        return res.status(201).json({
            success: true,
            data: userResponse,
            message: 'Usuario creado exitosamente.'
        });
    } catch (error) {
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({
                success: false,
                message: 'Este correo ya está registrado. Si ya tienes una cuenta intenta iniciar sesión.',
            });
        
        } else if (error.name === 'SequelizeValidationError') {
            return res.status(400).json({
                success: false,
                message: 'El formato del correo electrónico no  es correcto.'
            });
        } else {
            return res.status(500).json({
                success: false,
                message: 'Error interno del servidor',
            });
        }
    }
};

/*
exports.obtenerClientes = async (req, res) => {
    const clientes = await Cliente.findAll();
    res.json(clientes);
};


exports.obtenerClientePorId = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }
    res.json(cliente);
};

exports.actualizarCliente = async (req, res) => {
    const { id } = req.params;
    const cliente = await Cliente.findByPk(id);

    if (!cliente) {
        return res.status(404).json({ mensaje: 'Cliente no encontrado' });
    }

    await cliente.update(req.body);
    res.json(cliente);
};

exports.eliminarCliente = async (req, res) => {
    try {
        const { id } = req.params;
        const cliente = await Cliente.findByPk(id);

        if (!cliente) {
            return res.status(404).json({ mensaje: 'Cliente no encontrado' });
        }

        await cliente.destroy();
        res.json({ mensaje: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al eliminar el cliente', error: error.message });
    }
};*/