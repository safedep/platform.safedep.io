'use client'

import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'

function AuthErrorComponent() {
    const searchParams = useSearchParams()
    const errorMessage = searchParams?.get('message') || 'An unknown error occurred'

    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full p-6 bg-white rounded-2xl shadow-2xl border border-blue-500">
                <div className="text-center">
                    <h1 className="text-black text-4xl font-extrabold mb-4">Authentication Error</h1>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
                        <p className="text-black">{decodeURIComponent(errorMessage)}</p>
                    </div>
                    <Link
                        href="/api/auth/login"
                        className="inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-full transition-colors"
                    >
                        Return to Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}

export default function AuthError() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AuthErrorComponent />
        </Suspense>
    )
}
