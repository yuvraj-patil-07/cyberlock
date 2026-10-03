import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  timeout: 15000, // 15s timeout — prevents hanging on cold Vercel starts
  headers: {
    'Content-Type': 'application/json',
  },
});

// ── REQUEST: attach JWT token from localStorage ──────────────────────
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

// ── RESPONSE: handle 401 gracefully ──────────────────────────────────
// Strategy:
//   - If we have NO token in localStorage and get a 401, it means we
//     genuinely aren't logged in. Redirect to /login.
//   - If we DO have a token and get a 401, we let AuthContext's loadUser
//     handle the cleanup. We do NOT redirect here, as this would kick
//     logged-in users out due to a single transient server error.
//   - On network errors (no response), we reject but do NOT clear session.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      const token = localStorage.getItem('cyberlock_token');
      if (!token) {
        // Not logged in at all — redirect to login if on a protected page
        const publicPaths = ['/', '/login', '/register', '/demo'];
        if (!publicPaths.includes(window.location.pathname)) {
          window.location.href = '/login';
        }
      }
      // If we have a token, do NOT redirect — AuthContext will handle it
      // on the next loadUser call or the user can manually refresh.
    }
    return Promise.reject(error);
  }
);

export default api;
