import express from 'express';
import {
  searchGoogleBooks,
  getGeminiInsights,
} from '../controllers/apiController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// Protect these routes so only logged-in users can use the APIs
router.get('/gbooks/search', protect, searchGoogleBooks);
router.post('/gemini/insights', protect, getGeminiInsights);

export default router;
