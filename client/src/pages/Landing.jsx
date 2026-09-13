import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

/* ══════════════════════════════════════════════
   WORLD SCENE: Panoramic SVG floating islands
══════════════════════════════════════════════ */
const WorldScene = () => (
  <svg viewBox="0 0 1200 500" fill="none" preserveAspectRatio="xMidYMid slice" className="w-full h-full">
    {/* Sky gradient */}
    <defs>
      <radialGradient id="moonGlow" cx="50%" cy="30%" r="40%">
        <stop offset="0%" stopColor="rgba(0,212,255,0.08)"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="islandGlow1" cx="50%" cy="100%" r="70%">
        <stop offset="0%" stopColor="rgba(0,212,255,0.15)"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
      <radialGradient id="islandGlow2" cx="50%" cy="100%" r="70%">
        <stop offset="0%" stopColor="rgba(255,215,0,0.12)"/>
        <stop offset="100%" stopColor="transparent"/>
      </radialGradient>
    </defs>
    <rect width="1200" height="500" fill="url(#moonGlow)"/>

    {/* Moon */}
    <circle cx="960" cy="80" r="40" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.15)" strokeWidth="1"/>
    <circle cx="960" cy="80" r="32" fill="rgba(255,255,255,0.04)"/>

    {/* Stars scattered */}
    {[[100,40],[200,70],[350,30],[500,60],[650,25],[800,55],[1000,35],[1100,70],
      [150,120],[420,90],[750,100],[1050,110],[300,150],[600,80],[850,45]].map(([x,y],i) => (
      <circle key={i} cx={x} cy={y} r={1+Math.random()} fill="white" opacity={0.4+Math.random()*0.5}
              style={{ animation: `star-twinkle ${1.5+i*0.2}s ease-in-out ${i*0.15}s infinite alternate` }}/>
    ))}

    {/* Distant mountain silhouette */}
    <path d="M0 350 L150 200 L250 260 L380 170 L480 240 L600 180 L700 250 L820 190 L950 260 L1100 200 L1200 240 L1200 500 L0 500Z"
          fill="rgba(26,26,46,0.6)"/>

    {/* Mist layer */}
    <path d="M0 380 Q300 360 600 380 Q900 400 1200 370 L1200 500 L0 500Z"
          fill="rgba(10,13,26,0.5)"/>

    {/* ── ISLAND 1: Phishing Tower (left) ── */}
    <g style={{ animation: 'float-slow 6s ease-in-out 0s infinite' }}>
      <ellipse cx="180" cy="400" rx="100" ry="25" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
      <ellipse cx="180" cy="394" rx="85" ry="18" fill="#3d6028"/>
      {/* Tower */}
      <rect x="158" y="300" width="44" height="100" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1.5"/>
      <rect x="151" y="288" width="58" height="18" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1.5"/>
      {[151,163,175,187,199].map((x,i) => <rect key={i} x={x} y="278" width="8" height="12" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1"/>)}
      {/* Window with glow */}
      <ellipse cx="180" cy="330" rx="8" ry="12" fill="rgba(255,71,87,0.2)" stroke="#ff4757" strokeWidth="1.5"/>
      <ellipse cx="180" cy="330" rx="4" ry="7" fill="rgba(255,71,87,0.3)"/>
      {/* Fishing hook (phishing) */}
      <path d="M200 315 Q220 290 210 310 Q205 325 215 330" stroke="#ff6b7a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
      {/* Trees */}
      <polygon points="120,394 130,360 140,394" fill="#2d6a1e"/>
      <polygon points="220,394 230,365 240,394" fill="#2d6a1e"/>
      <text x="180" y="416" textAnchor="middle" fill="#ff6b7a" fontSize="7" fontFamily="Cinzel" opacity="0.8">PHISHING TOWER</text>
    </g>

    {/* Rope Bridge 1→2 */}
    <path d="M280 388 Q400 420 480 388" stroke="#5a4020" strokeWidth="2" fill="none"
          style={{ animation: 'bridge-sway 3s ease-in-out infinite' }} strokeDasharray="6 3"/>

    {/* ── ISLAND 2: Password Fortress (center-left) ── */}
    <g style={{ animation: 'float-slow 5s ease-in-out 0.8s infinite' }}>
      <ellipse cx="560" cy="390" rx="110" ry="28" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
      <ellipse cx="560" cy="383" rx="95" ry="21" fill="#3d6028"/>
      {/* Large fortress */}
      <rect x="520" y="290" width="80" height="100" fill="#1e2540" stroke="#3d4f7c" strokeWidth="2"/>
      <rect x="508" y="276" width="104" height="20" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1.5"/>
      {[508,522,536,550,564,578,592].map((x,i) => <rect key={i} x={x} y="264" width="9" height="14" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1"/>)}
      {/* Gate with lock */}
      <rect x="548" y="330" width="24" height="60" fill="#111827" stroke="#ffd700" strokeWidth="1.5" rx="2"/>
      <circle cx="560" cy="358" r="6" fill="none" stroke="#ffd700" strokeWidth="1.5"/>
      <rect x="557" y="358" width="6" height="8" fill="none" stroke="#ffd700" strokeWidth="1.5"/>
      {/* Key window */}
      <ellipse cx="560" cy="310" rx="12" ry="8" fill="rgba(255,215,0,0.15)" stroke="#ffd700" strokeWidth="1.5"/>
      <text x="560" y="314" textAnchor="middle" fill="#ffd700" fontSize="8">🔑</text>
      {/* Towers */}
      <rect x="510" y="305" width="22" height="70" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1"/>
      <rect x="608" y="305" width="22" height="70" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1"/>
      {/* Shield emblem */}
      <path d="M560 286 L566 289 L566 295 Q566 299 560 301 Q554 299 554 295 L554 289 Z" fill="none" stroke="#ffd700" strokeWidth="1"/>
      <text x="560" y="390" textAnchor="middle" fill="#ffd700" fontSize="7" fontFamily="Cinzel" opacity="0.8">PASSWORD FORTRESS</text>
    </g>

    {/* Rope Bridge 2→3 */}
    <path d="M670 378 Q780 410 870 378" stroke="#5a4020" strokeWidth="2" fill="none"
          style={{ animation: 'bridge-sway 3s ease-in-out 1s infinite' }} strokeDasharray="6 3"/>

    {/* ── ISLAND 3: QR Temple (center-right) ── */}
    <g style={{ animation: 'float-slow 7s ease-in-out 1.5s infinite' }}>
      <ellipse cx="950" cy="400" rx="105" ry="26" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
      <ellipse cx="950" cy="394" rx="90" ry="19" fill="#3d6028"/>
      {/* Stepped temple */}
      <rect x="910" y="350" width="80" height="50" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1.5"/>
      <rect x="918" y="320" width="64" height="35" fill="#242b4d" stroke="#3d4f7c" strokeWidth="1.5"/>
      <rect x="926" y="295" width="48" height="30" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1.5"/>
      <rect x="934" y="275" width="32" height="25" fill="#242b4d" stroke="#9b59b6" strokeWidth="1.5"/>
      {/* QR pattern on temple face */}
      <rect x="918" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      <rect x="926" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      <rect x="934" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      <rect x="942" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      <rect x="950" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      <rect x="958" y="328" width="6" height="6" fill="#9b59b6" rx="1"/>
      {/* Portal glow */}
      <ellipse cx="950" cy="305" rx="8" ry="8" fill="rgba(155,89,182,0.3)" stroke="#9b59b6" strokeWidth="1.5"/>
      <ellipse cx="950" cy="305" rx="4" ry="4" fill="rgba(155,89,182,0.6)"/>
      <text x="950" y="413" textAnchor="middle" fill="#c39bd3" fontSize="7" fontFamily="Cinzel" opacity="0.8">QR TEMPLE</text>
    </g>

    {/* ── ISLAND 4: Scam Village (far right, small) ── */}
    <g style={{ animation: 'float-slow 4.5s ease-in-out 2s infinite' }}>
      <ellipse cx="1100" cy="390" rx="70" ry="18" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1"/>
      <ellipse cx="1100" cy="385" rx="58" ry="13" fill="#3d6028"/>
      {/* Village huts */}
      <rect x="1070" y="360" width="20" height="25" fill="#1a1a2e" stroke="#3d4f7c" strokeWidth="1"/>
      <polygon points="1068,360 1080,342 1092,360" fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
      <rect x="1098" y="355" width="18" height="30" fill="#1e2540" stroke="#3d4f7c" strokeWidth="1"/>
      <polygon points="1096,355 1107,337 1118,355" fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
      {/* Wanted poster */}
      <rect x="1115" y="355" width="12" height="16" fill="#c8922a" rx="1"/>
      <text x="1121" y="365" textAnchor="middle" fill="#1a1a2e" fontSize="5">?!</text>
      <text x="1100" y="400" textAnchor="middle" fill="#f59e0b" fontSize="6" fontFamily="Cinzel" opacity="0.8">SCAM VILLAGE</text>
    </g>

    {/* Floating particles */}
    {[{x:350,y:340,c:'#00d4ff'},{x:750,y:320,c:'#ffd700'},{x:480,y:360,c:'#9b59b6'},
      {x:850,y:350,c:'#00ff88'},{x:1050,y:350,c:'#ff4757'}].map((p,i) => (
      <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.c} opacity="0.7"
              style={{ animation: `float ${3+i}s ease-in-out ${i*0.6}s infinite`, filter: `drop-shadow(0 0 4px ${p.c})` }}/>
    ))}
  </svg>
);

/* ── Threat scroll cards ── */
const THREAT_ZONES = [
  { emoji: '🎣', name: 'Phishing Tower',    desc: 'Hook detection',  color: '#ff4757', delay: 0 },
  { emoji: '🔒', name: 'Password Fortress', desc: 'Key mastery',     color: '#ffd700', delay: 0.1 },
  { emoji: '📱', name: 'QR Temple',         desc: 'Code scanning',   color: '#9b59b6', delay: 0.2 },
  { emoji: '💰', name: 'Scam Village',      desc: 'Con detection',   color: '#f59e0b', delay: 0.3 },
  { emoji: '🤖', name: 'AI Threat Lab',     desc: 'Deepfake defense',color: '#00d4ff', delay: 0.4 },
  { emoji: '🏰', name: 'Cyber Castle',      desc: 'Final boss',      color: '#00ff88', delay: 0.5 },
];

export default function Landing() {
  const navigate = useNavigate();
  const [titleVisible, setTitleVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setTitleVisible(true), 300);
  }, []);

  return (
    <div className="min-h-screen relative overflow-x-hidden"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 50%, #1a1a2e 100%)' }}>

      <div className="stars-bg" />

      {/* ── WORLD PANORAMA ── */}
      <div className="absolute bottom-0 left-0 right-0 h-96 opacity-60 pointer-events-none">
        <WorldScene />
      </div>

      {/* ── HERO SECTION ── */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 pt-16 pb-8 text-center">

        {/* Subtitle tag */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="rune-badge mb-6">
          <span>⚔</span>
          <span>IMMERSIVE AI CYBERSECURITY TRAINING REALM</span>
          <span>⚔</span>
        </motion.div>

        {/* ── CYBERLOCK TITLE ── */}
        <AnimatePresence>
          {titleVisible && (
            <motion.div initial={{ opacity: 0, scale: 0.7 }} animate={{ opacity: 1, scale: 1 }}
                        transition={{ type: 'spring', bounce: 0.4, duration: 0.8 }}>
              <h1 className="font-fantasy font-black leading-none mb-2"
                  style={{
                    fontSize: 'clamp(60px, 10vw, 130px)',
                    background: 'linear-gradient(180deg, #ffffff 0%, #a8d8ff 30%, #00d4ff 60%, #0084b4 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: 'none',
                    filter: 'drop-shadow(0 0 30px rgba(0,212,255,0.4))',
                    letterSpacing: '0.05em',
                  }}>
                CYBERLOCK
              </h1>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
                  className="font-fantasy text-xl md:text-2xl font-semibold mb-3 tracking-wide"
                  style={{ color: '#e8c96a', textShadow: '0 0 20px rgba(255,215,0,0.3)' }}>
          "Escape the Scam. Outsmart the Attacker."
        </motion.p>

        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
                  className="max-w-xl text-sm md:text-base mb-10 leading-relaxed"
                  style={{ color: '#8892a4' }}>
          An interactive fantasy world where cybersecurity threats are physical locations to conquer.
          Battle AI attackers, collect loot, unlock zones, and forge your Cyber DNA.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2 }}
                    className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button onClick={() => navigate('/register')}
            className="world-btn world-btn-gold px-10 py-4 text-base"
            style={{ fontSize: '15px' }}>
            ⚔ ENTER THE REALM
          </button>
          <button onClick={() => navigate('/demo')}
            className="world-btn world-btn-primary px-8 py-4 text-base"
            style={{ fontSize: '15px' }}>
            👁 DEMO MODE
          </button>
          <button onClick={() => document.getElementById('zones').scrollIntoView({ behavior: 'smooth' })}
            className="world-btn world-btn-ghost px-8 py-4"
            style={{ fontSize: '15px' }}>
            🗺 EXPLORE THE WORLD
          </button>
        </motion.div>

        {/* Stats strip */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.4 }}
                    className="flex flex-wrap justify-center gap-6 text-center">
          {[['7', 'DANGER ZONES'],['∞', 'AI ATTACKERS'],['6', 'THREAT TYPES'],['🏆', 'LIVE RANKINGS']].map(([val, label]) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <span className="font-fantasy text-2xl font-bold"
                    style={{ color: '#00d4ff', textShadow: '0 0 15px rgba(0,212,255,0.5)' }}>{val}</span>
              <span className="text-xs tracking-widest font-bold uppercase" style={{ color: '#8892a4' }}>{label}</span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* ── ZONE SCROLL CARDS ── */}
      <div id="zones" className="relative z-10 py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }} className="text-center mb-12">
            <div className="rune-badge rune-badge-gold mb-4">🗺 THE REALM MAP</div>
            <h2 className="font-fantasy text-3xl md:text-4xl font-bold text-white">
              CONQUER EVERY ZONE
            </h2>
            <p className="mt-3 text-sm" style={{ color: '#8892a4' }}>
              Each zone is a unique environment with enemies, loot, and boss challenges
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {THREAT_ZONES.map((zone, i) => (
              <motion.div key={zone.name}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: zone.delay }}
                onClick={() => navigate('/register')}
                className="quest-card cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="text-4xl flex-shrink-0 group-hover:animate-float transition-all">
                    {zone.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-fantasy text-base font-bold text-white mb-1">{zone.name}</h3>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: zone.color }}>
                      {zone.desc}
                    </p>
                  </div>
                  <div className="rune-badge text-[10px] self-start flex-shrink-0"
                       style={{ borderColor: `${zone.color}40`, color: zone.color }}>
                    Zone {i + 1}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── HOW IT WORKS ── */}
      <div id="how-it-works" className="relative z-10 py-20 px-6 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                      className="text-center mb-12">
            <div className="rune-badge rune-badge-purple mb-4">📜 QUEST LOG</div>
            <h2 className="font-fantasy text-3xl md:text-4xl font-bold text-white">THE GAMEPLAY LOOP</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: '🎯', step: '01', title: 'RECEIVE QUEST', desc: 'AI Attacker sends a threat scenario to your realm' },
              { icon: '🔍', step: '02', title: 'GATHER CLUES', desc: 'Investigate the digital evidence hidden in the scene' },
              { icon: '⚔', step: '03', title: 'MAKE YOUR MOVE', desc: 'Classify the threat and state your battle reasoning' },
              { icon: '✨', step: '04', title: 'EARN REWARDS', desc: 'Loot chests, XP, badges, and Cyber DNA upgrades' },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                          className="fantasy-panel rounded-2xl p-5 text-center">
                <div className="text-4xl mb-3">{s.icon}</div>
                <div className="rune-badge mx-auto mb-3" style={{ fontSize: '10px' }}>STEP {s.step}</div>
                <h4 className="font-fantasy text-sm font-bold text-white mb-2">{s.title}</h4>
                <p className="text-xs leading-relaxed" style={{ color: '#8892a4' }}>{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* ── CTA FOOTER ── */}
      <div className="relative z-10 py-24 px-6 text-center border-t border-white/5">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}>
          <h2 className="font-fantasy text-4xl md:text-5xl font-bold text-white mb-4">
            The Realm Awaits, Hero
          </h2>
          <p className="mb-8 text-sm md:text-base max-w-md mx-auto" style={{ color: '#8892a4' }}>
            Join thousands of defenders sharpening their cyber blade against real-world attacks.
          </p>
          <button onClick={() => navigate('/register')}
            className="world-btn world-btn-gold px-12 py-5 text-lg">
            ⚔ BEGIN THE ADVENTURE
          </button>
        </motion.div>
      </div>
    </div>
  );
}
