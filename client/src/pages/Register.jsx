import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Lock, Mail, User } from 'lucide-react';

export default function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  
  const { register, loading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (password !== confirmPassword) {
      setLocalError("Passwords don't match!");
      return;
    }
    const result = await register(username, email, password);
    if (result.success) navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-[#5c3a21]">
      
      {/* ── BACKGROUND WOODEN WALL PATTERN ── */}
      <div className="absolute inset-0 pointer-events-none opacity-50" 
           style={{
             backgroundImage: 'repeating-linear-gradient(90deg, #4a2f1a 0px, #4a2f1a 40px, #3d2615 40px, #3d2615 42px)',
             backgroundSize: '42px 100%'
           }}>
      </div>
      
      {/* ── WALL DECORATIONS ── */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-16 h-20 bg-yellow-600/30 blur-2xl rounded-full"></div>
      <div className="absolute top-12 left-1/2 -translate-x-1/2 text-4xl drop-shadow-[2px_2px_0_#000]">🏮</div>
      <div className="absolute top-16 left-32 text-6xl drop-shadow-[4px_4px_0_#000]">⚔️</div>

      {/* ── CENTER FORM CONTAINER ── */}
      <div className="relative z-10 m-auto w-full max-w-sm pt-20">
        
        {/* PARCHMENT PANEL */}
        <div className="pixel-panel-parchment p-8 flex flex-col items-center">
          
          <h2 className="font-pixel text-2xl text-center mb-8 drop-shadow-[2px_2px_0_#d97706]">
            Create Account
          </h2>

          {(error || localError) && (
            <div className="bg-red-500 text-white p-2 text-sm font-pixel border-2 border-red-900 mb-4 w-full text-center">
              {error || localError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User size={20} className="text-[#78350f]" />
              </div>
              <input 
                type="text" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                className="pixel-input w-full pl-10 bg-white" 
                placeholder="Username" 
                required 
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={20} className="text-[#78350f]" />
              </div>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                className="pixel-input w-full pl-10 bg-white" 
                placeholder="Email Address" 
                required 
              />
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-[#78350f]" />
              </div>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                className="pixel-input w-full pl-10 bg-white" 
                placeholder="Password" 
                required 
              />
            </div>

            <div className="relative pb-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={20} className="text-[#78350f]" />
              </div>
              <input 
                type="password" 
                value={confirmPassword} 
                onChange={e => setConfirmPassword(e.target.value)}
                className="pixel-input w-full pl-10 bg-white" 
                placeholder="Confirm Password" 
                required 
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="pixel-panel-wood pixel-btn w-full py-4 text-white text-lg mt-2"
            >
              {loading ? '...' : 'Sign Up'}
            </button>
            
          </form>

          <div className="mt-8 text-center border-t-4 border-[#d97706] pt-4 w-full">
            <Link to="/login" className="font-pixel text-[10px] text-[#78350f] hover:text-blue-600 transition-colors">
              Already have an account? Login
            </Link>
          </div>

        </div>

      </div>

      {/* ── KNIGHT NPC DECORATION ── */}
      <div className="absolute bottom-10 right-10 text-[80px] drop-shadow-[4px_4px_0_#000] z-20">
        🧙‍♂️
      </div>

    </div>
  );
}
