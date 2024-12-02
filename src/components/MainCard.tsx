import React from 'react';

interface MainCardProps {
  children: React.ReactNode;
}

const MainCard: React.FC<MainCardProps> = ({ children }) => {
  return (
    <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {children}
    </div>
  );
};

export default MainCard;
