import React from 'react';
import Badge from '../../components/Badge';
import ImagePlaceholder from '../../components/ImagePlaceholder';
import TextSection from '../../components/TextSection';
import AuthButtons from '../../components/AuthButtons';
import TermsAndPrivacy from '../../components/TermsAndPrivacy';
import MainCard from '../../components/MainCard';
import { CheckCircle, Shield } from 'lucide-react';

const Auth = () => {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-white p-8 font-inter">
      <MainCard>
        <div className="p-8 lg:p-12 flex flex-col items-center justify-center bg-gray-50 border-r border-gray-300 relative">
          <div className="absolute top-4 right-4 flex space-x-2">
            <Badge icon={CheckCircle} text="Secure" bgColor="bg-green-100" textColor="text-green-600" />
            <Badge icon={Shield} text="Verified" bgColor="bg-blue-100" textColor="text-blue-600" />
          </div>
          <ImagePlaceholder />
          <TextSection />
        </div>
        <div className="p-8 lg:p-12 flex flex-col justify-center space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Get Started</h1>
            <p className="text-gray-600">Select your preferred authentication method below</p>
          </div>
          <AuthButtons />
          <TermsAndPrivacy />
        </div>
      </MainCard>
    </main>
  );
};

export default Auth;
