import { useCallback } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from '../contexts/AuthContext';

export const useLogout = () => {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = useCallback(() => {
    logout();
    router.push('/auth/login');
  }, [logout, router]);

  return handleLogout;
}; 