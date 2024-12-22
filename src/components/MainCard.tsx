import React from "react";

interface MainCardProps {
  children: React.ReactNode;
}
const MainCard: React.FC<MainCardProps> = ({ children }) => {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-full max-w-2xl mx-auto p-8">{children}</div>
    </div>
  );
};

export default MainCard;
