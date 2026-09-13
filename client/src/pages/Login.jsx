import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(180deg, #3a6090 0%, #2a4060 40%, #1a2a40 100%)' }}>

      {/* Pixel art character decorations */}
      <div className="absolute bottom-0 left-1/4 text-6xl opacity-30 cq-float">🧙</div>
      <div className="absolute bottom-0 right-1/4 text-6xl opacity-30 cq-float" style={{ animationDelay: '1s' }}>⚔️</div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        {/* Wooden frame card */}
        <div className="cq-panel-wood">
          {/* Character sprite + arrows */}
          <div className="flex items-center justify-center gap-4 mb-4">
            <button className="text-2xl text-white opacity-50 hover:opacity-100">◀</button>
            <div className="text-5xl cq-float">🧑‍💻</div>
            <button className="text-2xl text-white opacity-50 hover:opacity-100">▶</button>
          </div>

          <h2 className="font-pixel text-sm text-center text-white mb-6"
              style={{ textShadow: '2px 2px 0 #000' }}>
            Welcome Back
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            {/* Username/Email field */}
            <div>
              <input
                type="email"
                placeholder="Username"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="cq-input w-full"
                required
              />
            </div>

            {/* Password field */}
            <div>
              <input
                type="password"
                placeholder="Password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="cq-input w-full"
                required
              />
            </div>

            {/* Remember me */}
            <label className="flex items-center gap-2 text-white cursor-pointer"
                   style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
              <input type="checkbox" checked={remember}
                     onChange={(e) => setRemember(e.target.checked)}
                     className="w-4 h-4" />
              Remember me
            </label>

            {/* Error */}
            {error && (
              <div className="cq-toast-error cq-toast text-sm">
                ❌ {error}
              </div>
            )}

            {/* Login Button */}
            <button type="submit" disabled={loading}
                    className="cq-btn cq-btn-primary w-full justify-center mt-2">
              {loading ? '⏳ Loading...' : '🔑 Login'}
            </button>
          </form>

          {/* Sign up link */}
          <p className="text-center mt-4 text-white"
             style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
            Don't have an account?{' '}
            <Link to="/register" className="underline" style={{ color: '#ffc060' }}>
              Sign Up
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
