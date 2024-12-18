import React from 'react';

interface MainCardProps {
  children: React.ReactNode;
  className?: string;
}

const MainCard: React.FC<MainCardProps> = ({ children, className }) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

export default MainCard;