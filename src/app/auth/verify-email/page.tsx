"use client";

import { Mail, ArrowRight } from "lucide-react";

export default function Page() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-6">
        <div className="text-center space-y-6">
          {/* Icon */}
          <div className="mx-auto w-16 h-16 rounded-full flex items-center justify-center bg-gray-100">
            <Mail className="w-8 h-8" />
          </div>

          {/* Title and Description */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight">
              Verify your email
            </h2>
            <p className="text-sm text-gray-600">
              We have sent a verification link to the email address you
              provided. Please check your inbox to proceed.
            </p>
          </div>

          {/* Steps */}
          <div className="space-y-4 py-4">
            {[
              "Open your email inbox",
              "Click the verification link we sent you",
              "Return here to continue",
            ].map((text, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 text-left"
              >
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                  <span className="font-semibold">{index + 1}</span>
                </div>
                <p className="text-sm text-gray-600">{text}</p>
              </div>
            ))}
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Already verified?
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <button
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors flex items-center justify-center group"
              onClick={() => {
                window.location.href = "/api/auth/login";
              }}
            >
              Continue to Login
              <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              className="w-full border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors"
              onClick={() => (window.location.href = "/")}
            >
              Return to Home
            </button>
          </div>

          {/* Help text */}
          <p className="text-xs text-gray-500">
            Didnt receive the email? Check your spam folder or try to login
            again to resend the verification email.
          </p>
        </div>
      </div>
    </div>
  );
}
