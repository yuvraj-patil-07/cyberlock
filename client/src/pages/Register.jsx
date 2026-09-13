import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';

const COMPANIONS = [
  { id: 'knight', emoji: '🛡️', name: 'Knight' },
  { id: 'wizard', emoji: '🧙', name: 'Wizard' },
  { id: 'robot', emoji: '🤖', name: 'Robot' },
  { id: 'owl', emoji: '🦉', name: 'Owl' },
];

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', password: '', confirmPassword: '' });
  const [companion, setCompanion] = useState('knight');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }
    setLoading(true);
    try {
      await register(form.username, form.email, form.password);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
         style={{ background: 'linear-gradient(180deg, #3a6090 0%, #2a4060 40%, #1a2a40 100%)' }}>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <div className="cq-panel-wood">
          <h2 className="font-pixel text-sm text-center text-white mb-5"
              style={{ textShadow: '2px 2px 0 #000' }}>
            Create Your Account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <input type="text" placeholder="Username"
                   value={form.username}
                   onChange={(e) => setForm({ ...form, username: e.target.value })}
                   className="cq-input w-full" required />

            <input type="email" placeholder="Email"
                   value={form.email}
                   onChange={(e) => setForm({ ...form, email: e.target.value })}
                   className="cq-input w-full" required />

            <input type="password" placeholder="Password"
                   value={form.password}
                   onChange={(e) => setForm({ ...form, password: e.target.value })}
                   className="cq-input w-full" required />

            <input type="password" placeholder="Confirm Password"
                   value={form.confirmPassword}
                   onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                   className="cq-input w-full" required />

            {/* Choose Your Companion */}
            <div className="mt-2">
              <p className="text-center text-white mb-2"
                 style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
                Choose Your Companion
              </p>
              <div className="flex justify-center gap-3">
                {COMPANIONS.map((c) => (
                  <button key={c.id} type="button"
                          onClick={() => setCompanion(c.id)}
                          className={`w-12 h-12 flex items-center justify-center text-2xl border-3 transition-all
                            ${companion === c.id
                              ? 'border-[#ffc060] bg-[rgba(240,160,48,0.3)] scale-110'
                              : 'border-[#5c3a21] bg-[rgba(0,0,0,0.2)] hover:border-[#c29255]'}`}
                          style={{ border: `3px solid ${companion === c.id ? '#ffc060' : '#5c3a21'}` }}>
                    {c.emoji}
                  </button>
                ))}
              </div>
            </div>

            {error && (
              <div className="cq-toast-error cq-toast text-sm">
                ❌ {error}
              </div>
            )}

            <button type="submit" disabled={loading}
                    className="cq-btn cq-btn-success w-full justify-center mt-2">
              {loading ? '⏳ Creating...' : '✨ Create Account'}
            </button>
          </form>

          <p className="text-center mt-4 text-white"
             style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
            Already have an account?{' '}
            <Link to="/login" className="underline" style={{ color: '#ffc060' }}>
              Login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
