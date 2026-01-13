export default function NotFound() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-md w-full text-center">
                <div className="bg-white rounded-lg shadow-lg p-8">
                    <div className="mb-6">
                        <h1 className="text-9xl font-bold text-gray-300">404</h1>
                    </div>

                    <h2 className="text-3xl font-bold text-gray-900 mb-4">
                        Page Not Found
                    </h2>

                    <p className="text-gray-600 mb-8">
                        The page you're looking for doesn't exist or has been moved.
                    </p>

                    <div className="space-y-3">
                        <a
                            href="/"
                            className="block w-full px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
                        >
                            Go to Dashboard
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
