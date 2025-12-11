import mongoose from 'mongoose';

const bookSchema = mongoose.Schema(
  {
    // Link to the user who owns this book
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    title: {
      type: String,
      required: true,
    },
    author: {
      type: String,
      required: true,
    },
    genre: {
      type: String,
      default: 'N/A',
    },
    status: {
      type: String,
      required: true,
      enum: ['toRead', 'currentlyReading', 'completed'],
      default: 'toRead',
    },
    coverUrl: {
      type: String,
      default: 'https://placehold.co/128x192/475569/ffffff?text=No+Cover',
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

const Book = mongoose.model('Book', bookSchema);
export default Book;
