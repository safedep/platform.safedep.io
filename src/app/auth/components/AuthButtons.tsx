import React from 'react';
import Link from 'next/link';
import {  User } from 'lucide-react';

const AuthButtons: React.FC = () => {
  return (
    <div className="space-y-6">
      <Link
        href="/api/auth/login"
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md group focus:ring-2 focus:ring-blue-300 focus:outline-none"
      >
        <User className="mr-3 group-hover:animate-bounce" />
        Create Account / Login
      </Link>
    </div>
  );
};

export default AuthButtons;