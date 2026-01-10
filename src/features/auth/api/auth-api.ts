'use client';

import { apiClient } from '@/lib/api/client';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/api/auth/login', { body: credentials });
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/api/auth/register', { body: credentials });
}

export async function logout(): Promise<void> {
  return apiClient.post<void>('/api/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/api/auth/me');
}
