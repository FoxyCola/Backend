import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { router as chatRoutes } from './routes/chatRoutes.js';
import { router as quizRoutes } from './routes/quizroutes.js'; // Importar las rutas del cuestionario

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ MongoDB conectado'))
  .catch(err => console.error('❌ Error en MongoDB:', err));

// Rutas
app.use('/api/chat', chatRoutes); // Ruta para ChatGPT
app.use('/api/quiz', quizRoutes); // Ruta para el cuestionario

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
