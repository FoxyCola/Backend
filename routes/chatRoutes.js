import express from 'express';
import { generateChatResponse, getConversationHistory } from '../controllers/chatController.js';

const router = express.Router();

router.post('/', generateChatResponse);
router.get('/history', getConversationHistory);

export { router };