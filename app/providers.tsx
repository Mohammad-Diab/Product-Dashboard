'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/features/auth/context/auth-provider';

type ProvidersProps = {
  children: ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  return <AuthProvider>{children}</AuthProvider>;
}
