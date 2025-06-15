import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const location = useLocation();

  return (
    <header className="bg-gray-900 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div className="text-xl font-bold text-white">Connor's Assistant</div>
          
          <nav>
            <ul className="flex space-x-4">
              <li>
                <Link
                  to="/"
                  className={`text-sm font-medium px-3 py-2 rounded-md ${
                    location.pathname === '/' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Chat
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className={`text-sm font-medium px-3 py-2 rounded-md ${
                    location.pathname === '/contact' 
                      ? 'bg-gray-800 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                >
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 