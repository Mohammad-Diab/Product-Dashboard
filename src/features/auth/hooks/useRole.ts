import { useAuth } from './use-auth';

export function useRole() {
  const { user } = useAuth();
  
  const isAdmin = user?.role === 'admin';
  const role = user?.role;

  return { isAdmin, role };
}
