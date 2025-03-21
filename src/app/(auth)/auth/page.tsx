import React from "react";
import Badge from "@/components/Badge";
import TermsAndPrivacy from "@/components/TermsAndPrivacy";
import MainCard from "@/components/MainCard";
import { CheckCircle, Shield } from "lucide-react";
import AuthButtons from "./components/AuthButtons";
import Image from "next/image";

export default function AuthPage() {
  return (
    <div className="flex min-h-svh flex-col lg:flex-row bg-gray-100 justify-center">
      <div className="w-full bg-[#f8f8f8] flex content-center items-center border-l-rounded justify-center p-4 sm:p-6 lg:p-8">
        <MainCard>
          <div className="w-full max-w-md space-y-4 lg:space-y-6 mx-auto border border-gray-300 rounded-xl p-10 shadow-lg shadow-blue-600/50">
            <div className="flex justify-center mb-6">
              <Image
                src="/Logo.svg"
                alt="SafeDep Logo"
                width={128}
                height={128}
              />
            </div>
            <div className="flex items-center justify-center space-x-2 mb-4 lg:mb-6">
              <Badge
                icon={CheckCircle}
                text="Secure"
                bgColor="bg-green-100"
                textColor="text-green-600"
              />
              <Badge
                icon={Shield}
                text="Verified"
                bgColor="bg-blue-100"
                textColor="text-blue-600"
              />
            </div>

            <div className="text-center">
              <h1 className="text-xl sm:text-2xl font-bold text-black mb-3 lg:mb-4">
                Welcome to SafeDep
              </h1>
              <p className="text-black mb-6 lg:mb-8 text-sm sm:text-base">
                Get access to SafeDep Cloud APIs to integrate open-source
                component analysis and risk assessment into your CI/CD pipeline
                or custom workflow.
              </p>
            </div>

            <AuthButtons />

            <TermsAndPrivacy />
          </div>
        </MainCard>
      </div>
    </div>
  );
}
