import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Calculate sidebar width based on state
  const sidebarWidth = isMobile 
    ? '0' // No margin on mobile, sidebar will overlay
    : (sidebarOpen ? '14rem' : '4rem');

  return (
    <div className="flex h-screen bg-[#202123] overflow-hidden">
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      {/* Main content area with dynamic left padding based on sidebar state */}
      <div 
        className="flex flex-col flex-1"
        style={{ 
          marginLeft: sidebarWidth,
          width: isMobile ? '100%' : `calc(100% - ${sidebarWidth})`,
          transition: 'margin-left 0.3s, width 0.3s'
        }}
      >
        <Header sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout; 