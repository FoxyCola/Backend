import OpenAI from 'openai';
import dotenv from 'dotenv';
import Conversation from '../models/Conversation.js';

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export const generateChatResponse = async (req, res) => {
try {
    const { topic } = req.body;

    const prompt = `Genera 5 preguntas tipo test con 4 opciones y una única respuesta correcta sobre "${topic}". Devuelve un JSON con:
[
{
    "pregunta": "...",
    "opciones": ["...", "...", "...", "..."],
    "respuesta_correcta": "..."
}
]`;

    const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "Eres un generador de preguntas tipo test." },
        { role: "user", content: prompt }
    ],
    max_tokens: 800
    });

    const response = completion.choices[0].message.content;

    const saved = new Conversation({ prompt, response });
    await saved.save();

    res.json({ response });
} catch (error) {
    res.status(500).json({ error: 'Error al generar las preguntas', message: error.message });
}
};

export const getConversationHistory = async (req, res) => {
const history = await Conversation.find().sort({ createdAt: -1 }).limit(10);
res.json(history);
};
