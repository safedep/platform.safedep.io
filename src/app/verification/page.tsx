'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 

const Verification = () => {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => {
            router.push('/api/auth/login');
        }, 60000);
    }, [router]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-blue-50">
            <div className="max-w-lg w-full p-8 bg-white border-2 border-blue-200 rounded-xl shadow-lg">
            <div className="flex flex-col items-center space-y-6">
                <div className="inline-flex items-center space-x-2">
                <span className="px-3 py-1 text-sm text-blue-600 bg-blue-100 rounded-full">
                    Verification Required
                </span>
                </div>
                <h3 className="text-2xl font-bold text-blue-900">
                  Email Verification
                </h3>
                <div className="w-16 h-1 bg-blue-500 rounded"></div>
                <p className="text-center text-gray-600 leading-relaxed">
                Thank you for signing up! Please check your email to verify your account.
                </p>
                <div className="animate-pulse mt-4">
                <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">
                    Redirecting...
                </div>
                </div>
            </div>
            </div>
        </div>
    );
};

export default Verification;