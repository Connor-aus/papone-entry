import React from 'react';

interface HeaderProps {
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  isMobile: boolean;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, toggleSidebar, isMobile }) => {
  return (
    <header className="bg-[#202123] sticky top-0 z-10 border-b border-gray-800">
      <div className="px-4 py-4 flex items-center">
        {isMobile && (
          <button 
            onClick={toggleSidebar}
            className="text-gray-400 hover:text-white focus:outline-none mr-4 flex-shrink-0"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
              </svg>
            )}
          </button>
        )}
        <div className="text-xl font-medium text-white truncate">Connor's Assistant</div>
      </div>
    </header>
  );
};

export default Header; 