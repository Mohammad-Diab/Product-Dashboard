'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { toast } from 'sonner';
import { AuthContext } from './auth-context';
import {
    AuthContextValue,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '../types';
import * as authApi from '../api';
import { ROUTES, isAuthRoute } from '@/lib/routes';

type AuthProviderProps = {
    children: ReactNode;
};

function getStatusCode(error: unknown): number | null {
    if (typeof error !== 'object' || !error) return null;
    if ('statusCode' in error && typeof (error as any).statusCode === 'number') {
        return (error as any).statusCode;
    }
    return null;
}

export function AuthProvider({ children }: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    const isAuthenticated = !!user;

    const refreshUser = useCallback(async () => {
        try {
            setIsLoading(true);
            const currentUser = await authApi.getCurrentUser();
            setUser(currentUser);
        } catch (error: any) {
            const status = getStatusCode(error);
            if (status === 401) {
                setUser(null);
                return;
            }
            // Silent fail on refresh - don't show toast
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        // Skip user refresh on auth pages (login/register)
        if (isAuthRoute(pathname)) {
            setIsLoading(false);
            return;
        }
        refreshUser();
    }, [refreshUser, pathname]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(credentials);
            setUser(response.user);
            toast.success('Welcome back! You have successfully logged in.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            const response = await authApi.register(credentials);
            setUser(response.user);
            toast.success('Account created successfully! Welcome aboard.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authApi.logout();
            setUser(null);
            toast.success('You have been logged out successfully.');
            router.push(ROUTES.AUTH.LOGIN);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    const value: AuthContextValue = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshUser,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
