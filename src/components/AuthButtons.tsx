import React from 'react';
import { Lock, User } from 'lucide-react';

const AuthButtons: React.FC = () => {
  return (
    <div className="space-y-6">
      <button className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md group focus:ring-2 focus:ring-blue-300 focus:outline-none">
        <User className="mr-3 group-hover:animate-bounce" />
        Create Account
      </button>

      {/* Divider */}
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white px-4 text-gray-500 text-sm">or</span>
        </div>
      </div>

      <button className="w-full flex items-center justify-center px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-100 transition-all shadow-md group focus:ring-2 focus:ring-gray-300 focus:outline-none">
        <Lock className="mr-3 group-hover:animate-pulse" />
        Sign In
      </button>
    </div>
  );
};

export default AuthButtons;
