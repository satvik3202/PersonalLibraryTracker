import express from 'express';
import {
  getBooks,
  addBook,
  updateBook,
  deleteBook,
} from '../controllers/bookController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

// All these routes are protected. User must be logged in.
router.route('/').get(protect, getBooks).post(protect, addBook);

router
  .route('/:id')
  .put(protect, updateBook)
  .delete(protect, deleteBook);

export default router;
