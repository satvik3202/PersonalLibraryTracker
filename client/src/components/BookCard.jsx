import React from 'react';
import { Settings, Edit, Trash2, Zap } from 'lucide-react';

const BookCard = ({ book, onToggleStatus, onEdit, onDelete, onGetInsights }) => {
  
  const getStatusDisplay = (status) => {
    const statusMap = {
      toRead: { label: 'To Read', color: 'bg-blue-100 text-blue-800' },
      currentlyReading: { label: 'Reading', color: 'bg-yellow-100 text-yellow-800' },
      completed: { label: 'Completed', color: 'bg-green-100 text-green-800' },
    };
    const display = statusMap[status] || {};
    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${display.color}`}>
        {display.label}
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row transform transition duration-300 hover:shadow-xl">
      <img
        src={book.coverUrl}
        alt={`Cover for ${book.title}`}
        className="w-full md:w-32 h-48 object-cover object-center md:h-auto flex-shrink-0"
        onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/128x192/475569/ffffff?text=No+Cover'; }}
      />
      <div className="p-4 flex flex-col justify-between flex-grow">
        <div>
          <h3 className="text-xl font-bold text-gray-800 line-clamp-2">{book.title}</h3>
          <p className="text-sm text-gray-500 italic">by {book.author}</p>
          <p className="text-xs text-gray-400 mb-2">Genre: {book.genre || 'N/A'}</p>
          {getStatusDisplay(book.status)}
        </div>
        <div className="mt-4 flex space-x-2">
          <button
            onClick={() => onToggleStatus(book)}
            className="flex items-center justify-center p-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition duration-150 shadow-md"
            title="Toggle Status"
          >
            <Settings size={18} />
          </button>
          <button
            onClick={() => onEdit(book)}
            className="flex items-center justify-center p-2 bg-yellow-500 text-white rounded-full hover:bg-yellow-600 transition duration-150 shadow-md"
            title="Edit Book"
          >
            <Edit size={18} />
          </button>
          <button
            onClick={() => onGetInsights(book)}
            className="flex items-center justify-center p-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition duration-150 shadow-md"
            title="Get Book Insights (AI)"
          >
            <Zap size={18} />
          </button>
          <button
            onClick={() => onDelete(book)}
            className="flex items-center justify-center p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition duration-150 shadow-md"
            title="Delete Book"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookCard;

