import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, isMobile }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Calculate width based on state
  const width = isOpen 
    ? (isMobile ? '14rem' : '16rem') 
    : '4rem';
  
  // On mobile, hide sidebar when closed
  const display = isMobile && !isOpen ? 'translateX(-100%)' : 'translateX(0)';
  
  // Handle navigation and collapse sidebar on mobile
  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      toggleSidebar();
    }
  };
  
  return (
    <>
      <div 
        className={`border-r border-gray-800 flex flex-col bg-[#202123] z-30 ${
          isMobile ? 'fixed top-0 bottom-0 overflow-y-auto' : 'h-full fixed'
        }`}
        style={{ 
          width,
          transform: display,
          transition: 'width 0.3s, transform 0.3s'
        }}
      >
        <div className="p-4 flex justify-end">
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none"
            aria-label="Toggle sidebar"
          >
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        </div>
        
        <nav className="mt-4 overflow-y-auto">
          <ul className="space-y-2">
            <li>
              <button
                onClick={() => handleNavigation('/')}
                className={`w-full flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/' 
                    ? 'bg-[#2a2b32] text-white' 
                    : 'text-gray-300 hover:bg-[#2a2b32] hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
                {isOpen && <span>Chat</span>}
              </button>
            </li>
            <li>
              <button
                onClick={() => handleNavigation('/contact')}
                className={`w-full flex items-center ${isOpen ? 'px-4' : 'justify-center'} py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/contact' 
                    ? 'bg-[#2a2b32] text-white' 
                    : 'text-gray-300 hover:bg-[#2a2b32] hover:text-white'
                }`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${isOpen ? 'mr-3' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {isOpen && <span>Contact</span>}
              </button>
            </li>
          </ul>
        </nav>
      </div>
      
      {/* Overlay to close sidebar when clicked outside on mobile */}
      {isMobile && isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
};

export default Sidebar; 