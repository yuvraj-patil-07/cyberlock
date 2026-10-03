import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { sounds } from '../utils/soundEffects';
import { gameService } from '../services/gameService';

export default function SettingsPage() {
  const navigate = useNavigate();
  const { user, loadUser } = useAuth();
  
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [passwords, setPasswords] = useState({ current: '', newPass: '', confirm: '' });
  const [showConfirm, setShowConfirm] = useState(false);
  
  const handleToggleSound = () => {
    if (sounds && sounds.toggleMute) {
      sounds.toggleMute();
    }
    setSoundEnabled(!soundEnabled);
  };
  
  const handlePasswordChange = (e) => {
    e.preventDefault();
    alert('Change password coming soon!');
    setPasswords({ current: '', newPass: '', confirm: '' });
  };
  
  const handleResetProgress = async () => {
    try {
      if (gameService.resetGame) {
        await gameService.resetGame();
      }
      if (loadUser) {
        await loadUser();
      }
      alert('Progress reset successfully!');
      setShowConfirm(false);
    } catch (error) {
      alert('Error resetting progress.');
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0d1a] text-white p-6 uppercase" style={{ fontFamily: "'Press Start 2P', monospace", imageRendering: 'pixelated' }}>
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 bg-[#1e3a8a] text-[10px] px-4 py-2 border-[4px] border-white hover:bg-[#3b82f6] transition-colors cursor-pointer">
          ◀ Back
        </button>
        
        <h1 className="text-3xl text-cyan-400 mb-8 drop-shadow-[0_0_8px_rgba(6,182,212,0.8)]">Settings</h1>
        
        <div className="space-y-8">
          {/* Sound Settings */}
          <section className="bg-[#15213d] border-[4px] border-[#1e3a8a] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <h2 className="text-lg text-yellow-400 mb-4">Sound Settings</h2>
            <div className="flex items-center gap-4">
              <span className="text-xs text-gray-300">SOUND EFFECTS:</span>
              <button 
                onClick={handleToggleSound}
                className={`px-4 py-2 border-[4px] text-[10px] transition-colors cursor-pointer ${soundEnabled ? 'bg-green-600 border-green-400' : 'bg-red-600 border-red-400'}`}
              >
                {soundEnabled ? 'ON 🔊' : 'OFF 🔇'}
              </button>
            </div>
          </section>

          {/* Account Info */}
          <section className="bg-[#15213d] border-[4px] border-[#1e3a8a] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <h2 className="text-lg text-purple-400 mb-4">Account Info</h2>
            <div className="space-y-4 text-xs">
              <div className="flex gap-4">
                <span className="text-gray-400 w-28">USERNAME:</span>
                <span className="text-cyan-300">{user?.username || 'GUEST'}</span>
              </div>
              <div className="flex gap-4">
                <span className="text-gray-400 w-28">EMAIL:</span>
                <span className="text-cyan-300">{user?.email || 'N/A'}</span>
              </div>
            </div>
          </section>
          
          {/* Change Password */}
          <section className="bg-[#15213d] border-[4px] border-[#1e3a8a] p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <h2 className="text-lg text-blue-400 mb-4">Security</h2>
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-sm">
              <input 
                type="password" 
                placeholder="Current Password" 
                value={passwords.current}
                onChange={e => setPasswords({...passwords, current: e.target.value})}
                className="w-full bg-[#0a0d1a] border-[4px] border-[#1e3a8a] p-3 text-[10px] focus:border-cyan-400 outline-none text-white"
              />
              <input 
                type="password" 
                placeholder="New Password" 
                value={passwords.newPass}
                onChange={e => setPasswords({...passwords, newPass: e.target.value})}
                className="w-full bg-[#0a0d1a] border-[4px] border-[#1e3a8a] p-3 text-[10px] focus:border-cyan-400 outline-none text-white"
              />
              <input 
                type="password" 
                placeholder="Confirm New Password" 
                value={passwords.confirm}
                onChange={e => setPasswords({...passwords, confirm: e.target.value})}
                className="w-full bg-[#0a0d1a] border-[4px] border-[#1e3a8a] p-3 text-[10px] focus:border-cyan-400 outline-none text-white"
              />
              <button type="submit" className="bg-blue-600 border-[4px] border-blue-400 px-4 py-3 text-[10px] hover:bg-blue-500 w-full cursor-pointer">
                Update Password
              </button>
            </form>
          </section>

          {/* Danger Zone */}
          <section className="bg-red-900/20 border-[4px] border-red-900 p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
            <h2 className="text-lg text-red-500 mb-4">Danger Zone</h2>
            <p className="text-[10px] text-gray-400 mb-4 leading-relaxed normal-case">
              Resetting your game progress will remove all your earned badges, coins, and completed rooms. This action cannot be undone!
            </p>
            <button 
              onClick={() => setShowConfirm(true)}
              className="bg-red-600 border-[4px] border-red-400 px-4 py-3 text-[10px] hover:bg-red-500 cursor-pointer"
            >
              Reset Progress
            </button>
          </section>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-[#15213d] border-[4px] border-red-500 p-6 max-w-md w-full shadow-[0_0_20px_rgba(239,68,68,0.5)]"
          >
            <h3 className="text-xl text-red-500 mb-4 text-center">Are you sure?</h3>
            <p className="text-[10px] text-gray-300 mb-6 text-center leading-relaxed normal-case">
              All progress will be lost forever.
            </p>
            <div className="flex justify-center gap-4">
              <button onClick={() => setShowConfirm(false)} className="bg-gray-600 border-[4px] border-gray-400 px-4 py-3 text-[10px] hover:bg-gray-500 cursor-pointer">
                Cancel
              </button>
              <button onClick={handleResetProgress} className="bg-red-600 border-[4px] border-red-400 px-4 py-3 text-[10px] hover:bg-red-500 cursor-pointer">
                Confirm Reset
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
