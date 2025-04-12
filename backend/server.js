const express = require('express');
const app = express();
const userRoutes = require('./routes/user.routes');
const taskRoutes = require('./routes/task.routes');

app.use(express.json());
app.use('/api', userRoutes);
app.use('/api', taskRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));

module.exports=app
