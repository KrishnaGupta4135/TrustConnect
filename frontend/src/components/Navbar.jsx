import React from 'react';
import { Link , useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';


const Navbar = () => {
  const navigate = useNavigate();

  const handleSignUp = () => {
    navigate('/create');
  };
  const handleSignIn = () => {
    navigate('/login');
  };
    const handleHome = () => {
      navigate('/');
    };

  return (
    <nav className="bg-white shadow-md px-4 py-2 flex items-center justify-between ">
      {/* Logo */}
      
      <div
        className=" flex items-center  text-1.5xl font-bold text-gray-800 cursor-pointer"
        onClick={handleHome}
      >
        <Shield className="h-6 w-6 text-blue-500" />
        Trust Connect
      </div>

      {/* Navigation Buttons */}
      <div className="space-x-1 ">
        <Link to="/create">
          <button 
          className="px-4 py-2 text-gray-800 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
          onClick={handleSignUp}
          >
            Sign Up  
          </button>
        </Link>
        <Link to="/login">
          <button
           className="px-4 py-2 text-white bg-blue-500 rounded-lg hover:bg-blue-600 transition"
           onClick={handleSignIn}>
            Sign In
          </button>
        </Link>
        <div/>  
      </div>
    </nav>
  );
}

export default Navbar;
