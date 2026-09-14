import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gameService } from '../services/gameService';
import { useAuth } from '../hooks/useAuth';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [tab, setTab] = useState('global');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameService.getLeaderboard()
      .then(res => { setLeaders(res.data?.leaderboard || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const medals = ['🥇', '🥈', '🥉'];

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="max-w-lg mx-auto">
        <div className="cq-panel-dark">
          {/* Title */}
          <div className="flex items-center gap-3 mb-4">
            <span className="text-3xl">🏆</span>
            <h1 className="font-pixel text-sm text-white" style={{ textShadow: '2px 2px 0 #000' }}>
              Hall of Defenders
            </h1>
          </div>

          {/* Tabs */}
          <div className="cq-tabs mb-4">
            <button className={`cq-tab ${tab === 'global' ? 'active' : ''}`}
                    onClick={() => setTab('global')}>Global</button>
            <button className={`cq-tab ${tab === 'friends' ? 'active' : ''}`}
                    onClick={() => setTab('friends')}>Friends</button>
          </div>

          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_80px] gap-2 px-2 mb-2">
            <span className="font-pixel text-[7px] text-gray-400">#</span>
            <span className="font-pixel text-[7px] text-gray-400">Player</span>
            <span className="font-pixel text-[7px] text-gray-400 text-right">XP</span>
          </div>

          {/* Rows */}
          {loading ? (
            <div className="text-center py-8">
              <span className="cq-pulse text-2xl">⏳</span>
              <p className="text-gray-400 mt-2" style={{ fontFamily: "'VT323', monospace" }}>Loading...</p>
            </div>
          ) : (
            <div className="flex flex-col gap-1">
              {leaders.map((p, i) => {
                const isMe = user && p.username === user.username;
                return (
                  <motion.div
                    key={p._id || i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`grid grid-cols-[40px_1fr_80px] gap-2 items-center px-2 py-2
                      ${isMe ? 'bg-[rgba(240,160,48,0.15)] border border-[#f0a030]' : 'border border-transparent hover:bg-[rgba(255,255,255,0.03)]'}`}
                  >
                    <span className="text-lg text-center">
                      {i < 3 ? medals[i] : <span className="font-pixel text-[8px] text-gray-400">{i + 1}</span>}
                    </span>
                    <span className="text-white truncate" style={{ fontFamily: "'VT323', monospace", fontSize: '20px' }}>
                      {p.username}
                    </span>
                    <span className="text-right font-pixel text-[9px]" style={{ color: '#ffc060' }}>
                      {p.xp?.toLocaleString() || 0}
                    </span>
                  </motion.div>
                );
              })}

              {leaders.length === 0 && (
                <p className="text-center text-gray-500 py-4" style={{ fontFamily: "'VT323', monospace" }}>
                  No items yet.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
