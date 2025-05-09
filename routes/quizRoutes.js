import express from 'express';
import { OpenAI } from 'openai'; // Importar la clase OpenAI
import dotenv from 'dotenv';

dotenv.config(); // Cargar variables de entorno

const router = express.Router();

// Configurar OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Asegúrate de tener tu clave de API en el archivo .env
});

router.get('/:topic', async (req, res) => {
  const { topic } = req.params;

  try {
    // Solicitar a la API de OpenAI para generar preguntas y respuestas sobre el tema
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // El modelo adecuado para la solicitud
      messages: [
        {
          role: 'system',
          content: 'Eres un generador de cuestionarios para temas de trivia. Genera 5 preguntas con 4 opciones para el tema especificado.',
        },
        {
          role: 'user',
          content: `Genera 5 preguntas con 4 opciones sobre el tema de ${topic}.`,
        },
      ],
      max_tokens: 500,
    });

    const quizData = response.choices[0].message.content;
    const questions = parseQuizData(quizData); // Necesitamos una función para parsear el contenido

    res.json(questions);
  } catch (error) {
    console.error('Error al generar preguntas desde OpenAI:', error);
    res.status(500).json({ error: 'Hubo un error al generar las preguntas' });
  }
});

// Función para parsear las preguntas generadas
const parseQuizData = (data) => {
  const questions = data.split('\n').map((line) => {
    const parts = line.split(':');
    return {
      question: parts[0],
      options: parts.slice(1),
    };
  });
  return questions;
};

export { router };
