"use client";

import { createContext, useContext, useState, useEffect } from 'react';
import { IUser } from '@/types/types';
import api from '@/lib/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';




interface AuthContextType {
  user: IUser | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  error: string | null;
  accessToken: string | null;
  refreshToken: string | null;
  refreshAccessToken: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    setAccessToken(Cookies.get('accessToken') || null);
    setRefreshToken(Cookies.get('refreshToken') || null);
  }, []);
  // Sadece gerekli kullanıcı bilgilerini saklayacak yardımcı fonksiyon
  const saveUserToStorage = (userData: IUser) => {
    const basicUserInfo = {
      id: userData.id,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      image: userData.image
    };
    localStorage.setItem('userInfo', JSON.stringify(basicUserInfo));
  };

  useEffect(() => {
    // Sadece basic user bilgisini kontrol et
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/auth/login', { username, password });
      const userData: IUser = response.data;
      
      // Sadece gerekli kullanıcı bilgilerini localStorage'a kaydet
      saveUserToStorage(userData);
      setUser(userData);

      // Token'ları HttpOnly cookie olarak kaydet
      // Bu kısım backend tarafında yapılmalı, ama örnek olarak:
      Cookies.set('accessToken', userData.accessToken, {
        secure: true,
        sameSite: 'strict',
        expires: 1 // 1 gün
      });
      setAccessToken(userData.accessToken);
      
      Cookies.set('refreshToken', userData.refreshToken, {
        secure: true,
        sameSite: 'strict',
        expires: 7 // 7 gün
      });
      setRefreshToken(userData.refreshToken);

      // Başarılı login sonrası yönlendirme
      router.push('/'); // veya istediğiniz protected route

    } catch (err: any) {
      setError(err.response?.data?.message || 'Giriş yapılırken bir hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (email: string, password: string, username: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await api.post('/auth/register', { email, password, username });
      const userData: IUser = response.data;
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      // Access ve Refresh Token'ları kaydet
      if (userData.accessToken) {
        localStorage.setItem('accessToken', userData.accessToken);
      }
      if (userData.refreshToken) {
        localStorage.setItem('refreshToken', userData.refreshToken);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Kayıt olurken bir hata oluştu');
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    localStorage.removeItem('userInfo');
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    router.push('/auth/login');
  };

  const refreshAccessToken = async () => {
    try {
      const response = await api.post('/auth/refresh', {}, {
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      });

      const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data;

      // Yeni token'ları güncelle
      setAccessToken(newAccessToken);
      
      // Cookie'leri güncelle
      Cookies.set('accessToken', newAccessToken, {
        secure: true,
        sameSite: 'strict',
        expires: 1 // 1 gün
      });
      
      if (newRefreshToken) {
        setRefreshToken(newRefreshToken);
        Cookies.set('refreshToken', newRefreshToken, {
          secure: true,
          sameSite: 'strict',
          expires: 7 // 7 gün
        });
      }

      return newAccessToken;
    } catch (error) {
      console.error('Token yenileme hatası:', error);
      // Hata durumunda kullanıcıyı çıkış yaptır
      logout();
      throw error;
    }
  };

  // Axios interceptor ekleyelim
  useEffect(() => {
    // Response interceptor
    const interceptor = api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;

        // Eğer 401 hatası alındıysa ve bu ilk denememizse
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          try {
            // Access token'ı yenile
            const newAccessToken = await refreshAccessToken();
            
            // Yeni token ile original isteği tekrarla
            originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            return api(originalRequest);
          } catch (refreshError) {
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );

    // Cleanup
    return () => {
      api.interceptors.response.eject(interceptor);
    };
  }, [refreshToken]);

  const value = {
    user,
    login,
    register,
    logout,
    isLoading,
    error,
    accessToken,
    refreshToken,
    refreshAccessToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
