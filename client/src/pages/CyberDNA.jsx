import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';

/* ─── Skill definitions mapped to server skillProfile keys ─── */
const SKILL_CONFIG = [
  { key: 'phishing',           label: 'Phishing Defense',       emoji: '🎣', color: '#06b6d4' },
  { key: 'passwords',          label: 'Password Hygiene',        emoji: '🔑', color: '#10b981' },
  { key: 'qrSafety',           label: 'QR Code Safety',          emoji: '🔳', color: '#8b5cf6' },
  { key: 'scamDetection',      label: 'Scam Detection',          emoji: '🎭', color: '#f59e0b' },
  { key: 'socialEngineering',  label: 'Social Engineering',      emoji: '🛡️', color: '#ec4899' },
  { key: 'aiThreats',          label: 'AI Threat Awareness',     emoji: '🤖', color: '#6366f1' },
  { key: 'digitalPrivacy',     label: 'Digital Privacy',         emoji: '🔒', color: '#3b82f6' },
];

/* ─── Dynamic tips/suggestions based on weakest skill ─── */
const TIPS = {
  phishing: [
    '🎣 Always hover over links before clicking — check if the URL matches the sender.',
    '📧 Legitimate banks never ask for passwords via email. Treat all such requests as suspicious.',
    '⚠️ Urgency is a red flag! Scammers create panic to make you act without thinking.',
    '🔍 Look at the "From" address carefully — attackers often use lookalike domains.',
  ],
  passwords: [
    '🔑 Use a passphrase like "Coffee!Sky!Mountain2025" — long, memorable, strong.',
    '🔄 Never reuse the same password across sites. One breach = all accounts compromised.',
    '🔐 Enable a password manager to store and generate strong unique passwords.',
    '📵 NEVER share your password — not even with IT support (they don\'t need it!).',
  ],
  qrSafety: [
    '📷 Always check where a QR code leads before you scan it in a public place.',
    '🚨 Malicious QR codes (QRLjacking) can redirect to fake login pages. Stay alert!',
    '📋 Use a QR preview app that shows the URL before opening it.',
    '🏧 QR codes on ATMs or parking meters are sometimes replaced by scammers.',
  ],
  scamDetection: [
    '🎁 "You\'ve won a prize!" is almost always a scam. Don\'t click — report it.',
    '📞 Unexpected calls from "tech support" about your computer being hacked = scam.',
    '💰 If it sounds too good to be true, it\'s a scam. Trust your gut.',
    '🔍 Search online for the exact wording of suspicious messages — others may have reported it.',
  ],
  socialEngineering: [
    '🎭 Social engineers build trust first. Verify identity before giving any info.',
    '📋 Don\'t let strangers "tailgate" into secure areas behind you.',
    '📰 Attackers research targets on social media first. Be mindful of what you share.',
    '🏢 "Pretexting" means attackers create fake scenarios. Always verify before acting.',
  ],
  aiThreats: [
    '🤖 AI can generate convincing fake voices and videos. Verify through a second channel.',
    '📸 Deepfake scams are rising — a video call alone doesn\'t prove identity.',
    '🧠 AI-generated phishing emails have no typos. Don\'t rely on grammar errors as a red flag.',
    '🔊 "Voice cloning" can fake your CEO\'s voice. Always confirm wire transfers in person.',
  ],
  digitalPrivacy: [
    '🔒 Review app permissions regularly — does your flashlight app need your contacts?',
    '🌐 Use a VPN on public Wi-Fi to prevent man-in-the-middle attacks.',
    '🍪 Clear cookies and use private browsing to reduce tracking footprint.',
    '👁️ Enable 2FA everywhere possible — it stops 99% of automated attacks.',
  ],
};

function getRiskColor(score) {
  if (score >= 80) return '#10b981';
  if (score >= 60) return '#f59e0b';
  if (score >= 40) return '#f97316';
  return '#ef4444';
}

function getRiskLabel(score) {
  if (score >= 80) return { label: 'LOW RISK', emoji: '🟢' };
  if (score >= 60) return { label: 'MEDIUM RISK', emoji: '🟡' };
  if (score >= 40) return { label: 'HIGH RISK', emoji: '🟠' };
  return { label: 'CRITICAL RISK', emoji: '🔴' };
}

function getAccuracyRate(total, correct) {
  if (!total) return 0;
  return Math.round((correct / total) * 100);
}

function getWeakestSkill(skillProfile) {
  if (!skillProfile) return null;
  let min = Infinity; let key = null;
  for (const s of SKILL_CONFIG) {
    const v = skillProfile[s.key] ?? 0;
    if (v < min) { min = v; key = s.key; }
  }
  return key;
}

function getStrongestSkill(skillProfile) {
  if (!skillProfile) return null;
  let max = -Infinity; let key = null;
  for (const s of SKILL_CONFIG) {
    const v = skillProfile[s.key] ?? 0;
    if (v > max) { max = v; key = s.key; }
  }
  return key;
}

export default function CyberDNA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dna, setDna] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('skills'); // 'skills' | 'stats' | 'tips'
  const [tipIdx, setTipIdx] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const [dnaRes, progRes] = await Promise.all([
          gameService.getCyberDNA(),
          gameService.getProgress(),
        ]);
        if (!cancelled) {
          setDna(dnaRes.data);
          setProgress(progRes.data);
        }
      } catch (e) {
        if (!cancelled) setError('Could not load profile data.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-4xl cq-pulse">🛡️</span>
          <p className="mt-2 font-pixel text-[10px]" style={{ color: '#6a5a4a' }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="font-pixel text-[9px] text-red-400">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-3 font-pixel text-[8px] border border-gray-500 px-3 py-1 text-gray-300 hover:border-gray-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Merge server dna data with user context
  const skillProfile = dna?.categories
    ? Object.fromEntries(dna.categories.map(c => [c.key, c.score]))
    : user?.skillProfile || {};

  const overallScore = dna?.overallScore ?? user?.cyberScore ?? 0;
  const risk = getRiskLabel(overallScore);
  const riskColor = getRiskColor(overallScore);

  // Game stats
  const completedRooms = progress?.rooms?.filter(r => r.completed) || [];
  const totalRooms = 7;
  const totalAttempts = dna?.totalThreatsDetected ?? user?.totalChallengesAttempted ?? 0;
  const correctDecisions = dna?.correctDecisions ?? user?.totalCorrect ?? 0;
  const accuracy = getAccuracyRate(totalAttempts, correctDecisions);
  const gamesPlayed = user?.gamesPlayed ?? 0;
  const xp = user?.xp ?? 0;
  const level = user?.level ?? 1;
  const coins = user?.coins ?? 0;

  // Weak/Strong skills
  const weakestKey = getWeakestSkill(skillProfile);
  const strongestKey = getStrongestSkill(skillProfile);
  const weakestConfig = SKILL_CONFIG.find(s => s.key === weakestKey);
  const strongestConfig = SKILL_CONFIG.find(s => s.key === strongestKey);

  // Tips for weakest skill
  const tipsArr = TIPS[weakestKey] || TIPS.phishing;

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="max-w-lg mx-auto flex flex-col gap-3">

        {/* ── Header Card ── */}
        <div className="cq-panel-dark">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-14 h-14 flex items-center justify-center text-3xl flex-shrink-0"
                 style={{ background: '#1e3a8a', border: '3px solid #3b82f6' }}>
              🧑‍💻
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="font-pixel text-sm text-white truncate">{user?.username || 'Agent'}</span>
                <span className="font-pixel text-[8px] text-blue-400">LV.{level}</span>
              </div>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                <span className="font-pixel text-[7px]" style={{ color: riskColor }}>
                  {risk.emoji} {risk.label}
                </span>
                <span className="font-pixel text-[7px] text-gray-400">|</span>
                <span className="font-pixel text-[7px] text-[#ffc060]">⚡ {xp.toLocaleString()} XP</span>
                <span className="font-pixel text-[7px] text-yellow-400">🪙 {coins}</span>
              </div>
            </div>
            {/* Overall Score Ring */}
            <div className="flex flex-col items-center flex-shrink-0">
              <span className="font-pixel text-[7px] text-gray-400 mb-1">CYBER SCORE</span>
              <span className="font-pixel text-2xl" style={{ color: riskColor, textShadow: `0 0 12px ${riskColor}` }}>
                {overallScore}
              </span>
              <span className="font-pixel text-[6px] text-gray-500">/100</span>
            </div>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="cq-tabs">
          <button className={`cq-tab ${activeTab === 'skills' ? 'active' : ''}`} onClick={() => setActiveTab('skills')}>
            🧬 Skills
          </button>
          <button className={`cq-tab ${activeTab === 'stats' ? 'active' : ''}`} onClick={() => setActiveTab('stats')}>
            📊 Stats
          </button>
          <button className={`cq-tab ${activeTab === 'tips' ? 'active' : ''}`} onClick={() => setActiveTab('tips')}>
            💡 Tips
          </button>
        </div>

        {/* ── Skills Tab ── */}
        {activeTab === 'skills' && (
          <div className="cq-panel-dark flex flex-col gap-4">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xl">🧬</span>
              <h2 className="font-pixel text-[10px] text-white">Cyber DNA</h2>
            </div>

            {SKILL_CONFIG.map((skill, i) => {
              const score = skillProfile[skill.key] ?? 0;
              const pct = Math.min(100, Math.max(0, score));
              const isWeakest = skill.key === weakestKey;
              const isStrongest = skill.key === strongestKey;

              return (
                <motion.div
                  key={skill.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.07 }}
                  className="flex items-center gap-3"
                >
                  {/* Icon */}
                  <div
                    className="w-8 h-8 flex items-center justify-center text-base flex-shrink-0"
                    style={{ background: skill.color, border: '2px solid #000' }}
                    title={skill.label}
                  >
                    {skill.emoji}
                  </div>

                  {/* Bar */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-pixel text-[7px] text-gray-300 flex items-center gap-1">
                        {skill.label}
                        {isWeakest && <span className="text-red-400 text-[6px]">⚠ WEAK</span>}
                        {isStrongest && !isWeakest && <span className="text-green-400 text-[6px]">★ BEST</span>}
                      </span>
                      <span className="font-pixel text-[7px]" style={{ color: skill.color }}>
                        {score}/100
                      </span>
                    </div>
                    <div className="cq-bar" style={{ height: '12px' }}>
                      <div
                        className="cq-bar-fill"
                        style={{
                          width: `${pct}%`,
                          background: skill.color,
                          transition: `width 0.6s ease ${i * 0.08}s`
                        }}
                      >
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
                          background: 'rgba(255,255,255,0.2)'
                        }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Insight Row */}
            {weakestConfig && strongestConfig && (
              <div className="mt-2 pt-3 border-t border-gray-700 grid grid-cols-2 gap-3">
                <div className="text-center p-2" style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <div className="text-lg">{weakestConfig.emoji}</div>
                  <div className="font-pixel text-[6px] text-red-400 mt-1">NEEDS WORK</div>
                  <div className="font-pixel text-[7px] text-gray-300 mt-1">{weakestConfig.label}</div>
                </div>
                <div className="text-center p-2" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  <div className="text-lg">{strongestConfig.emoji}</div>
                  <div className="font-pixel text-[6px] text-green-400 mt-1">STRONGEST</div>
                  <div className="font-pixel text-[7px] text-gray-300 mt-1">{strongestConfig.label}</div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── Stats Tab ── */}
        {activeTab === 'stats' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cq-panel-dark"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">📊</span>
              <h2 className="font-pixel text-[10px] text-white">Game Statistics</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {[
                { label: 'Zones Completed', value: `${completedRooms.length}/${totalRooms}`, icon: '🗺️', color: '#3b82f6' },
                { label: 'Accuracy Rate', value: `${accuracy}%`, icon: '🎯', color: accuracy >= 70 ? '#10b981' : accuracy >= 50 ? '#f59e0b' : '#ef4444' },
                { label: 'Challenges Done', value: totalAttempts, icon: '⚔️', color: '#8b5cf6' },
                { label: 'Correct Answers', value: correctDecisions, icon: '✅', color: '#10b981' },
                { label: 'Total XP', value: xp.toLocaleString(), icon: '⚡', color: '#ffd700' },
                { label: 'Coins Earned', value: coins, icon: '🪙', color: '#f59e0b' },
                { label: 'Current Level', value: level, icon: '🏅', color: '#06b6d4' },
                { label: 'Lives Left', value: `${user?.lives ?? 5}/5`, icon: '❤️', color: '#ef4444' },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="p-3 flex flex-col items-center gap-1"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                >
                  <span className="text-lg">{stat.icon}</span>
                  <span className="font-pixel text-[10px]" style={{ color: stat.color }}>
                    {stat.value}
                  </span>
                  <span className="font-pixel text-[6px] text-gray-400 text-center">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            {/* Zone progress */}
            <div className="pt-3 border-t border-gray-700">
              <p className="font-pixel text-[8px] text-gray-400 mb-3">ZONE PROGRESS</p>
              <div className="w-full bg-gray-700 h-3 relative" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
                <div
                  className="h-full bg-green-500 transition-all duration-700"
                  style={{ width: `${(completedRooms.length / totalRooms) * 100}%` }}
                />
                <span className="absolute inset-0 flex items-center justify-center font-pixel text-[7px] text-white" style={{ textShadow: '1px 1px 0 #000' }}>
                  {completedRooms.length}/{totalRooms} zones
                </span>
              </div>

              {/* Completed zone badges */}
              <div className="flex flex-wrap gap-2 mt-3">
                {[
                  { id: 1, name: 'PHISHING',   emoji: '💀' },
                  { id: 2, name: 'PASSWORDS',  emoji: '🔑' },
                  { id: 3, name: 'QR TEMPLE',  emoji: '🔳' },
                  { id: 4, name: 'SCAMS',       emoji: '🎭' },
                  { id: 5, name: 'FIREWALL',   emoji: '🛡️' },
                  { id: 6, name: 'AI LAB',     emoji: '🤖' },
                  { id: 7, name: 'DARK WEB',   emoji: '💀' },
                ].map(zone => {
                  const done = progress?.rooms?.find(r => r.id === zone.id)?.completed;
                  const stars = progress?.user?.roomStars?.[String(zone.id)] || 0;
                  return (
                    <div
                      key={zone.id}
                      className="flex flex-col items-center p-2 flex-shrink-0"
                      style={{
                        background: done ? 'rgba(16,185,129,0.1)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        minWidth: '56px'
                      }}
                    >
                      <span className={`text-sm ${done ? '' : 'grayscale opacity-40'}`}>{zone.emoji}</span>
                      <span className="font-pixel text-[5px] text-gray-400 mt-1 text-center">{zone.name}</span>
                      {done && (
                        <div className="flex gap-[1px] mt-1">
                          {[1,2,3].map(s => (
                            <span key={s} className={`text-[8px] ${s <= stars ? 'text-yellow-400' : 'text-gray-600'}`}>⭐</span>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* ── Tips Tab ── */}
        {activeTab === 'tips' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="cq-panel-dark"
          >
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">💡</span>
              <h2 className="font-pixel text-[10px] text-white">AI Coach Tips</h2>
            </div>

            {/* Personalized to weakest skill */}
            {weakestConfig && (
              <div className="mb-4 p-3" style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)' }}>
                <p className="font-pixel text-[7px] text-red-400 mb-1">🎯 FOCUS AREA FOR YOU</p>
                <p className="font-pixel text-[8px] text-white">{weakestConfig.emoji} {weakestConfig.label}</p>
                <p className="font-pixel text-[6px] text-gray-400 mt-1">
                  Score: {skillProfile[weakestKey] ?? 0}/100 — needs improvement
                </p>
              </div>
            )}

            {/* Tip Cards */}
            <div className="flex flex-col gap-3 mb-4">
              {tipsArr.map((tip, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="p-3"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}
                >
                  <p className="font-pixel text-[7px] text-gray-200 leading-relaxed">{tip}</p>
                </motion.div>
              ))}
            </div>

            {/* General security tips */}
            <div className="pt-3 border-t border-gray-700">
              <p className="font-pixel text-[7px] text-gray-400 mb-3">🌐 GENERAL BEST PRACTICES</p>
              <div className="flex flex-col gap-2">
                {[
                  { tip: 'Enable 2FA on every account you own — bank, email, social media.', icon: '🔐' },
                  { tip: 'Keep software updated. 60% of breaches exploit unpatched vulnerabilities.', icon: '🔄' },
                  { tip: 'Back up your data regularly using the 3-2-1 rule (3 copies, 2 media, 1 offsite).', icon: '💾' },
                  { tip: 'Use a VPN on public Wi-Fi to encrypt your connection.', icon: '🌐' },
                  { tip: 'Check haveibeenpwned.com to see if your email appeared in a data breach.', icon: '🔍' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2 p-2" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                    <span className="text-base flex-shrink-0 mt-0.5">{item.icon}</span>
                    <p className="font-pixel text-[6px] text-gray-300 leading-relaxed">{item.tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Progress encouragement */}
            <div className="mt-4 p-3 text-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
              {accuracy >= 70 ? (
                <>
                  <p className="text-2xl mb-2">🌟</p>
                  <p className="font-pixel text-[8px] text-green-400">EXCELLENT ACCURACY!</p>
                  <p className="font-pixel text-[6px] text-gray-300 mt-1">
                    {accuracy}% correct — you're a true Cyber Defender. Keep it up!
                  </p>
                </>
              ) : accuracy >= 50 ? (
                <>
                  <p className="text-2xl mb-2">💪</p>
                  <p className="font-pixel text-[8px] text-yellow-400">KEEP PRACTICING!</p>
                  <p className="font-pixel text-[6px] text-gray-300 mt-1">
                    {accuracy}% accuracy. Play more zones to sharpen your instincts.
                  </p>
                </>
              ) : totalAttempts === 0 ? (
                <>
                  <p className="text-2xl mb-2">🚀</p>
                  <p className="font-pixel text-[8px] text-blue-400">START YOUR JOURNEY!</p>
                  <p className="font-pixel text-[6px] text-gray-300 mt-1">
                    Play your first zone to see your stats and personalized tips.
                  </p>
                </>
              ) : (
                <>
                  <p className="text-2xl mb-2">🎓</p>
                  <p className="font-pixel text-[8px] text-orange-400">LEARNING IN PROGRESS</p>
                  <p className="font-pixel text-[6px] text-gray-300 mt-1">
                    {accuracy}% accuracy. Read the tips above and retry the zones to improve!
                  </p>
                </>
              )}
            </div>
          </motion.div>
        )}

        {/* ── Footer CTA ── */}
        <button
          onClick={() => navigate('/rooms')}
          className="w-full py-3 font-pixel text-[9px] text-white tracking-widest transition-all"
          style={{ background: '#1e3a8a', border: '2px solid #3b82f6' }}
          onMouseEnter={e => { e.currentTarget.style.background = '#2563eb'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#1e3a8a'; }}
        >
          ⚔️ CONTINUE PLAYING TO IMPROVE
        </button>

      </div>
    </div>
  );
}
