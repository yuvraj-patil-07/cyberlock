import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';

/* ── Torch flame animation ── */
const Torch = ({ x = 0 }) => (
  <div className="absolute" style={{ left: x, top: '20px' }}>
    <div style={{ width: '8px', height: '24px', background: 'linear-gradient(180deg, transparent, #5a3010)', borderRadius: '2px' }}/>
    <div className="animate-torch" style={{ width: '12px', height: '18px', background: 'radial-gradient(ellipse, #ffcc00, #ff8c00, transparent)', borderRadius: '50% 50% 30% 30%', marginLeft: '-2px', marginTop: '-8px', filter: 'blur(1px)' }}/>
  </div>
);

/* ── Trophy pedestal ── */
const TrophyPedestal = ({ rank, player, height, isGold }) => {
  const colors = {
    1: { primary:'#c8922a', light:'#ffd700', glow:'rgba(255,215,0,0.4)', emoji:'👑', label:'CHAMPION' },
    2: { primary:'#8892a4', light:'#c0c9d4', glow:'rgba(192,201,212,0.3)', emoji:'🥈', label:'RUNNER UP' },
    3: { primary:'#a06828', light:'#d4954a', glow:'rgba(200,149,74,0.3)', emoji:'🥉', label:'3RD PLACE' },
  }[rank];

  return (
    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: rank * 0.15, type: 'spring', bounce: 0.4 }}
                className="flex flex-col items-center">
      {/* Crown / Medal */}
      <div className="text-3xl mb-2 animate-float">{colors.emoji}</div>

      {/* Name plate */}
      <div className="mb-2 text-center">
        <div className="font-fantasy text-xs font-bold mb-1" style={{ color: colors.light }}>{colors.label}</div>
        <div className="font-bold text-white text-sm truncate max-w-[100px]">{player?.username || '—'}</div>
        <div className="text-xs font-bold font-mono" style={{ color: colors.primary }}>
          {(player?.totalScore || 0).toLocaleString()} XP
        </div>
      </div>

      {/* Pedestal block */}
      <div style={{ width: '100px', height: `${height}px` }}
           className="relative rounded-t-lg"
           style={{
             width:'100px', height:`${height}px`,
             background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primary}88 100%)`,
             border: `1px solid ${colors.light}40`,
             borderRadius: '6px 6px 2px 2px',
             boxShadow: `0 0 20px ${colors.glow}, inset 0 1px 0 rgba(255,255,255,0.15)`,
           }}>
        {/* Decorative stripes */}
        <div className="absolute top-0 left-0 right-0 h-1 rounded-t-lg"
             style={{ background: colors.light, opacity: 0.6 }}/>
        <div className="absolute bottom-4 left-0 right-0 text-center font-fantasy font-bold"
             style={{ color: colors.light, fontSize: '20px', textShadow: `0 0 10px ${colors.glow}` }}>
          #{rank}
        </div>
        {/* Stars */}
        {isGold && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-0.5">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="w-1.5 h-1.5 rounded-full animate-twinkle"
                   style={{ background: '#ffd700', animationDelay: `${i * 0.3}s` }}/>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const TABS = [
  { id:'top-score',       label:'⚔ Champions',  desc:'Highest XP' },
  { id:'fastest-detective',label:'⚡ Speedsters', desc:'Fastest Time' },
  { id:'best-investigator',label:'🔍 Detectives', desc:'Most Evidence' },
  { id:'most-improved',   label:'📈 Rising',      desc:'Best Growth' },
  { id:'cyber-sentinel',  label:'🛡 Sentinels',  desc:'Elite Rank' },
];

const RANK_ICONS = ['👑','🥈','🥉','4️⃣','5️⃣','6️⃣','7️⃣','8️⃣','9️⃣','🔟'];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('top-score');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]        = useState(true);
  const [showParticles, setShowParticles] = useState(false);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/leaderboard?category=${activeTab}`);
        setLeaderboard(res.data.leaderboard || []);
      } catch {
        setLeaderboard([
          { rank:1, username:'CipherSentinel', totalScore:15420, cyberScore:96, evidenceCount:42, improvementPct:45, badgeCount:9 },
          { rank:2, username:'NeonDetective',  totalScore:14250, cyberScore:92, evidenceCount:38, improvementPct:38, badgeCount:8 },
          { rank:3, username:'NullBreaker',    totalScore:13800, cyberScore:89, evidenceCount:35, improvementPct:32, badgeCount:7 },
          { rank:4, username:'DataWraith',     totalScore:12100, cyberScore:84, evidenceCount:29, improvementPct:28, badgeCount:6 },
          { rank:5, username:'ByteHunter',     totalScore:11500, cyberScore:80, evidenceCount:26, improvementPct:25, badgeCount:5 },
        ]);
      } finally { setLoading(false); }
    };
    fetchLeaderboard();
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
  }, [activeTab]);

  const top3 = leaderboard.slice(0, 3);
  const rest = leaderboard.slice(3);

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <Navbar />
      <div className="stars-bg"/>

      {/* ── HALL BACKGROUND ── */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        {/* Stone columns */}
        {[8, 92].map((pct, i) => (
          <div key={i} className="absolute top-16 bottom-0 w-8 opacity-20"
               style={{ left: `${pct}%`, background: 'linear-gradient(180deg, #3d4f7c, #1e2540)', border: '1px solid #3d4f7c' }}/>
        ))}
        {/* Torches */}
        <div className="absolute top-16 left-12 text-2xl animate-torch">🔥</div>
        <div className="absolute top-16 right-12 text-2xl animate-torch" style={{ animationDelay: '0.3s' }}>🔥</div>
        <div className="absolute top-16 left-1/4 text-2xl animate-torch" style={{ animationDelay: '0.6s' }}>🔥</div>
        <div className="absolute top-16 right-1/4 text-2xl animate-torch" style={{ animationDelay: '0.9s' }}>🔥</div>
        {/* Floor glow */}
        <div className="absolute bottom-0 left-0 right-0 h-40 opacity-10"
             style={{ background: 'radial-gradient(ellipse at center bottom, #c8922a, transparent)' }}/>
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 py-6 pt-24 space-y-6">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="rune-badge rune-badge-gold mx-auto mb-3">🏆 HALL OF LEGENDS</div>
          <h1 className="font-fantasy text-3xl md:text-5xl font-bold text-white mb-2">
            CYBER SENTINEL RANKINGS
          </h1>
          <p className="text-sm" style={{ color: '#8892a4' }}>
            The greatest defenders of the digital realm, ranked by their prowess
          </p>
        </motion.div>

        {/* ── FILTER BANNER FLAGS ── */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {TABS.map(tab => (
            <motion.button key={tab.id} onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold tracking-wider transition-all"
              style={{
                background: activeTab === tab.id ? 'rgba(200,146,42,0.2)' : 'rgba(255,255,255,0.04)',
                border: activeTab === tab.id ? '1px solid rgba(255,215,0,0.4)' : '1px solid rgba(255,255,255,0.1)',
                color: activeTab === tab.id ? '#ffd700' : '#8892a4',
                boxShadow: activeTab === tab.id ? '0 0 12px rgba(255,215,0,0.2)' : 'none',
              }}>
              {tab.label}
            </motion.button>
          ))}
        </div>

        {/* ── TROPHY PODIUM ── */}
        {top3.length >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                      className="fantasy-panel rounded-2xl p-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: 'linear-gradient(90deg, transparent, #ffd700, transparent)' }}/>
            <h2 className="font-fantasy text-sm font-bold text-center mb-6" style={{ color: '#e8c96a' }}>
              ✦ HALL OF CHAMPIONS ✦
            </h2>
            {/* Podium display: 2nd, 1st, 3rd */}
            <div className="flex items-end justify-center gap-4">
              <TrophyPedestal rank={2} player={top3[1]} height={80}/>
              <TrophyPedestal rank={1} player={top3[0]} height={110} isGold={true}/>
              <TrophyPedestal rank={3} player={top3[2]} height={60}/>
            </div>
          </motion.div>
        )}

        {/* ── FULL RANKINGS TABLE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="fantasy-panel rounded-2xl overflow-hidden">
          {/* Table header */}
          <div className="px-5 py-3 border-b border-white/5 flex items-center"
               style={{ background: 'rgba(255,215,0,0.05)' }}>
            <div className="grid grid-cols-12 w-full text-[10px] font-bold tracking-widest uppercase"
                 style={{ color: '#8892a4' }}>
              <div className="col-span-1">Rank</div>
              <div className="col-span-4">Hero</div>
              <div className="col-span-2 text-center">Score</div>
              <div className="col-span-2 text-center">Clues</div>
              <div className="col-span-2 text-right">XP</div>
              <div className="col-span-1 text-right hidden md:block">🏅</div>
            </div>
          </div>

          {/* Rows */}
          <div>
            {leaderboard.map((player, idx) => (
              <motion.div key={player.rank}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="px-5 py-3.5 border-b border-white/5 last:border-0 hover:bg-white/3 transition-colors group"
                style={{ background: player.rank <= 3 ? `rgba(200,146,42,${0.04 * (4 - player.rank)})` : '' }}>
                <div className="grid grid-cols-12 w-full items-center">
                  <div className="col-span-1 text-lg">{RANK_ICONS[idx] || `#${player.rank}`}</div>
                  <div className="col-span-4">
                    <span className="font-bold text-sm text-white group-hover:text-yellow-300 transition-colors">
                      {player.username}
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold font-mono" style={{ color: '#00d4ff' }}>
                      {player.cyberScore || 50}/100
                    </span>
                  </div>
                  <div className="col-span-2 text-center">
                    <span className="text-xs font-bold font-mono" style={{ color: '#9b59b6' }}>
                      {player.evidenceCount || 0}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <span className="text-xs font-bold font-mono" style={{ color: '#ffd700' }}>
                      {(player.totalScore || 0).toLocaleString()}
                    </span>
                  </div>
                  <div className="col-span-1 text-right hidden md:block">
                    <span className="text-xs font-bold" style={{ color: '#8892a4' }}>{player.badgeCount || 0}🏅</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom actions */}
        <div className="flex justify-center gap-3 pb-8">
          <button onClick={() => navigate('/dashboard')} className="world-btn world-btn-ghost px-6 py-2 text-xs">
            ← Village
          </button>
          <button onClick={() => navigate('/rooms')} className="world-btn world-btn-gold px-6 py-2 text-xs">
            ⚔ Enter Battle
          </button>
        </div>
      </div>
    </div>
  );
}
