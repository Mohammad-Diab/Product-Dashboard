'use client';

import { useAuth } from '@/features/auth/hooks/use-auth';

export function LogoutButton() {
  const { logout, user } = useAuth();

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm text-gray-700">Welcome {user?.name}</span>
      <button
        onClick={() => logout()}
        className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
      >
        Logout
      </button>
    </div>
  );
}
