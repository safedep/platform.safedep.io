import React from 'react';
import Badge from '../../components/Badge';
import TermsAndPrivacy from '../../components/TermsAndPrivacy';
import MainCard from '../../components/MainCard';
import { CheckCircle, Shield } from 'lucide-react';
import ImageSection from "./components/ImageSection";
import TextSection from "./components/TextSection";
import AuthButtons from './components/AuthButtons';
const Auth = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 font-inter">
      <MainCard>
        <div className="p-8 lg:p-12 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-300 relative">
          <div className="flex space-x-2 items-center pb-4">
            <Badge icon={CheckCircle} text="Secure" bgColor="bg-green-100" textColor="text-green-600" />
            <Badge icon={Shield} text="Verified" bgColor="bg-blue-100" textColor="text-blue-600" />
          </div>
          <ImageSection />
          <TextSection />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Register for SafeDep Cloud to get API access.</p>
          </div>
          <AuthButtons />
          <TermsAndPrivacy />
        </div>
      </MainCard>
    </main>
  );
};

export default Auth;
