const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
//const pedidoRoutes = require('./routes/pedido.routes');

app.use(express.json());
app.use('/api', userRoutes);
//app.use('/api', pedidoRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));


module.exports=app

/*const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { body, validationResult } = require("express-validator");

const app = express();

app.use(express.json());

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY;

const PORT = process.env.PORT || 3000;

const users = [];

app.post(
    "/api/auth/register",
    [
        body("name").notEmpty().withMessage("El nombre es obligatorio"),
        body("email").isEmail().withMessage("Debe ser un email válido"),
        body("password").isLength({ min: 6 }).withMessage("La contraseña debe tener al menos 6 caracteres"),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;

        // Verificar si el usuario ya existe
        if (users.find(user => user.email === email)) {
            return res.status(400).json({ message: "El usuario ya está registrado" });
        }

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Guardar usuario en la "base de datos" con estado "activo" por defecto
        const newUser = { id: users.length + 1, name, email, password: hashedPassword, status: 'activo' };
        users.push(newUser);

        res.status(201).json({ message: "Usuario registrado con éxito" });
    }
);

// Inicio de sesión
app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;

    const user = users.find(user => user.email === email);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    if (user.status !== 'activo') {
        return res.status(400).json({ message: "Cuenta bloqueada o no activa" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Contraseña incorrecta" });

    const token = jwt.sign(
        { id: user.id, email: user.email }, 
        SECRET_KEY,
        { expiresIn: process.env.TOKEN_EXPIRATION || "1h" } 
    );
    res.json({ token });
});

app.get("/api/auth/me", (req, res) => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Acceso denegado, token requerido" });

    try {
        const decoded = jwt.verify(token, SECRET_KEY);

        const user = users.find(user => user.id === decoded.id);
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });

        res.json({ id: user.id, name: user.name, email: user.email });
    } catch (error) {
        res.status(401).json({ message: "Token inválido o expirado" });
    }
});

app.put("/api/users/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body; 

    const user = users.find(user => user.id == id);
    if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
    }

    if (!['activo', 'bloqueado', 'pendiente'].includes(status)) {
        return res.status(400).json({ message: "Estado no válido" });
    }
    user.status = status;
    res.json({ message: `Estado del usuario actualizado a ${status}` });
});

app.listen(PORT, () => console.log(`Servidor en http://localhost:${PORT}`));*/