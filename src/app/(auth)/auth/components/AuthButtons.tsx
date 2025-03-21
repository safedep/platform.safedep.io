import React from "react";
import { User, Lock } from "lucide-react";

function AuthButtons() {
  return (
    <div className="space-y-6">
      <a
        href="/auth/login?screen_hint=signup"
        className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md group focus:ring-2 focus:ring-blue-300 focus:outline-none"
      >
        <User className="mr-3 group-hover:animate-bounce" />
        Create Account
      </a>

      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center">
          <span className="bg-white rounded-2xl  px-4 text-gray-500 text-sm">
            or
          </span>
        </div>
      </div>

      <a
        href="/auth/login"
        className="w-full flex items-center justify-center bg-white px-6 py-3 bg-white-50 text-black-600 rounded-xl hover:bg-gray-100 transition-all shadow-md group focus:ring-2 focus:ring-gray-300 focus:outline-none"
      >
        <Lock className="mr-3 group-hover:animate-pulse" />
        Login
      </a>
    </div>
  );
}

export default AuthButtons;
