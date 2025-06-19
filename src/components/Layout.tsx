import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Sidebar from './Sidebar';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if the device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    // Initial check
    checkMobile();
    
    // Set sidebar closed by default on mobile
    if (window.innerWidth < 768) {
      setSidebarOpen(false);
    }
    
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
    : (sidebarOpen ? '16rem' : '4rem');

  return (
    <div className={`flex ${isMobile ? 'min-h-screen' : 'h-screen'} bg-[#202123]`}>
      <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} isMobile={isMobile} />
      
      {/* Main content area with dynamic left padding based on sidebar state */}
      <div 
        className="flex flex-col flex-1 overflow-hidden"
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