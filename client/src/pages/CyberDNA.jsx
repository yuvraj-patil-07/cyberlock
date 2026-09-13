import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';
import Navbar from '../components/layout/Navbar';

/* ── Skill Orb Ring ── */
const SkillRing = ({ label, score, color, delay, icon }) => {
  const size = 80;
  const r = 32;
  const circ = 2 * Math.PI * r;
  const dashOffset = circ - (score / 100) * circ;
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, type: 'spring', bounce: 0.4 }}
                className="flex flex-col items-center gap-2 group cursor-default">
      <div className="relative" style={{ width: size, height: size }}>
        {/* Outer glow ring */}
        <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
             style={{ background: `radial-gradient(circle, ${color}20 0%, transparent 70%)`, transform: 'scale(1.3)' }}/>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          {/* Track */}
          <circle cx={size/2} cy={size/2} r={r} fill={`${color}08`} stroke={`${color}20`} strokeWidth="6"/>
          {/* Fill */}
          <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
                  strokeDasharray={circ} strokeDashoffset={dashOffset}
                  strokeLinecap="round" transform={`rotate(-90 ${size/2} ${size/2})`}
                  style={{ filter: `drop-shadow(0 0 8px ${color})`, transition: 'stroke-dashoffset 1.5s ease' }}/>
          {/* Inner */}
          <circle cx={size/2} cy={size/2} r="22" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.06)" strokeWidth="1"/>
          <text x={size/2} y={size/2-4} textAnchor="middle" fill={color} fontSize="11" fontWeight="700" fontFamily="Rajdhani">{icon}</text>
          <text x={size/2} y={size/2+10} textAnchor="middle" fill={color} fontSize="13" fontWeight="900" fontFamily="Rajdhani">{score}</text>
        </svg>
      </div>
      <span className="text-[10px] font-bold tracking-wider uppercase text-center max-w-[72px] leading-tight"
            style={{ color: '#8892a4' }}>{label}</span>
    </motion.div>
  );
};

/* ── Stat Pillar ── */
const StatPillar = ({ icon, label, value, sub, color, delay }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}
              className="fantasy-panel rounded-xl p-5 text-center relative overflow-hidden">
    <div className="absolute top-0 left-0 right-0 h-0.5"
         style={{ background: `linear-gradient(90deg, transparent, ${color}, transparent)` }}/>
    <div className="text-3xl mb-2">{icon}</div>
    <div className="font-fantasy text-2xl font-bold mb-1" style={{ color }}>{value}</div>
    <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8892a4' }}>{label}</div>
    {sub && <div className="text-[10px] mt-0.5" style={{ color: `${color}80` }}>{sub}</div>}
  </motion.div>
);

const SKILL_META = [
  { key:'phishing',           label:'Phishing',      color:'#ff4757', icon:'🎣' },
  { key:'passwords',          label:'Passwords',     color:'#ffd700', icon:'🔒' },
  { key:'qrSafety',           label:'QR Safety',     color:'#9b59b6', icon:'📱' },
  { key:'scamDetection',      label:'Scam Detect',   color:'#f59e0b', icon:'💰' },
  { key:'socialEngineering',  label:'Social Eng.',   color:'#ff6b9d', icon:'👥' },
  { key:'aiThreats',          label:'AI Threats',    color:'#00d4ff', icon:'🤖' },
  { key:'digitalPrivacy',     label:'Privacy',       color:'#00ff88', icon:'🛡' },
];

const RISK_STYLES = {
  low:      { color:'#00ff88', label:'LOW RISK',      emoji:'✅', glow:'rgba(0,255,136,0.3)' },
  medium:   { color:'#f59e0b', label:'MEDIUM RISK',   emoji:'⚠️', glow:'rgba(245,158,11,0.3)' },
  high:     { color:'#ff4757', label:'HIGH RISK',     emoji:'🚨', glow:'rgba(255,71,87,0.3)'  },
  critical: { color:'#ff0000', label:'CRITICAL RISK', emoji:'💀', glow:'rgba(255,0,0,0.3)'    },
};

export default function CyberDNA() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDNA = async () => {
      try {
        setLoading(true);
        const res = await gameService.getCyberDNA();
        setDna(res.data);
      } catch {
        setDna({
          categories: SKILL_META.map(s => ({ key:s.key, label:s.label, score: user?.skillProfile?.[s.key] || 60, color:s.color })),
          overallScore: user?.cyberScore || 70,
          riskLevel: 'medium',
          strongestSkill:    { label:'Password Hygiene', score:85 },
          weakestSkill:      { label:'AI Threat Awareness', score:50 },
          mostImprovedSkill: { label:'Phishing Awareness', score:75 },
          improvementPct: 34, firstScore:46, currentScore:70
        });
      } finally { setLoading(false); }
    };
    fetchDNA();
  }, [user]);

  const categories  = dna?.categories || [];
  const riskLevel   = (dna?.riskLevel || 'medium').toLowerCase();
  const riskStyle   = RISK_STYLES[riskLevel] || RISK_STYLES.medium;
  const overallScore = dna?.overallScore || 50;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <Navbar />
      <div className="stars-bg" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 pt-24 space-y-6">

        {/* ── ORACLE CHAMBER HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center">
          <div className="rune-badge rune-badge-purple mx-auto mb-3">🔮 THE ORACLE CHAMBER</div>
          <h1 className="font-fantasy text-3xl md:text-5xl font-bold text-white mb-2">
            YOUR CYBER DNA
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#8892a4' }}>
            Multi-dimensional analysis of your cyber resilience, cognitive reflexes, and threat detection acumen
          </p>
        </motion.div>

        {/* ── TOP 3 STAT PILLARS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Risk level */}
          <StatPillar icon={riskStyle.emoji} label="Cyber Risk Level" value={riskStyle.label}
                      sub="Educational Assessment" color={riskStyle.color} delay={0}/>

          {/* Overall score — center, bigger */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                      className="fantasy-panel rounded-xl p-6 text-center relative overflow-hidden"
                      style={{ boxShadow: `0 0 30px ${riskStyle.glow}, 0 8px 32px rgba(0,0,0,0.6)` }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: `linear-gradient(90deg, transparent, ${riskStyle.color}, transparent)` }}/>
            {/* Circular gauge */}
            <div className="flex justify-center mb-3">
              <div className="relative">
                <svg width="100" height="100" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.08)" strokeWidth="8"/>
                  <circle cx="50" cy="50" r="40" fill="none" stroke={riskStyle.color} strokeWidth="8"
                          strokeDasharray={251.2} strokeDashoffset={251.2 - (overallScore/100)*251.2}
                          strokeLinecap="round" transform="rotate(-90 50 50)"
                          style={{ filter: `drop-shadow(0 0 10px ${riskStyle.color})`, transition: 'stroke-dashoffset 2s ease' }}/>
                  <text x="50" y="44" textAnchor="middle" fill="white" fontSize="22" fontWeight="900" fontFamily="Rajdhani">{overallScore}</text>
                  <text x="50" y="60" textAnchor="middle" fill="#8892a4" fontSize="9" fontFamily="Rajdhani">/ 100</text>
                </svg>
              </div>
            </div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: '#8892a4' }}>OVERALL CYBER SCORE</div>
            <div className="mt-1 text-xs font-bold" style={{ color: '#00ff88' }}>
              ↑ +{dna?.improvementPct || 0}% Improvement
            </div>
          </motion.div>

          {/* Skill evolution */}
          <StatPillar icon="⚡" label="Skill Evolution" value={`${dna?.firstScore||50}% → ${dna?.currentScore||70}%`}
                      sub="Continuous AI Training" color="#00d4ff" delay={0.2}/>
        </div>

        {/* ── SKILL ORBS ORACLE RING ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="fantasy-panel rounded-2xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <span className="text-xl">✨</span>
            <h2 className="font-fantasy text-lg font-bold text-white">SKILL ORACLE — 7 VECTOR MASTERY</h2>
            <span className="ml-auto text-xs" style={{ color: '#8892a4' }}>0 = Vulnerable → 100 = Immune</span>
          </div>

          {/* Orbs grid */}
          <div className="flex flex-wrap justify-center gap-6 mb-8">
            {SKILL_META.map((s, i) => {
              const cat = categories.find(c => c.key === s.key);
              return (
                <SkillRing key={s.key} label={s.label} score={cat?.score || 50}
                           color={s.color} icon={s.icon} delay={i * 0.08}/>
              );
            })}
          </div>

          {/* Progress bars (compact) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_META.map((s, i) => {
              const cat = categories.find(c => c.key === s.key);
              const score = cat?.score || 50;
              return (
                <div key={s.key} className="flex items-center gap-3">
                  <span className="text-sm flex-shrink-0">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] font-bold mb-1"
                         style={{ color: '#8892a4' }}>
                      <span>{s.label}</span>
                      <span style={{ color: s.color }}>{score}%</span>
                    </div>
                    <div className="xp-bar-track">
                      <motion.div className="h-full rounded-full"
                        style={{ background: s.color, boxShadow: `0 0 8px ${s.color}60` }}
                        initial={{ width: 0 }} animate={{ width: `${score}%` }}
                        transition={{ duration: 1.2, delay: i * 0.1 }}/>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* ── GUARDIAN STATUES ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Strongest — glowing guardian */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="fantasy-panel rounded-xl p-5 relative overflow-hidden"
                      style={{ borderColor: 'rgba(0,255,136,0.3)', background: 'rgba(0,255,136,0.05)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: 'linear-gradient(90deg, transparent, #00ff88, transparent)' }}/>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl animate-float">🗿</span>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#00ff88' }}>STRONGEST</div>
                <div className="font-fantasy text-sm font-bold text-white">Guardian Statue</div>
              </div>
            </div>
            <p className="text-base font-bold text-white mb-1">{dna?.strongestSkill?.label || 'Password Hygiene'}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
              Exceptional awareness against brute-force, dictionary, and credential reuse vulnerabilities.
            </p>
          </motion.div>

          {/* Weakest — cracked statue */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      className="fantasy-panel rounded-xl p-5 relative overflow-hidden"
                      style={{ borderColor: 'rgba(255,71,87,0.3)', background: 'rgba(255,71,87,0.05)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: 'linear-gradient(90deg, transparent, #ff4757, transparent)' }}/>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl">💀</span>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#ff4757' }}>WEAKNESS</div>
                <div className="font-fantasy text-sm font-bold text-white">Cracked Statue</div>
              </div>
            </div>
            <p className="text-base font-bold text-white mb-1">{dna?.weakestSkill?.label || 'AI Threat Awareness'}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
              High vulnerability to deepfakes, prompt injections, and synthetic voice social engineering.
            </p>
          </motion.div>

          {/* Most improved */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                      className="fantasy-panel rounded-xl p-5 relative overflow-hidden"
                      style={{ borderColor: 'rgba(155,89,182,0.3)', background: 'rgba(155,89,182,0.05)' }}>
            <div className="absolute top-0 left-0 right-0 h-0.5"
                 style={{ background: 'linear-gradient(90deg, transparent, #9b59b6, transparent)' }}/>
            <div className="flex items-center gap-3 mb-3">
              <span className="text-3xl animate-float-slow">⬆️</span>
              <div>
                <div className="text-[10px] font-bold tracking-widest uppercase" style={{ color: '#c39bd3' }}>MOST IMPROVED</div>
                <div className="font-fantasy text-sm font-bold text-white">Rising Star</div>
              </div>
            </div>
            <p className="text-base font-bold text-white mb-1">{dna?.mostImprovedSkill?.label || 'Phishing Detection'}</p>
            <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
              +38% accuracy gains in detecting lookalike domains and email gateway bypass lures.
            </p>
          </motion.div>
        </div>

        {/* ── ORACLE DIRECTIVE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="fantasy-panel rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center gap-5"
                    style={{ borderColor: 'rgba(0,212,255,0.3)', background: 'rgba(0,212,255,0.05)' }}>
          <span className="text-4xl animate-float flex-shrink-0">🔮</span>
          <div className="flex-1">
            <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: '#00d4ff' }}>
              ✨ ORACLE'S DIRECTIVE
            </div>
            <h3 className="font-fantasy text-base font-bold text-white mb-1">
              Train: {dna?.weakestSkill?.label || 'AI Threats'} Zone
            </h3>
            <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>
              Closing your vulnerability will elevate your Cyber DNA to the Low Risk tier.
            </p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/rooms')} className="world-btn world-btn-primary px-6 py-2.5 text-sm flex-shrink-0">
              ⚔ Train Now →
            </button>
            <button onClick={() => navigate('/dashboard')} className="world-btn world-btn-ghost px-4 py-2.5 text-sm flex-shrink-0">
              🏠 Village
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
