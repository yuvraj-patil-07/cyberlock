import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';

/* ── Victory firework particle ── */
const VictoryParticles = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
    {[...Array(24)].map((_, i) => (
      <div key={i} className="absolute"
           style={{
             left: `${Math.random() * 100}%`,
             top: `${Math.random() * 100}%`,
             width: `${4 + Math.random() * 6}px`,
             height: `${4 + Math.random() * 6}px`,
             borderRadius: '50%',
             background: ['#ffd700','#00d4ff','#ff4757','#9b59b6','#00ff88'][Math.floor(Math.random() * 5)],
             animation: `coin-rain ${0.6 + Math.random() * 1.2}s ease-in ${Math.random() * 2}s infinite`,
             opacity: Math.random() * 0.7 + 0.3,
             filter: 'blur(0.5px)',
           }}/>
    ))}
  </div>
);

/* ── Stat crystal ── */
const StatCrystal = ({ icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ delay, type: 'spring', bounce: 0.5 }}
              className="pixel-panel-stone p-4 text-center relative overflow-hidden"
              style={{ borderColor: `${color}30` }}>
    <div className="absolute top-0 left-0 right-0 h-0.5"
         style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}/>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-fantasy text-2xl font-bold" style={{ color, textShadow: `0 0 10px ${color}60` }}>
      {value}
    </div>
    <div className="text-[10px] font-bold tracking-widest uppercase mt-1" style={{ color: '#8892a4' }}>{label}</div>
    {sub && <div className="text-[10px] mt-0.5" style={{ color: `${color}80` }}>{sub}</div>}
  </motion.div>
);

export default function FinalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dna, setDna] = useState(null);
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await gameService.getCyberDNA();
        setDna(res.data);
      } catch {}
    };
    fetchStats();
    setTimeout(() => setShowBanner(true), 600);
  }, []);

  const cyberScore     = dna?.overallScore || user?.cyberScore || 87;
  const threatsDetected= dna?.totalThreatsDetected || user?.totalChallengesAttempted || 17;
  const correctDecisions= dna?.correctDecisions || user?.totalCorrect || 15;
  const evidenceFound  = dna?.evidenceFoundCount || 31;
  const improvement    = dna?.improvementPct || 34;
  const strongestSkill = dna?.strongestSkill?.label || 'Password Hygiene';
  const weakestSkill   = dna?.weakestSkill?.label || 'AI Threat Awareness';

  return (
    <div className="min-h-screen relative overflow-hidden flex flex-col items-center justify-center p-6"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 50%, #1a1a2e 100%)' }}>

      <div className="stars-bg"/>
      <VictoryParticles/>

      {/* Ambient radial glow */}
      <div className="absolute inset-0 pointer-events-none"
           style={{ background: 'radial-gradient(ellipse at center, rgba(255,215,0,0.06) 0%, transparent 60%)' }}/>

      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10 max-w-3xl w-full space-y-6">

        {/* ── VICTORY CROWN ── */}
        <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                    transition={{ type: 'spring', bounce: 0.5, delay: 0.2 }}
                    className="text-center">
          <div className="text-8xl mb-3 animate-float"
               style={{ filter: 'drop-shadow(0 0 30px rgba(255,215,0,0.6))' }}>
            👑
          </div>
          <div className="pixel-tag bg-yellow-600 text-white mx-auto mb-4 inline-block shadow-[4px_4px_0_rgba(0,0,0,0.5)]">
            <span>🏆</span>
            <span className="mx-2">MASTER CYBER SENTINEL UNLOCKED</span>
            <span>🏆</span>
          </div>
        </motion.div>

        {/* ── TITLE ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                    className="text-center">
          <h1 className="font-fantasy text-4xl md:text-6xl font-black mb-3"
              style={{
                background: 'linear-gradient(180deg, #ffffff 0%, #ffd700 40%, #c8922a 100%)',
                WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
                filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.4))',
                letterSpacing: '0.05em',
              }}>
            YOU ESCAPED CYBERLOCK
          </h1>
          <p className="text-sm md:text-base max-w-lg mx-auto leading-relaxed" style={{ color: '#8892a4' }}>
            You navigated digital deception, investigated forensic evidence, and outsmarted the adaptive threat engine. The realm is saved!
          </p>
        </motion.div>

        {/* ── VICTORY SCROLL ── */}
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="pixel-panel-parchment p-6 relative overflow-hidden">
          {/* Wax seal decoration */}
          <div className="absolute top-3 right-3 w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold"
               style={{ background: 'linear-gradient(135deg, #c8922a, #7d5713)', border: '2px solid #ffd700', boxShadow: '0 0 15px rgba(255,215,0,0.4)' }}>
            ⚔
          </div>

          <div className="text-center mb-4">
            <p className="font-fantasy text-xs font-bold tracking-widest uppercase" style={{ color: '#c8922a' }}>
              — ROYAL DECREE OF ACHIEVEMENT —
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <StatCrystal icon="💎" label="Cyber Score"    value={cyberScore}       sub="/ 100"       color="#00d4ff" delay={0.9}/>
            <StatCrystal icon="🎯" label="Threats Scanned" value={threatsDetected} sub="Scenarios"   color="#9b59b6" delay={1.0}/>
            <StatCrystal icon="✅" label="Accuracy"       value={correctDecisions}  sub="Correct"     color="#00ff88" delay={1.1}/>
            <StatCrystal icon="🔍" label="Evidence"       value={evidenceFound}     sub="Clues Found" color="#ffd700" delay={1.2}/>
            <StatCrystal icon="⏱" label="Time Taken"     value="06:42"             sub="Minutes"     color="#f59e0b" delay={1.3}/>
            <StatCrystal icon="📈" label="Improvement"    value={`+${improvement}%`} sub="Skill Gain" color="#ff6b9d" delay={1.4}/>
          </div>
        </motion.div>

        {/* ── SKILL HIGHLIGHTS ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="pixel-panel-stone p-4 flex items-center gap-3"
               style={{ borderColor: 'rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.06)' }}>
            <span className="text-3xl animate-float">🗿</span>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#00ff88' }}>STRONGEST SKILL</div>
              <p className="text-sm font-bold text-white">{strongestSkill}</p>
              <p className="text-xs" style={{ color: '#8892a4' }}>Your guardian pillar</p>
            </div>
          </div>
          <div className="pixel-panel-stone p-4 flex items-center gap-3"
               style={{ borderColor: 'rgba(155,89,182,0.3)', background: 'rgba(155,89,182,0.06)' }}>
            <span className="text-3xl">🎯</span>
            <div>
              <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#c39bd3' }}>TRAIN NEXT</div>
              <p className="text-sm font-bold text-white">{weakestSkill}</p>
              <p className="text-xs" style={{ color: '#8892a4' }}>Oracle recommends this zone</p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.8 }}
                    className="flex flex-wrap gap-4 justify-center pb-8">
          <button onClick={() => navigate('/cyber-dna')} className="pixel-btn pixel-btn-primary px-8">
            🧬 FULL CYBER DNA
          </button>
          <button onClick={() => navigate('/rooms')} className="pixel-btn pixel-btn-danger px-6">
            ⚔ TRAIN WEAKNESS
          </button>
          <button onClick={() => navigate('/leaderboard')} className="pixel-btn pixel-btn-secondary px-6">
            🏆 HALL OF LEGENDS
          </button>
          <button onClick={() => navigate('/dashboard')} className="pixel-btn pixel-btn-secondary px-6">
            🏠 VILLAGE
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
