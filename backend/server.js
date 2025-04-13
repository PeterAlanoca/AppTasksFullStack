const express = require('express');
const app = express();
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

const cors = require('cors');

const allowedOrigins = [
  'http://localhost:3000',
  'https://tasks-app-i3ue.onrender.com'
];

app.use(cors({
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports=app
