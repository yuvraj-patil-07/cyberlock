import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { aiService } from '../services/aiService';
import Navbar from '../components/layout/Navbar';

/* ══════════════════════════════════════════
   VILLAGE SCENE SVG
══════════════════════════════════════════ */
const VillageScene = ({ completedRooms = 0, cyberScore = 70 }) => {
  const isGlowing = cyberScore >= 80;
  return (
    <svg viewBox="0 0 800 260" fill="none" className="w-full h-full">
      <defs>
        <radialGradient id="villageGlow" cx="50%" cy="80%" r="60%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.1)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
      </defs>
      <rect width="800" height="260" fill="url(#villageGlow)"/>

      {/* Ground */}
      <path d="M0 200 Q200 190 400 200 Q600 210 800 200 L800 260 L0 260Z" fill="#2d4a1e" opacity="0.6"/>

      {/* ── Watchtower (center) ── */}
      <rect x="350" y="100" width="100" height="110" fill="#1e2540" stroke={isGlowing ? '#00d4ff' : '#3d4f7c'} strokeWidth="2"/>
      <rect x="338" y="88" width="124" height="18" fill="#1a1a2e" stroke={isGlowing ? '#00d4ff' : '#3d4f7c'} strokeWidth="1.5"/>
      {[338,351,364,377,390,403,416,429,442].map((x,i) => (
        <rect key={i} x={x} y="77" width="9" height="13" fill="#1a1a2e" stroke={isGlowing ? '#00d4ff' : '#3d4f7c'} strokeWidth="1"/>
      ))}
      {/* Windows */}
      <ellipse cx="400" cy="130" rx="14" ry="18" fill={isGlowing ? 'rgba(0,212,255,0.2)' : 'rgba(255,215,0,0.1)'} stroke={isGlowing ? '#00d4ff' : '#ffd700'} strokeWidth="1.5"/>
      {isGlowing && <ellipse cx="400" cy="130" rx="8" ry="10" fill="rgba(0,212,255,0.4)"/>}
      {/* Flag */}
      <line x1="400" y1="77" x2="400" y2="54" stroke="#8892a4" strokeWidth="1.5"/>
      <polygon points="400,54 418,61 400,68" fill={completedRooms >= 3 ? '#00ff88' : '#00d4ff'} opacity="0.9"/>

      {/* ── Left houses ── */}
      {[{x:120,h:60,w:70},{x:210,h:50,w:55}].map((house,i) => (
        <g key={i}>
          <rect x={house.x} y={200-house.h} width={house.w} height={house.h} fill="#1e2540" stroke="#3d4f7c" strokeWidth="1"/>
          <polygon points={`${house.x-5},${200-house.h} ${house.x+house.w/2},${200-house.h-30} ${house.x+house.w+5},${200-house.h}`}
                   fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
          <rect x={house.x+house.w/2-6} y={170} width="12" height={house.h-30} fill="#111827" stroke="#3d4f7c" strokeWidth="1" rx="2"/>
          {/* Window light */}
          <rect x={house.x+8} y={200-house.h+12} width="14" height="10" fill="rgba(255,215,0,0.15)" stroke="#ffd700" strokeWidth="0.8" rx="1"/>
        </g>
      ))}

      {/* ── Right structures ── */}
      {[{x:540,h:55,w:60},{x:620,h:45,w:50}].map((house,i) => (
        <g key={i}>
          <rect x={house.x} y={200-house.h} width={house.w} height={house.h} fill="#1e2540" stroke="#3d4f7c" strokeWidth="1"/>
          <polygon points={`${house.x-5},${200-house.h} ${house.x+house.w/2},${200-house.h-28} ${house.x+house.w+5},${200-house.h}`}
                   fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
          <rect x={house.x+house.w/2-5} y={170} width="10" height={house.h-25} fill="#111827" stroke="#3d4f7c" strokeWidth="1" rx="2"/>
          <rect x={house.x+8} y={200-house.h+12} width="12" height="9" fill="rgba(255,215,0,0.12)" stroke="#ffd700" strokeWidth="0.8" rx="1"/>
        </g>
      ))}

      {/* ── Trees ── */}
      {[{x:80,s:1},{x:300,s:0.9},{x:500,s:1.1},{x:710,s:0.8},{x:50,s:0.7},{x:750,s:0.9}].map((t,i) => (
        <g key={i} style={{ animation: `float-slow ${4+i}s ease-in-out ${i*0.5}s infinite` }}>
          <polygon points={`${t.x},200 ${t.x+15*t.s},${200-50*t.s} ${t.x+30*t.s},200`} fill="#2d6a1e"/>
          <polygon points={`${t.x+3},200 ${t.x+15*t.s},${200-65*t.s} ${t.x+27*t.s},200`} fill="#3d8a28"/>
        </g>
      ))}

      {/* ── Floating orbs (XP) ── */}
      {[{x:250,y:160,c:'#ffd700'},{x:550,y:150,c:'#00d4ff'},{x:450,y:140,c:'#9b59b6'},{x:320,y:175,c:'#00ff88'}].map((orb,i) => (
        <circle key={i} cx={orb.x} cy={orb.y} r="4" fill={orb.c} opacity="0.7"
                style={{ animation: `float ${2+i}s ease-in-out ${i*0.7}s infinite`, filter: `drop-shadow(0 0 6px ${orb.c})` }}/>
      ))}

      {/* ── NPC merchant ── */}
      <g style={{ animation: 'float-slow 4s ease-in-out 1s infinite' }}>
        <ellipse cx="180" cy="204" rx="8" ry="4" fill="rgba(0,0,0,0.4)"/>
        <rect x="172" y="178" width="16" height="26" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1" rx="2"/>
        <circle cx="180" cy="172" r="10" fill="#2a3558" stroke="#3d4f7c" strokeWidth="1"/>
        {/* Wizard hat */}
        <polygon points="172,168 180,148 188,168" fill="#4a2080"/>
        <rect x="170" y="166" width="20" height="4" fill="#6b28a8" rx="1"/>
        {/* Wand */}
        <line x1="190" y1="188" x2="205" y2="172" stroke="#8892a4" strokeWidth="1.5" strokeLinecap="round"/>
        <circle cx="205" cy="170" r="3" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
        {/* Speech bubble */}
        <rect x="195" y="148" width="80" height="28" rx="8" fill="#1e2540" stroke="rgba(155,89,182,0.5)" strokeWidth="1"/>
        <polygon points="202,176 210,186 215,176" fill="#1e2540"/>
        <text x="235" y="163" textAnchor="middle" fill="#c39bd3" fontSize="7" fontFamily="Rajdhani" fontWeight="700">Your quest awaits!</text>
        <text x="235" y="172" textAnchor="middle" fill="#8892a4" fontSize="6">Click a zone to begin</text>
      </g>
    </svg>
  );
};

/* ── Skill Orb ── */
const SkillOrb = ({ label, score, color, delay }) => {
  const r = 22;
  const circ = 2 * Math.PI * r;
  const pct = circ - (score / 100) * circ;
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, type: 'spring', bounce: 0.4 }}
                className="flex flex-col items-center gap-2 group cursor-default">
      <div className="relative w-14 h-14">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle cx="28" cy="28" r={r} fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="3"/>
          <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="3"
                  strokeDasharray={circ} strokeDashoffset={pct}
                  strokeLinecap="round" transform="rotate(-90 28 28)"
                  style={{ filter: `drop-shadow(0 0 6px ${color})`, transition: 'stroke-dashoffset 1s ease' }}/>
          <text x="28" y="33" textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Rajdhani">{score}</text>
        </svg>
      </div>
      <span className="text-[10px] font-bold tracking-wider uppercase text-center max-w-[60px] leading-tight"
            style={{ color: '#8892a4' }}>{label}</span>
    </motion.div>
  );
};

/* ── Quest Log entry ── */
const QuestEntry = ({ icon, title, time, color }) => (
  <div className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
    <span className="text-lg flex-shrink-0">{icon}</span>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-bold truncate text-white">{title}</p>
      <p className="text-[10px]" style={{ color: '#8892a4' }}>{time}</p>
    </div>
    <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: color }}/>
  </div>
);

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, loadProgress } = useGame();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);
  const [showWelcome, setShowWelcome] = useState(true);

  useEffect(() => {
    loadProgress();
    const timer = setTimeout(() => setShowWelcome(false), 3000);
    const fetchRec = async () => {
      try {
        const res = await aiService.getRecommendation();
        setRecommendation(res.data.recommendation);
      } catch {
        setRecommendation({ room: 1, title: 'PHISHING TOWER — Level 2', reason: 'Reinforce deceptive sender identification.' });
      }
    };
    fetchRec();
    return () => clearTimeout(timer);
  }, [loadProgress]);

  const cyberScore = user?.cyberScore ?? 70;
  const level      = user?.level ?? 1;
  const xp         = user?.xp ?? 0;
  const maxXP      = level * 1000;
  const lives      = user?.lives ?? 5;
  const trustScore = user?.trustScore ?? 100;
  const badges     = user?.badges ?? [];
  const completedRooms = user?.completedRooms?.length ?? 0;
  const skillProfile = user?.skillProfile ?? { phishing:75, passwords:85, qrSafety:60, scamDetection:70, socialEngineering:65, aiThreats:50 };

  const ZONES = [
    { id:1, name:'Phishing Tower',    emoji:'🎣', status: completedRooms >= 1 ? 'cleared' : 'active',  color:'#ff4757' },
    { id:2, name:'Password Fortress', emoji:'🔒', status: completedRooms >= 2 ? 'cleared' : completedRooms >= 1 ? 'active' : 'locked', color:'#ffd700' },
    { id:3, name:'QR Temple',         emoji:'📱', status: completedRooms >= 3 ? 'cleared' : completedRooms >= 2 ? 'active' : 'locked', color:'#9b59b6' },
    { id:4, name:'Scam Village',      emoji:'💰', status: completedRooms >= 4 ? 'cleared' : completedRooms >= 3 ? 'active' : 'locked', color:'#f59e0b' },
    { id:5, name:'Final Castle',      emoji:'🏰', status: completedRooms >= 5 ? 'cleared' : completedRooms >= 4 ? 'active' : 'locked', color:'#00ff88' },
  ];

  const SKILLS = [
    { label:'Phishing',    score: skillProfile.phishing,          color:'#ff4757' },
    { label:'Passwords',   score: skillProfile.passwords,         color:'#ffd700' },
    { label:'QR Safety',   score: skillProfile.qrSafety,          color:'#9b59b6' },
    { label:'Scam Detect', score: skillProfile.scamDetection,     color:'#f59e0b' },
    { label:'Social Eng',  score: skillProfile.socialEngineering, color:'#ff6b9d' },
    { label:'AI Threats',  score: skillProfile.aiThreats,         color:'#00d4ff' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <Navbar />

      {/* ── WELCOME SPLASH ── */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <motion.div initial={{ scale: 0.5, y: 20 }} animate={{ scale: 1, y: 0 }}
                          exit={{ scale: 1.2, opacity: 0 }} transition={{ type: 'spring', bounce: 0.4 }}>
                <p className="font-fantasy text-2xl md:text-4xl font-bold mb-2"
                   style={{ color: '#e8c96a', textShadow: '0 0 30px rgba(255,215,0,0.5)' }}>
                  Welcome back, {user?.username || 'Hero'}!
                </p>
                <p className="text-sm" style={{ color: '#8892a4' }}>Your village awaits your command</p>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-24 space-y-6">

        {/* ── VILLAGE SCENE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="fantasy-panel rounded-2xl overflow-hidden relative"
                    style={{ height: '220px' }}>
          <div className="absolute inset-0">
            <VillageScene completedRooms={completedRooms} cyberScore={cyberScore} />
          </div>
          {/* Overlay info */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <div className="rune-badge">
              <span>🏰</span>
              <span>{user?.username || 'Hero'}'s Village</span>
            </div>
          </div>
          <div className="absolute top-4 right-4">
            <div className="rune-badge rune-badge-gold">
              <span>⚡</span>
              <span>Lv {level}</span>
            </div>
          </div>
          {/* Bottom action */}
          <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3">
            <button onClick={() => navigate('/rooms')}
              className="world-btn world-btn-gold px-6 py-2 text-xs">
              ⚔ ENTER A ZONE
            </button>
            <button onClick={() => navigate('/cyber-dna')}
              className="world-btn world-btn-ghost px-6 py-2 text-xs">
              🧬 CYBER DNA
            </button>
          </div>
        </motion.div>

        {/* ── TOP STATS ROW ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon:'💎', label:'Cyber Score', value:`${cyberScore}/100`, color:'#00d4ff', sub:'Shield Rating' },
            { icon:'❤️', label:'Lives', value: lives > 0 ? '❤️'.repeat(Math.min(lives, 5)) : '💀 KO', color:'#ff4757', sub:`${lives} remaining` },
            { icon:'⭐', label:'Trust Score', value:`${trustScore}%`, color:'#ffd700', sub:'Reputation' },
            { icon:'🏅', label:'Badges', value:badges.length, color:'#9b59b6', sub:'Earned' },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="fantasy-panel rounded-xl p-4 text-center">
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="font-fantasy text-lg font-bold" style={{ color: stat.color }}>{stat.value}</div>
              <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#8892a4' }}>{stat.label}</div>
              <div className="text-[10px] mt-0.5" style={{ color: '#8892a4' }}>{stat.sub}</div>
            </motion.div>
          ))}
        </div>

        {/* ── XP BAR ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="fantasy-panel rounded-xl px-5 py-3 flex items-center gap-4">
          <div className="rune-badge rune-badge-gold flex-shrink-0">LV {level}</div>
          <div className="flex-1">
            <div className="flex justify-between text-[10px] font-bold tracking-wider uppercase mb-1.5"
                 style={{ color: '#8892a4' }}>
              <span>⚡ {xp.toLocaleString()} XP</span>
              <span>{maxXP.toLocaleString()} XP to next level</span>
            </div>
            <div className="xp-bar-track">
              <motion.div className="xp-bar-fill"
                initial={{ width: 0 }} animate={{ width: `${Math.min(100, (xp/maxXP)*100)}%` }}
                transition={{ duration: 1.5, delay: 0.5 }}/>
            </div>
          </div>
          <div className="text-xs font-bold" style={{ color: '#00d4ff' }}>
            {Math.round((xp / maxXP) * 100)}%
          </div>
        </motion.div>

        {/* ── WORLD ZONES + SKILLS + QUEST LOG ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

          {/* Zone Map */}
          <div className="lg:col-span-2 fantasy-panel rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🗺</span>
              <h2 className="font-fantasy text-base font-bold text-white">REALM ZONES</h2>
              <span className="ml-auto rune-badge text-[10px]">{completedRooms}/5 Cleared</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {ZONES.map((zone, i) => (
                <motion.button key={zone.id}
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.08 }}
                  onClick={() => zone.status !== 'locked' && navigate(`/play/${zone.id}`)}
                  className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300
                    ${zone.status === 'cleared' ? 'border-green-500/40 bg-green-500/10 hover:bg-green-500/20' :
                      zone.status === 'active'  ? 'border-cyan-500/40 bg-cyan-500/10 hover:bg-cyan-500/20 cursor-pointer' :
                      'border-white/5 bg-white/2 opacity-40 cursor-not-allowed'}`}>
                  <span className="text-2xl" style={{ filter: zone.status === 'locked' ? 'grayscale(1)' : 'none' }}>
                    {zone.status === 'locked' ? '🔒' : zone.status === 'cleared' ? '✅' : zone.emoji}
                  </span>
                  <span className="text-[9px] font-bold text-center leading-tight uppercase tracking-wider"
                        style={{ color: zone.status === 'locked' ? '#8892a4' : zone.color }}>
                    {zone.name}
                  </span>
                  {zone.status === 'active' && (
                    <div className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: zone.color }}/>
                  )}
                </motion.button>
              ))}
            </div>

            {/* AI Recommendation */}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
                        className="mt-4 rounded-xl p-4 border"
                        style={{ background: 'rgba(155,89,182,0.08)', borderColor: 'rgba(155,89,182,0.3)' }}>
              <div className="flex items-start gap-3">
                <div className="text-2xl flex-shrink-0 animate-float">🧙</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold tracking-wider uppercase mb-1" style={{ color: '#c39bd3' }}>
                    ✨ Wizard's Recommendation
                  </p>
                  <p className="text-xs text-white font-bold mb-1">{recommendation?.title || 'PHISHING TOWER'}</p>
                  <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
                    {recommendation?.reason || 'Focus on deceptive sender identification and artificial urgency detection.'}
                  </p>
                </div>
                <button onClick={() => navigate(`/play/${recommendation?.room || 1}`)}
                  className="world-btn world-btn-primary px-3 py-1.5 text-xs flex-shrink-0">
                  Go →
                </button>
              </div>
            </motion.div>
          </div>

          {/* Skill Orbs + Quest Log */}
          <div className="flex flex-col gap-5">
            {/* Skill Orbs */}
            <div className="fantasy-panel rounded-xl p-4 flex-1">
              <div className="flex items-center gap-2 mb-4">
                <span className="text-lg">✨</span>
                <h2 className="font-fantasy text-sm font-bold text-white">SKILL ORBS</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {SKILLS.map((skill, i) => (
                  <SkillOrb key={skill.label} {...skill} delay={i * 0.1} />
                ))}
              </div>
            </div>

            {/* Quest Log */}
            <div className="fantasy-panel rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-lg">📜</span>
                <h2 className="font-fantasy text-sm font-bold text-white">QUEST LOG</h2>
              </div>
              <div>
                <QuestEntry icon="🎣" title="Entered Phishing Tower" time="2 hrs ago" color="#ff4757"/>
                <QuestEntry icon="⚡" title="Earned 150 XP" time="2 hrs ago" color="#ffd700"/>
                <QuestEntry icon="🏅" title="Badge: First Strike" time="Yesterday" color="#9b59b6"/>
                <QuestEntry icon="🔒" title="Tried Password Fortress" time="3 days ago" color="#00d4ff"/>
              </div>
              <button onClick={() => navigate('/leaderboard')}
                className="w-full mt-3 py-2 rounded-lg text-xs font-bold tracking-wider transition-all hover:bg-white/5"
                style={{ color: '#8892a4', border: '1px solid rgba(255,255,255,0.08)' }}>
                🏆 Hall of Legends →
              </button>
            </div>
          </div>
        </div>

        {/* ── TROPHY WALL ── */}
        {badges.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 }} className="fantasy-panel rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-lg">🏆</span>
              <h2 className="font-fantasy text-base font-bold text-white">TROPHY WALL</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              {badges.map((badge, i) => (
                <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1, type: 'spring' }}
                            className="flex flex-col items-center gap-2 p-3 rounded-xl cursor-default group"
                            style={{ background: 'rgba(255,215,0,0.06)', border: '1px solid rgba(255,215,0,0.2)' }}
                            title={badge.description}>
                  <span className="text-3xl group-hover:animate-float">{badge.icon || '🏅'}</span>
                  <span className="text-[10px] font-bold text-center max-w-[60px]"
                        style={{ color: '#e8c96a' }}>{badge.name || 'Badge'}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* ── BOTTOM ACTIONS ── */}
        <div className="flex flex-wrap justify-center gap-3 pb-8">
          <button onClick={() => navigate('/rooms')} className="world-btn world-btn-gold px-8 py-3">
            ⚔ ENTER ESCAPE ZONES
          </button>
          <button onClick={() => navigate('/cyber-dna')} className="world-btn world-btn-ghost px-6 py-3">
            🧬 CYBER DNA
          </button>
          <button onClick={() => navigate('/leaderboard')} className="world-btn world-btn-ghost px-6 py-3">
            🏆 LEADERBOARD
          </button>
        </div>
      </div>
    </div>
  );
}
