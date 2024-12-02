import React from 'react';
import { Lock, User, CheckCircle, Shield } from 'lucide-react';

const SecureAuthenticationUI = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 font-inter">
      <div className="w-full max-w-5xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-200 grid grid-cols-1 md:grid-cols-2 overflow-hidden">
        {/* Left Section */}
        <div className="p-8 lg:p-12 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-300 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs flex items-center shadow-sm">
              <CheckCircle size={16} className="mr-1" /> Secure
            </span>
            <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-xs flex items-center shadow-sm">
              <Shield size={16} className="mr-1" /> Verified
            </span>
          </div>

          {/* Placeholder Image */}
          <div className="w-full bg-gradient-to-r from-blue-500 to-blue-700 max-w-lg aspect-video mb-6 overflow-hidden rounded-2xl shadow-lg">
            {/* Replace with actual image */}
            {/* <img src="/your-image-url" alt="Authentication" className="object-cover w-full h-full transition-transform duration-300 hover:scale-105" /> */}
          </div>

          {/* Text Section */}
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">Welcome to SafeDep</h2>
            <p className="text-gray-600 text-sm leading-relaxed max-w-sm mx-auto">
              A secure, reliable, and user-friendly platform for all your needs. Experience seamless authentication with confidence.
            </p>
          </div>
        </div>

        {/* Right Section */}
        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Select your preferred authentication method below</p>
          </div>

          {/* Buttons */}
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

          {/* Terms & Privacy */}
          <p className="text-xs text-gray-500 text-center mt-4">
            By continuing, you agree to our{' '}
            <a href="#" className="text-blue-600 hover:underline focus:underline">Terms of Service</a>{' '}
            and{' '}
            <a href="#" className="text-blue-600 hover:underline focus:underline">Privacy Policy</a>.
          </p>
        </div>
      </div>
    </main>
  );
};

export default SecureAuthenticationUI;
