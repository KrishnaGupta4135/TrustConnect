import React from 'react';
import { Link } from 'react-router-dom';
import Create from '../pages/Create';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
      {/* Logo */}
      <div className="text-2xl font-bold text-gray-800">MyLogo</div>

      {/* Navigation Buttons */}
      <div className="space-x-4">
        <Link to="/create">
          <button className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition">
            Sign 
          </button>
        </Link>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Sign Up
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
