import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleSignInButton = () => {
  const handleClick = () => {
    // Redirect to backend Google OAuth endpoint
    const backendUrl = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';
    window.location.href = `${backendUrl}/auth/google`;
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className="w-full flex items-center justify-center gap-3 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-400 dark:hover:border-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 font-medium shadow-sm hover:shadow-md group"
    >
      <FcGoogle className="w-5 h-5 group-hover:scale-110 transition-transform" />
      <span>Continue with Google</span>
    </button>
  );
};

export default GoogleSignInButton;
