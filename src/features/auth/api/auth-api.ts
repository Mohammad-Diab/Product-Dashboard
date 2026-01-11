'use client';

import { apiClient } from '@/lib/api/client';
import {
  AuthResponse,
  LoginCredentials,
  RegisterCredentials,
  User,
} from '../types';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/login', { body: credentials });
}

export async function register(credentials: RegisterCredentials): Promise<AuthResponse> {
  return apiClient.post<AuthResponse>('/auth/register', { body: credentials });
}

export async function logout(): Promise<void> {
  return apiClient.post<void>('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  return apiClient.get<User>('/auth/me');
}
