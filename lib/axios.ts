import axios from 'axios';

const api = axios.create({
  baseURL: 'https://dummyjson.com', //  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// İstek interceptor'ı
api.interceptors.request.use((config) => {
  // LocalStorage'dan token'ı al
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Yanıt interceptor'ı
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token geçersiz veya süresi dolmuşsa kullanıcıyı çıkış yaptır
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api; 