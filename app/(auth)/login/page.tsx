import Link from 'next/link';
import { LoginForm } from '@/features/auth/components';

export default function LoginPage() {
    return (
        <div className="space-y-6">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
                <p className="mt-2 text-sm text-gray-600">
                    Sign in to your account to continue
                </p>
            </div>

            <LoginForm />

            <div className="text-center text-sm">
                <span className="text-gray-600">Don't have an account? </span>
                <Link
                    href="/register"
                    className="font-medium text-blue-600 hover:text-blue-500"
                >
                    Sign up
                </Link>
            </div>
        </div>
    );
}
