import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('cyberlock_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('cyberlock_token');
      // Only force-redirect if the user has no token (genuinely not logged in)
      // If there's a token, let AuthContext handle the error — don't force a redirect
      // This prevents a bad server response from kicking out a logged-in user
      if (!token) {
        if (
          window.location.pathname !== '/login' &&
          window.location.pathname !== '/register' &&
          window.location.pathname !== '/' &&
          window.location.pathname !== '/demo'
        ) {
          window.location.href = '/login';
        }
      }
    }
    return Promise.reject(error);
  }
);

export default api;
