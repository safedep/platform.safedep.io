import React from 'react';

const Divider: React.FC = () => {
  return (
    <div className="relative my-4">
      <div className="absolute inset-0 flex items-center">
        <div className="w-full border-t border-gray-300"></div>
      </div>
      <div className="relative flex justify-center">
        <span className="bg-white px-4 text-gray-500 text-sm">or</span>
      </div>
    </div>
  );
};

export default Divider;
