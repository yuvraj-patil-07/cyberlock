import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { gameService } from '../services/gameService';
import { useAuth } from '../hooks/useAuth';

const CATEGORIES = [
  { key: 'top-score',      label: '⚡ XP',          desc: 'Total Experience Points' },
  { key: 'cyber-sentinel', label: '🛡️ Cyber',       desc: 'Cyber Security Score' },
  { key: 'most-improved',  label: '📈 Improved',    desc: 'Most Improved Player' },
];

const MEDALS = ['🥇', '🥈', '🥉'];

function getRankColor(i) {
  if (i === 0) return '#ffd700';
  if (i === 1) return '#c0c0c0';
  if (i === 2) return '#cd7f32';
  return '#8ba3c0';
}

function getScoreForCategory(entry, cat) {
  switch (cat) {
    case 'cyber-sentinel': return entry.cyberScore ?? 0;
    case 'most-improved':  return (entry.improvementPct ?? 0) > 0 ? `+${entry.improvementPct}%` : `${entry.improvementPct ?? 0}%`;
    default:               return (entry.totalScore ?? 0).toLocaleString();
  }
}

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [leaders, setLeaders] = useState([]);
  const [category, setCategory] = useState('top-score');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLeaderboard = useCallback(async (cat) => {
    setLoading(true);
    setError(null);
    try {
      const res = await gameService.getLeaderboard(cat);
      setLeaders(res.data?.leaderboard || []);
    } catch (err) {
      setError('Could not load leaderboard. Please try again.');
      setLeaders([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLeaderboard(category);
  }, [category, fetchLeaderboard]);

  // Find current user's rank
  const myEntry = user ? leaders.find(p => p.username === user.username) : null;
  const myRank = myEntry ? leaders.indexOf(myEntry) + 1 : null;

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="max-w-lg mx-auto">
        <div className="cq-panel-dark">

          {/* Title */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🏆</span>
              <div>
                <h1 className="font-pixel text-sm text-white" style={{ textShadow: '2px 2px 0 #000' }}>
                  Hall of Defenders
                </h1>
                <p className="font-pixel text-[7px] text-gray-400 mt-1">Top Cyber Warriors</p>
              </div>
            </div>
            <button
              onClick={() => fetchLeaderboard(category)}
              className="font-pixel text-[7px] text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-2 py-1 transition-colors"
              title="Refresh"
            >
              🔄 Refresh
            </button>
          </div>

          {/* My Rank Banner */}
          {myEntry && (
            <div className="mb-4 p-3 border border-[#f0a030] bg-[rgba(240,160,48,0.1)] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-pixel text-[8px] text-[#f0a030]">YOUR RANK</span>
                <span className="font-pixel text-lg text-white" style={{ textShadow: '2px 2px 0 #000' }}>
                  #{myRank}
                </span>
              </div>
              <div className="text-right">
                <div className="font-pixel text-[8px] text-gray-300">{user?.username}</div>
                <div className="font-pixel text-[7px] text-[#ffc060]">
                  {getScoreForCategory(myEntry, category)} {category === 'top-score' ? 'XP' : category === 'cyber-sentinel' ? 'pts' : ''}
                </div>
              </div>
            </div>
          )}

          {/* Category Tabs */}
          <div className="cq-tabs mb-4">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`cq-tab ${category === cat.key ? 'active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Category Description */}
          <p className="font-pixel text-[7px] text-gray-500 mb-3">
            {CATEGORIES.find(c => c.key === category)?.desc}
          </p>

          {/* Table header */}
          <div className="grid grid-cols-[40px_1fr_60px_70px] gap-2 px-2 mb-2">
            <span className="font-pixel text-[7px] text-gray-400">#</span>
            <span className="font-pixel text-[7px] text-gray-400">Player</span>
            <span className="font-pixel text-[7px] text-gray-400 text-center">Lv.</span>
            <span className="font-pixel text-[7px] text-gray-400 text-right">
              {category === 'top-score' ? 'XP' : category === 'cyber-sentinel' ? 'Score' : 'Growth'}
            </span>
          </div>

          {/* Error state */}
          {error && (
            <div className="text-center py-6">
              <p className="font-pixel text-[8px] text-red-400">{error}</p>
              <button
                onClick={() => fetchLeaderboard(category)}
                className="mt-3 font-pixel text-[7px] text-gray-300 border border-gray-600 px-3 py-1 hover:border-gray-400"
              >
                Retry
              </button>
            </div>
          )}

          {/* Loading */}
          {loading && !error && (
            <div className="text-center py-8">
              <span className="cq-pulse text-2xl">⏳</span>
              <p className="text-gray-400 mt-2" style={{ fontFamily: "'VT323', monospace" }}>Loading warriors...</p>
            </div>
          )}

          {/* Rows */}
          {!loading && !error && (
            <div className="flex flex-col gap-1">
              <AnimatePresence mode="wait">
                {leaders.map((p, i) => {
                  const isMe = user && p.username === user.username;
                  const score = getScoreForCategory(p, category);
                  return (
                    <motion.div
                      key={`${p.userId || p.id || i}-${category}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ delay: i * 0.04 }}
                      className={`grid grid-cols-[40px_1fr_60px_70px] gap-2 items-center px-2 py-2 ${
                        isMe
                          ? 'bg-[rgba(240,160,48,0.15)] border border-[#f0a030]'
                          : i < 3
                          ? 'border border-transparent bg-[rgba(255,255,255,0.04)]'
                          : 'border border-transparent hover:bg-[rgba(255,255,255,0.03)]'
                      }`}
                    >
                      {/* Rank */}
                      <span className="text-center">
                        {i < 3 ? (
                          <span className="text-lg">{MEDALS[i]}</span>
                        ) : (
                          <span className="font-pixel text-[8px]" style={{ color: getRankColor(i) }}>
                            {i + 1}
                          </span>
                        )}
                      </span>

                      {/* Username */}
                      <div className="flex items-center gap-1 min-w-0">
                        <span
                          className="truncate"
                          style={{
                            fontFamily: "'VT323', monospace",
                            fontSize: '18px',
                            color: isMe ? '#f0a030' : '#ffffff'
                          }}
                        >
                          {p.username || 'Cyber Agent'}
                        </span>
                        {isMe && (
                          <span className="font-pixel text-[6px] text-[#f0a030] shrink-0">YOU</span>
                        )}
                      </div>

                      {/* Level */}
                      <span className="text-center font-pixel text-[8px] text-gray-400">
                        {p.level || 1}
                      </span>

                      {/* Score */}
                      <span className="text-right font-pixel text-[9px]" style={{ color: '#ffc060' }}>
                        {score}
                      </span>
                    </motion.div>
                  );
                })}
              </AnimatePresence>

              {leaders.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-gray-500" style={{ fontFamily: "'VT323', monospace", fontSize: '18px' }}>
                    No warriors yet. Be the first! 🛡️
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
