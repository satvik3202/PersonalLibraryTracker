import React, { useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { LogOut } from 'lucide-react';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);

  // User email ko context se lein
  const userEmail = user ? user.email : 'Loading...';

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <h2 className="text-3xl font-extrabold text-gray-900 mb-4">My Profile</h2>
      <p className="text-lg text-gray-600 mb-8">
        Signed in as: <strong className="text-indigo-600">{userEmail}</strong>
      </p>
      
      <button
        onClick={logout}
        className="inline-flex items-center px-4 py-2 border border-red-500 text-sm font-medium rounded-full shadow-sm text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition duration-150"
      >
        <LogOut size={20} className="mr-2" />
        Sign Out
      </button>
    </div>
  );
};

export default Profile;

