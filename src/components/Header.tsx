import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-[#202123] sticky top-0 z-10">
      <div className="container-fluid px-4 py-4">
        <div className="text-xl font-medium text-white pl-0">Connor's Assistant</div>
      </div>
    </header>
  );
};

export default Header; 