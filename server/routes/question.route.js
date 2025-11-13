import express from 'express';
import questionController from '../controllers/question.controller.js';

const router = express.Router();

// router.get('/api/questions', questionController.getAllQuestions);
router.get('/api/question/', questionController.getRandomQuestion);
router.get('/api/question/:id', questionController.getQuestion);
router.post('/api/question', questionController.createQuestion);

export default router;