import { OpenAI } from 'openai';
import QuizAttempt from '../models/QuizAttempt.js';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Generar 5 preguntas con 4 opciones
export const generateQuiz = async (req, res) => {
  const { topic } = req.body;

  try {
    const prompt = `
      Genera un cuestionario de 5 preguntas de opción múltiple sobre el tema "${topic}".
      Para cada pregunta, incluye 4 opciones de respuesta (A, B, C, D) y especifica cuál es la correcta.
      Formato de respuesta: JSON con propiedades 'question', 'options', y 'correctAnswer'.
    `;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.7
    });

    const questions = JSON.parse(completion.choices[0].message.content);

    res.json({ topic, questions });
  } catch (error) {
    console.error('Error al generar preguntas:', error);
    res.status(500).json({ error: 'Error al generar el cuestionario' });
  }
};

// Verificar respuestas y guardar intento
export const submitQuiz = async (req, res) => {
  const { topic, questions } = req.body;

  try {
    const correctCount = questions.filter(q => q.userAnswer === q.correctAnswer).length;

    const attempt = new QuizAttempt({
      topic,
      questions,
      score: correctCount
    });

    await attempt.save();

    res.json({ score: correctCount, total: questions.length });
  } catch (error) {
    console.error('Error al guardar el intento:', error);
    res.status(500).json({ error: 'Error al procesar el intento' });
  }
};
