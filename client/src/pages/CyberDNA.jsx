import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';
import Navbar from '../components/layout/Navbar';

/* ── Skill Orb Ring ── */
const SkillRing = ({ label, score, color, delay, icon }) => {
  return (
    <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                transition={{ delay, type: 'spring', bounce: 0.4 }}
                className="flex flex-col items-center gap-2 group cursor-default">
      <div className={`w-16 h-16 border-4 border-black flex items-center justify-center text-2xl relative ${color}`}>
        {icon}
        <div className="absolute -bottom-2 -right-2 bg-black text-white text-[10px] px-1 font-pixel border border-white">
          {score}
        </div>
      </div>
      <span className="text-[10px] font-pixel tracking-wider text-center max-w-[72px] leading-tight text-white drop-shadow-[1px_1px_0_#000]">
        {label}
      </span>
    </motion.div>
  );
};

/* ── Stat Pillar ── */
const StatPillar = ({ icon, label, value, sub, bgClass, delay }) => (
  <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay }}
              className={`${bgClass} p-5 text-center flex flex-col items-center justify-center shadow-[4px_4px_0_rgba(0,0,0,0.5)]`}>
    <div className="text-4xl mb-2 drop-shadow-[2px_2px_0_#000]">{icon}</div>
    <div className="font-pixel text-xl mb-1 text-white drop-shadow-[2px_2px_0_#000]">{value}</div>
    <div className="text-[10px] font-pixel text-yellow-300 drop-shadow-[1px_1px_0_#000]">{label}</div>
    {sub && <div className="text-[8px] font-pixel text-white/80 mt-1">{sub}</div>}
  </motion.div>
);

const SKILL_META = [
  { key:'phishing',           label:'PHISHING',      color:'bg-red-500', icon:'🎣' },
  { key:'passwords',          label:'PASSWORDS',     color:'bg-yellow-500', icon:'🔒' },
  { key:'qrSafety',           label:'QR SAFETY',     color:'bg-purple-500', icon:'📱' },
  { key:'scamDetection',      label:'SCAMS',         color:'bg-orange-500', icon:'💰' },
  { key:'socialEngineering',  label:'SOCIAL ENG',    color:'bg-pink-500', icon:'👥' },
  { key:'aiThreats',          label:'AI THREATS',    color:'bg-blue-500', icon:'🤖' },
  { key:'digitalPrivacy',     label:'PRIVACY',       color:'bg-green-500', icon:'🛡' },
];

const RISK_STYLES = {
  low:      { bg:'pixel-panel-blue', label:'LOW RISK',      emoji:'✅' },
  medium:   { bg:'pixel-panel-wood', label:'MEDIUM RISK',   emoji:'⚠️' },
  high:     { bg:'pixel-panel-stone', label:'HIGH RISK',     emoji:'🚨' },
  critical: { bg:'bg-red-900 border-4 border-red-950', label:'CRITICAL', emoji:'💀' },
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
          strongestSkill:    { label:'PASSWORD HYGIENE', score:85 },
          weakestSkill:      { label:'AI THREATS', score:50 },
          mostImprovedSkill: { label:'PHISHING DEFENSE', score:75 },
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
    <div className="min-h-screen bg-[#1e293b] font-pixel text-white relative">
      <div className="absolute inset-0 pointer-events-none opacity-30"
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
             backgroundPosition: '0 0, 20px 20px',
             backgroundSize: '40px 40px'
           }}
      />
      <Navbar />

      <div className="max-w-5xl mx-auto px-4 py-8 pt-24 space-y-8 relative z-10">

        {/* ── ORACLE CHAMBER HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center">
          <div className="pixel-tag bg-purple-700 text-white mx-auto mb-4 inline-block">🔮 THE ORACLE CHAMBER</div>
          <h1 className="text-4xl md:text-5xl text-yellow-400 mb-2 drop-shadow-[4px_4px_0_#000]">
            HERO STATS
          </h1>
          <p className="text-sm max-w-xl mx-auto text-gray-300 drop-shadow-[2px_2px_0_#000]">
            Analyze your attributes, strengths, and weaknesses.
          </p>
        </motion.div>

        {/* ── TOP 3 STAT PILLARS ── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatPillar icon={riskStyle.emoji} label="THREAT LEVEL" value={riskStyle.label}
                      bgClass={riskStyle.bg} delay={0}/>

          {/* Overall score */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}
                      className="pixel-panel-stone p-6 text-center flex flex-col items-center justify-center shadow-[8px_8px_0_rgba(0,0,0,0.5)] border-yellow-500">
            <div className="text-5xl text-yellow-400 drop-shadow-[4px_4px_0_#000] mb-2">{overallScore}</div>
            <div className="text-sm text-yellow-500 drop-shadow-[2px_2px_0_#000]">OVERALL POWER</div>
            <div className="mt-2 text-[10px] text-green-400">
              ↑ +{dna?.improvementPct || 0}% XP GAIN
            </div>
          </motion.div>

          <StatPillar icon="⚡" label="EVOLUTION" value={`${dna?.firstScore||50} → ${dna?.currentScore||70}`}
                      sub="Total Progress" bgClass="pixel-panel-blue" delay={0.2}/>
        </div>

        {/* ── SKILL ORBS ORACLE RING ── */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
                    className="pixel-panel-parchment p-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
          <div className="flex justify-between items-center mb-8 border-b-4 border-[#854d0e] pb-4">
            <h2 className="text-xl text-[#78350f]">✨ ATTRIBUTE MASTERY</h2>
            <span className="text-[10px] text-[#78350f]">LVL 0 → 100</span>
          </div>

          <div className="flex flex-wrap justify-center gap-8 mb-8">
            {SKILL_META.map((s, i) => {
              const cat = categories.find(c => c.key === s.key);
              return (
                <SkillRing key={s.key} label={s.label} score={cat?.score || 50}
                           color={s.color} icon={s.icon} delay={i * 0.08}/>
              );
            })}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {SKILL_META.map((s, i) => {
              const cat = categories.find(c => c.key === s.key);
              const score = cat?.score || 50;
              return (
                <div key={s.key} className="flex items-center gap-3 bg-white/50 p-2 border-2 border-[#854d0e]">
                  <span className="text-xl">{s.icon}</span>
                  <div className="flex-1">
                    <div className="flex justify-between text-[10px] mb-1 text-[#78350f]">
                      <span>{s.label}</span>
                      <span>{score}%</span>
                    </div>
                    <div className="pixel-bar-container h-3 bg-gray-300">
                      <motion.div className="h-full bg-yellow-500 shadow-[inset_0px_2px_0px_0px_#fef08a]"
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                      className="pixel-panel-stone p-5 border-green-500 shadow-[8px_8px_0_rgba(0,255,136,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl drop-shadow-[2px_2px_0_#000]">🗿</span>
              <div>
                <div className="text-[10px] text-green-400">STRONGEST</div>
                <div className="text-sm text-white">IRON SHIELD</div>
              </div>
            </div>
            <p className="text-lg text-yellow-400 mb-2 drop-shadow-[2px_2px_0_#000]">{dna?.strongestSkill?.label || 'PASSWORD HYGIENE'}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
                      className="pixel-panel-stone p-5 border-red-500 shadow-[8px_8px_0_rgba(255,71,87,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl drop-shadow-[2px_2px_0_#000]">💀</span>
              <div>
                <div className="text-[10px] text-red-400">WEAKNESS</div>
                <div className="text-sm text-white">CRACKED ARMOR</div>
              </div>
            </div>
            <p className="text-lg text-yellow-400 mb-2 drop-shadow-[2px_2px_0_#000]">{dna?.weakestSkill?.label || 'AI THREATS'}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
                      className="pixel-panel-stone p-5 border-purple-500 shadow-[8px_8px_0_rgba(155,89,182,0.3)]">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-4xl drop-shadow-[2px_2px_0_#000]">⭐</span>
              <div>
                <div className="text-[10px] text-purple-400">MOST IMPROVED</div>
                <div className="text-sm text-white">RISING STAR</div>
              </div>
            </div>
            <p className="text-lg text-yellow-400 mb-2 drop-shadow-[2px_2px_0_#000]">{dna?.mostImprovedSkill?.label || 'PHISHING DEFENSE'}</p>
          </motion.div>
        </div>

        {/* ── ORACLE DIRECTIVE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}
                    className="pixel-panel-wood p-6 flex flex-col md:flex-row items-center gap-6 shadow-[8px_8px_0_rgba(0,0,0,0.5)]">
          <span className="text-5xl drop-shadow-[4px_4px_0_#000] flex-shrink-0">📜</span>
          <div className="flex-1 text-center md:text-left">
            <div className="text-xs text-yellow-400 mb-2">
              QUEST DIRECTIVE
            </div>
            <h3 className="text-xl text-white mb-2 drop-shadow-[2px_2px_0_#000]">
              TRAIN: {dna?.weakestSkill?.label || 'AI THREATS'}
            </h3>
            <p className="text-xs text-gray-300">
              Complete quests in this zone to level up your weak points!
            </p>
          </div>
          <div className="flex flex-col gap-3 w-full md:w-auto">
            <button onClick={() => navigate('/dashboard')} className="pixel-btn pixel-btn-primary px-8">
              START QUEST
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
