'use client';

import { ReactNode, useCallback, useEffect, useState } from 'react';
import { AuthContext } from './auth-context';
import {
    AuthContextValue,
    LoginCredentials,
    RegisterCredentials,
    User,
} from '../types';
import * as authApi from '../api';

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
            console.error('Failed to refresh session', error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        refreshUser();
    }, [refreshUser]);

    const login = useCallback(async (credentials: LoginCredentials) => {
        setIsLoading(true);
        try {
            const response = await authApi.login(credentials);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const register = useCallback(async (credentials: RegisterCredentials) => {
        setIsLoading(true);
        try {
            const response = await authApi.register(credentials);
            setUser(response.user);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const logout = useCallback(async () => {
        setIsLoading(true);
        try {
            await authApi.logout();
        } finally {
            setUser(null);
            setIsLoading(false);
        }
    }, []);

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
