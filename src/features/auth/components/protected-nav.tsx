'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';
import { Button } from '@/components';

export function ProtectedNav() {
    const { user, isLoading, logout } = useAuth();

    if (isLoading) {
        return <div className="h-8 w-40 rounded bg-gray-200 animate-pulse" />;
    }
debugger
    return (
        <div className="flex items-center gap-4">
            {user && <span className="text-sm text-gray-600">Welcome, {user.name}</span>}
            <Button variant="secondary" size="sm" onClick={logout}>
                Logout
            </Button>
        </div>
    );
}
