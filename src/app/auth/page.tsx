import React from 'react';
import Badge from '../../components/Badge';
import TermsAndPrivacy from '../../components/TermsAndPrivacy';
import MainCard from '../../components/MainCard';
import { CheckCircle, Shield } from 'lucide-react';
import ImageSection from "./components/ImageSection";
import TextSection from "./components/TextSection";
import AuthButtons from './components/AuthButtons';
import Image from 'next/image';

const Auth = () => {
  return (
    <main className="flex items-center justify-center min-h-screen px-4 py-8 bg-gradient-to-br from-blue-100 to-white font-inter">
      <MainCard className="flex flex-col md:flex-row w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col items-center justify-center bg-gray-50 border-b md:border-b-0 md:border-r border-gray-200">
        <div className="flex items-center space-x-2 mb-4 sm:mb-6">
        <Badge icon={CheckCircle} text="Secure" bgColor="bg-green-100" textColor="text-green-600" />
        <Badge icon={Shield} text="Verified" bgColor="bg-blue-100" textColor="text-blue-600" />
        </div>
        <ImageSection />
        <TextSection />
      </div>
      <div className="p-4 sm:p-6 lg:p-8 flex-1 flex flex-col justify-center space-y-4 sm:space-y-6">
        <div>
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-900 text-left leading-tight">
          Get Started
          <br />
          <span className="inline-flex items-center">
            With <Image src="/safedepsign.svg" alt="SafeDep Logo" width={20} height={20} className="w-16 sm:w-20 h-6 sm:h-8 object-contain ml-2" />
          </span>
          </h1>
        </div>
        <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
          Register for SafeDep Cloud to get API access.
        </p>
        </div>
        <AuthButtons />
        <TermsAndPrivacy />
      </div>
      </MainCard>
    </main>
  );
};

export default Auth;
