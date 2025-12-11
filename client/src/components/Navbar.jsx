import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, Book, User } from 'lucide-react';
import AuthContext from '../context/AuthContext';

const Navbar = () => {
  const { user } = useContext(AuthContext);

  const getNavLinkClass = ({ isActive }) =>
    `px-3 py-2 text-sm font-medium rounded-md flex items-center ${
      isActive
        ? 'bg-indigo-100 text-indigo-700'
        : 'text-gray-500 hover:bg-gray-100'
    }`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-extrabold text-gray-900 flex items-center">
            <BookOpen className="w-8 h-8 text-indigo-600 mr-2" />
          </h1>
          <nav className="flex space-x-2">
            <NavLink to="/" className={getNavLinkClass}>
              <Book size={16} className="inline mr-1" />
              My Library
            </NavLink>
            <NavLink to="/profile" className={getNavLinkClass}>
              <User size={16} className="inline mr-1" />
              My Profile
            </NavLink>
          </nav>
        </div>
        
        <div className="text-sm font-medium text-gray-600">
           Welcome, {user?.email || 'User'}
        </div>
      </div>
    </header>
  );
};

export default Navbar;

