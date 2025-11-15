import express from 'express';

import aiController from '../../controllers/ai.controller.js';

const router = express.Router();

// Public routes
router.post('/:questionId', aiController.getAiResponse);

export default router;