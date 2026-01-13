'use client';

import { useEffect } from 'react';
import Link from 'next/link';

type ErrorProps = {
    error: Error & { digest?: string };
    reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error('Application error:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <svg
                            className="mx-auto h-16 w-16 text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        Oops! Something went wrong
                    </h1>

                    <p className="text-gray-600 mb-2">
                        We encountered an unexpected error.
                    </p>

                    {process.env.NODE_ENV === 'development' && (
                        <div className="mt-4 p-4 bg-red-50 rounded-md text-left">
                            <p className="text-sm text-red-800 font-mono break-all">
                                {error.message}
                            </p>
                        </div>
                    )}

                    <div className="mt-8 space-y-3">
                        <Link
                            href="/"
                            className="block w-full px-6 py-3 bg-white text-gray-700 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors font-medium"
                        >
                            Go to Dashboard
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
