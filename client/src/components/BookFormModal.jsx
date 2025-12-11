import React, { useState, useEffect } from 'react';
import { X, Save, Search, Loader } from 'lucide-react';
import api from '../services/api';

const BookFormModal = ({ isOpen, onClose, onSave, editingBook }) => {
  const [formState, setFormState] = useState({
    title: '',
    author: '',
    genre: '',
    status: 'toRead',
    coverUrl: '',
  });

  // Google Books Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  
  useEffect(() => {
    if (editingBook) {
      setFormState({
        title: editingBook.title,
        author: editingBook.author,
        genre: editingBook.genre || '',
        status: editingBook.status,
        coverUrl: editingBook.coverUrl || '',
      });
    } else {
      resetFormAndSearch();
    }
  }, [editingBook, isOpen]);

  const resetFormAndSearch = () => {
    setFormState({ title: '', author: '', genre: '', status: 'toRead', coverUrl: '' });
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSave(formState);
    if (success) {
      onClose();
    } else {
      // User ko error dikhayein
      alert("Failed to save book. Please try again.");
    }
  };

  const handleSearch = async () => {
    if (searchQuery.length < 3) return;
    setIsSearching(true);
    setSearchResults([]);
    try {
      // Humara backend API call karein, jo Google Books ko call karega
      const { data } = await api.get(`/external/gbooks/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchResults(data);
    } catch (error) {
      console.error("Error searching Google Books:", error);
    }
    setIsSearching(false);
  };

  const handleSelectBook = (book) => {
    setFormState({
      title: book.title,
      author: book.author,
      genre: book.genre,
      coverUrl: book.coverUrl,
      status: 'toRead', // Default
    });
    setSearchResults([]);
    setSearchQuery('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg p-6">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          {editingBook ? 'Edit Book Details' : 'Add New Book'}
        </h3>
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition duration-150"
        >
          <X size={24} />
        </button>
        
        {/* Google Books Search Section */}
        {!editingBook && (
          <div className="mb-6 pb-4 border-b">
            <label htmlFor="bookSearch" className="block text-sm font-medium text-gray-700 mb-2">Search for Book (Google Books API)</label>
            <div className="flex space-x-2">
              <input
                type="text"
                id="bookSearch"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title or author..."
                className="flex-grow rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
              />
              <button
                type="button"
                onClick={handleSearch}
                disabled={isSearching || searchQuery.length < 3}
                className="flex-shrink-0 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 disabled:opacity-50 transition duration-150"
              >
                {isSearching ? <Loader size={18} className="animate-spin" /> : <Search size={18} />}
              </button>
            </div>
            {searchResults.length > 0 && (
              <div className="mt-3 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-50">
                {searchResults.map(book => (
                  <div 
                    key={book.id} 
                    onClick={() => handleSelectBook(book)}
                    className="p-2 border-b last:border-b-0 hover:bg-indigo-50 cursor-pointer rounded-md transition duration-150"
                  >
                    <p className="text-sm font-semibold text-gray-800">{book.title}</p>
                    <p className="text-xs text-gray-500 italic">by {book.author}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="title"
              id="title"
              value={formState.title}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="author" className="block text-sm font-medium text-gray-700">Author <span className="text-red-500">*</span></label>
            <input
              type="text"
              name="author"
              id="author"
              value={formState.author}
              onChange={handleInputChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="genre" className="block text-sm font-medium text-gray-700">Genre</label>
            <input
              type="text"
              name="genre"
              id="genre"
              value={formState.genre}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="coverUrl" className="block text-sm font-medium text-gray-700">Cover Image URL</label>
            <input
              type="url"
              name="coverUrl"
              id="coverUrl"
              value={formState.coverUrl}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border"
            />
          </div>
          <div>
            <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status</label>
            <select
              name="status"
              id="status"
              value={formState.status}
              onChange={handleInputChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 p-3 border bg-white"
            >
              <option value="toRead">To Read</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition duration-150"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
              <Save size={18} className="mr-2" />
              {editingBook ? 'Update Book' : 'Add Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookFormModal;

