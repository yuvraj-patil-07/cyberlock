import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ROOMS } from '../utils/constants';
import { useGame } from '../hooks/useGame';
import { useAuth } from '../hooks/useAuth';
import Navbar from '../components/layout/Navbar';

/* ════════════════════════════════════════════
   FULL WORLD MAP SVG
════════════════════════════════════════════ */
const WorldMapSVG = ({ completedRooms, onZoneClick, hoveredZone, setHoveredZone }) => {
  const isCleared  = id => completedRooms.includes(String(id));
  const isUnlocked = id => {
    if (id <= 4) return true;
    if (id === 5) return completedRooms.length >= 2;
    if (id === 6) return completedRooms.length >= 3;
    if (id === 7) return completedRooms.length >= 4;
    return false;
  };

  const zoneColor = id => isCleared(id) ? '#00ff88' : isUnlocked(id) ? '#00d4ff' : '#3d4f7c';

  return (
    <svg viewBox="0 0 900 480" fill="none" className="w-full h-full" style={{ cursor: 'default' }}>
      <defs>
        <radialGradient id="worldBg" cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="rgba(0,212,255,0.05)"/>
          <stop offset="100%" stopColor="transparent"/>
        </radialGradient>
        <filter id="glow-cyan">
          <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="glow-gold">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Sky background */}
      <rect width="900" height="480" fill="url(#worldBg)"/>

      {/* Stars */}
      {[[50,30],[140,55],[250,25],[400,40],[560,20],[700,45],[820,30],[900,60],
        [100,100],[350,80],[600,90],[800,110],[180,130],[460,70],[720,85]].map(([x,y],i) => (
        <circle key={i} cx={x} cy={y} r={1.2} fill="white" opacity={0.35+Math.random()*0.4}
                style={{ animation: `star-twinkle ${1.5+i*0.15}s ease-in-out ${i*0.1}s infinite alternate` }}/>
      ))}

      {/* Distant mountains */}
      <path d="M0 300 L100 200 L180 250 L280 180 L380 240 L480 190 L580 255 L680 195 L780 250 L900 200 L900 480 L0 480Z"
            fill="rgba(13,17,26,0.7)"/>
      {/* Mist */}
      <path d="M0 360 Q225 340 450 360 Q675 380 900 355 L900 480 L0 480Z"
            fill="rgba(10,13,26,0.6)"/>

      {/* ════ ROPE BRIDGES ════ */}
      {/* Bridge 1→2 */}
      {isUnlocked(2) ? (
        <path d="M210 320 Q310 355 390 320" stroke="#8a6030" strokeWidth="3" fill="none"
              style={{ animation: 'bridge-sway 3s ease-in-out infinite' }} strokeLinecap="round"/>
      ) : (
        <path d="M210 320 Q310 355 390 320" stroke="#2a3558" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
      )}
      {/* Plank details */}
      {isUnlocked(2) && [220,250,280,310,340,370].map((x,i) => (
        <line key={i} x1={x} y1={326} x2={x+8} y2={338} stroke="#6b4c20" strokeWidth="1.5"/>
      ))}

      {/* Bridge 2→3 */}
      {isUnlocked(3) ? (
        <path d="M510 310 Q560 340 580 310" stroke="#8a6030" strokeWidth="3" fill="none"
              style={{ animation: 'bridge-sway 3.5s ease-in-out 0.5s infinite' }} strokeLinecap="round"/>
      ) : (
        <path d="M510 310 Q560 340 580 310" stroke="#2a3558" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
      )}

      {/* Bridge 3→4 */}
      {isUnlocked(4) ? (
        <path d="M700 300 Q750 330 790 300" stroke="#8a6030" strokeWidth="3" fill="none"
              style={{ animation: 'bridge-sway 2.8s ease-in-out 1s infinite' }} strokeLinecap="round"/>
      ) : (
        <path d="M700 300 Q750 330 790 300" stroke="#2a3558" strokeWidth="3" fill="none" strokeDasharray="6 4"/>
      )}

      {/* ════ ISLANDS ════ */}

      {/* ── ISLAND 1: Phishing Tower ── */}
      <g style={{ animation: 'float-slow 5s ease-in-out 0s infinite' }}
         onClick={() => isUnlocked(1) && onZoneClick(1)}
         onMouseEnter={() => setHoveredZone(1)} onMouseLeave={() => setHoveredZone(null)}
         style={{ cursor: isUnlocked(1) ? 'pointer' : 'default', animation: 'float-slow 5s ease-in-out 0s infinite' }}>
        <ellipse cx="130" cy="345" rx="100" ry="28" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
        <ellipse cx="130" cy="338" rx="85" ry="20" fill="#3d6028"/>
        {/* Tower */}
        <rect x="110" y="240" width="40" height="105" fill="#1e2540" stroke={zoneColor(1)} strokeWidth={isCleared(1) || hoveredZone===1 ? 2 : 1.5}/>
        <rect x="102" y="228" width="56" height="16" fill="#1a1a2e" stroke={zoneColor(1)} strokeWidth="1.5"/>
        {[102,114,126,138,150].map((x,i) => <rect key={i} x={x} y="216" width="8" height="13" fill="#1a1a2e" stroke={zoneColor(1)} strokeWidth="1"/>)}
        {/* Fishing hook - phishing metaphor */}
        <path d="M155 252 Q175 228 165 248 Q159 265 170 271" stroke="#ff6b7a" strokeWidth="1.5" fill="none" strokeLinecap="round"/>
        <circle cx="170" cy="272" r="3" fill="#ff4757"/>
        {/* Window glow */}
        <ellipse cx="130" cy="272" rx="10" ry="14" fill="rgba(255,71,87,0.15)" stroke="#ff4757" strokeWidth="1.5"/>
        {isCleared(1) && <ellipse cx="130" cy="272" rx="5" ry="7" fill="rgba(0,255,136,0.4)"/>}
        {/* Cleared flag */}
        {isCleared(1) && <>
          <line x1="130" y1="216" x2="130" y2="194" stroke="#8892a4" strokeWidth="1.5"/>
          <polygon points="130,194 150,202 130,210" fill="#00ff88" filter="url(#glow-cyan)"/>
        </>}
        <text x="130" y="360" textAnchor="middle" fill={zoneColor(1)} fontSize="9" fontFamily="Cinzel" fontWeight="bold">PHISHING TOWER</text>
        {/* Trees */}
        <polygon points="60,338 72,308 84,338" fill="#2d6a1e"/>
        <polygon points="176,338 188,312 200,338" fill="#2d6a1e"/>
        {/* Hover glow ring */}
        {hoveredZone === 1 && <ellipse cx="130" cy="288" rx="55" ry="70" fill="none" stroke={zoneColor(1)} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3"/>}
      </g>

      {/* ── ISLAND 2: Password Fortress ── */}
      <g onClick={() => isUnlocked(2) && onZoneClick(2)}
         onMouseEnter={() => setHoveredZone(2)} onMouseLeave={() => setHoveredZone(null)}
         style={{ cursor: isUnlocked(2) ? 'pointer' : 'default', animation: 'float-slow 6s ease-in-out 0.8s infinite', opacity: isUnlocked(2) ? 1 : 0.45 }}>
        <ellipse cx="450" cy="335" rx="115" ry="30" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
        <ellipse cx="450" cy="328" rx="98" ry="22" fill="#3d6028"/>
        {/* Large fortress walls */}
        <rect x="400" y="230" width="100" height="108" fill="#1e2540" stroke={zoneColor(2)} strokeWidth="2"/>
        <rect x="388" y="216" width="124" height="18" fill="#1a1a2e" stroke={zoneColor(2)} strokeWidth="1.5"/>
        {[388,402,416,430,444,458,472,486,500].map((x,i) => <rect key={i} x={x} y="205" width="9" height="13" fill="#1a1a2e" stroke={zoneColor(2)} strokeWidth="1"/>)}
        {/* Side towers */}
        <rect x="388" y="248" width="24" height="85" fill="#1a1a2e" stroke={zoneColor(2)} strokeWidth="1"/>
        <rect x="488" y="248" width="24" height="85" fill="#1a1a2e" stroke={zoneColor(2)} strokeWidth="1"/>
        {/* Gate with lock/key */}
        <rect x="432" y="270" width="36" height="68" fill="#111827" stroke={isCleared(2) ? '#00ff88' : '#ffd700'} strokeWidth="1.5" rx="3"/>
        <circle cx="450" cy="302" r="8" fill="none" stroke={isCleared(2) ? '#00ff88' : '#ffd700'} strokeWidth="2"/>
        {isCleared(2)
          ? <path d="M446 302 L450 306 L456 298" stroke="#00ff88" strokeWidth="2" strokeLinecap="round"/>
          : <rect x="447" y="302" width="6" height="10" fill="none" stroke="#ffd700" strokeWidth="2"/>}
        {/* Shield emblem */}
        <path d="M450 222 L458 226 L458 234 Q458 240 450 243 Q442 240 442 234 L442 226 Z" fill="none" stroke={zoneColor(2)} strokeWidth="1.5"/>
        {isCleared(2) && <>
          <line x1="450" y1="205" x2="450" y2="182" stroke="#8892a4" strokeWidth="1.5"/>
          <polygon points="450,182 470,190 450,198" fill="#00ff88" filter="url(#glow-cyan)"/>
        </>}
        <text x="450" y="350" textAnchor="middle" fill={zoneColor(2)} fontSize="9" fontFamily="Cinzel" fontWeight="bold">PASSWORD FORTRESS</text>
        {hoveredZone === 2 && <ellipse cx="450" cy="275" rx="65" ry="80" fill="none" stroke={zoneColor(2)} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3"/>}
      </g>

      {/* ── ISLAND 3: QR Temple ── */}
      <g onClick={() => isUnlocked(3) && onZoneClick(3)}
         onMouseEnter={() => setHoveredZone(3)} onMouseLeave={() => setHoveredZone(null)}
         style={{ cursor: isUnlocked(3) ? 'pointer' : 'default', animation: 'float-slow 7s ease-in-out 1.5s infinite', opacity: isUnlocked(3) ? 1 : 0.35 }}>
        <ellipse cx="660" cy="330" rx="95" ry="26" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
        <ellipse cx="660" cy="324" rx="80" ry="19" fill="#3d6028"/>
        {/* Stepped pyramid temple */}
        <rect x="620" y="288" width="80" height="42" fill="#1e2540" stroke={zoneColor(3)} strokeWidth="1.5"/>
        <rect x="628" y="265" width="64" height="28" fill="#242b4d" stroke={zoneColor(3)} strokeWidth="1.5"/>
        <rect x="636" y="246" width="48" height="24" fill="#1e2540" stroke={zoneColor(3)} strokeWidth="1.5"/>
        <rect x="644" y="230" width="32" height="21" fill="#242b4d" stroke="#9b59b6" strokeWidth="2"/>
        {/* QR pixels on temple face */}
        {[[620,296],[628,296],[636,296],[644,296],[652,296],[660,296],
          [620,304],[636,304],[652,304],[620,312],[628,312],[644,312],[660,312]].map(([x,y],i) => (
          <rect key={i} x={x} y={y} width="6" height="6" fill={isCleared(3) ? '#00ff88' : '#9b59b6'} rx="0.5" opacity="0.8"/>
        ))}
        {/* Portal gem */}
        <ellipse cx="660" cy="242" rx="8" ry="8" fill={isCleared(3) ? 'rgba(0,255,136,0.4)' : 'rgba(155,89,182,0.35)'} stroke={isCleared(3) ? '#00ff88' : '#9b59b6'} strokeWidth="2"/>
        <ellipse cx="660" cy="242" rx="4" ry="4" fill={isCleared(3) ? '#00ff88' : '#c39bd3'}/>
        {isCleared(3) && <>
          <line x1="660" y1="230" x2="660" y2="208" stroke="#8892a4" strokeWidth="1.5"/>
          <polygon points="660,208 678,216 660,224" fill="#00ff88" filter="url(#glow-cyan)"/>
        </>}
        <text x="660" y="345" textAnchor="middle" fill={zoneColor(3)} fontSize="9" fontFamily="Cinzel" fontWeight="bold">QR TEMPLE</text>
        {hoveredZone === 3 && <ellipse cx="660" cy="276" rx="55" ry="72" fill="none" stroke={zoneColor(3)} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3"/>}
      </g>

      {/* ── ISLAND 4: Scam Village ── */}
      <g onClick={() => isUnlocked(4) && onZoneClick(4)}
         onMouseEnter={() => setHoveredZone(4)} onMouseLeave={() => setHoveredZone(null)}
         style={{ cursor: isUnlocked(4) ? 'pointer' : 'default', animation: 'float-slow 4.5s ease-in-out 2s infinite', opacity: isUnlocked(4) ? 1 : 0.3 }}>
        <ellipse cx="840" cy="330" rx="80" ry="22" fill="#2d4a1e" stroke="#3d6028" strokeWidth="1.5"/>
        <ellipse cx="840" cy="324" rx="65" ry="16" fill="#3d6028"/>
        {/* Village buildings */}
        <rect x="800" y="275" width="28" height="55" fill="#1e2540" stroke={zoneColor(4)} strokeWidth="1"/>
        <polygon points="797,275 814,252 831,275" fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
        <rect x="834" y="268" width="26" height="62" fill="#1a1a2e" stroke={zoneColor(4)} strokeWidth="1"/>
        <polygon points="831,268 847,244 863,268" fill="#2a2010" stroke="#5a4020" strokeWidth="1"/>
        {/* Wanted poster */}
        <rect x="862" y="268" width="18" height="24" fill="#c8922a" rx="1"/>
        <text x="871" y="282" textAnchor="middle" fill="#1a1a2e" fontSize="9" fontWeight="bold">?!</text>
        {/* Suspicious merchant NPC */}
        <circle cx="815" cy="290" r="6" fill="#2a3558" stroke="#f59e0b" strokeWidth="1"/>
        <rect x="811" y="296" width="8" height="14" fill="#1e2540" stroke="#3d4f7c" strokeWidth="0.5"/>
        {/* Chest */}
        <rect x="848" y="296" width="14" height="10" fill="#8a6030" stroke="#c8922a" strokeWidth="1" rx="1"/>
        <line x1="848" y1="301" x2="862" y2="301" stroke="#c8922a" strokeWidth="0.8"/>
        {isCleared(4) && <>
          <line x1="840" y1="244" x2="840" y2="222" stroke="#8892a4" strokeWidth="1.5"/>
          <polygon points="840,222 858,230 840,238" fill="#00ff88" filter="url(#glow-cyan)"/>
        </>}
        <text x="840" y="344" textAnchor="middle" fill={zoneColor(4)} fontSize="8" fontFamily="Cinzel" fontWeight="bold">SCAM VILLAGE</text>
        {hoveredZone === 4 && <ellipse cx="840" cy="294" rx="50" ry="60" fill="none" stroke={zoneColor(4)} strokeWidth="1.5" opacity="0.4" strokeDasharray="4 3"/>}
      </g>

      {/* ── ISLAND 5-7: Final Cyber Castle (large, dramatic, center-top) ── */}
      {isUnlocked(5) ? (
        <g onClick={() => onZoneClick(5)}
           onMouseEnter={() => setHoveredZone(5)} onMouseLeave={() => setHoveredZone(null)}
           style={{ cursor: 'pointer', animation: 'float-slow 8s ease-in-out 0.5s infinite' }}>
          <ellipse cx="450" cy="145" rx="130" ry="35" fill="#2d4a1e" stroke="#00d4ff" strokeWidth="1.5"
                   style={{ filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.4))' }}/>
          <ellipse cx="450" cy="138" rx="112" ry="26" fill="#3d6028"/>
          {/* Castle body */}
          <rect x="390" y="50" width="120" height="95" fill="#1e2540" stroke="#00d4ff" strokeWidth="2"
                style={{ filter: 'drop-shadow(0 0 8px rgba(0,212,255,0.3))' }}/>
          {/* Battlements */}
          <rect x="380" y="36" width="140" height="18" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5"/>
          {[380,394,408,422,436,450,464,478,492,506].map((x,i) => (
            <rect key={i} x={x} y="23" width="9" height="15" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1"/>
          ))}
          {/* Side towers */}
          <rect x="372" y="70" width="30" height="70" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5"/>
          <rect x="498" y="70" width="30" height="70" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1.5"/>
          {/* Tower battlements */}
          {[372,381,390].map((x,i) => <rect key={i} x={x} y="60" width="7" height="12" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1"/>)}
          {[498,507,516].map((x,i) => <rect key={i} x={x} y="60" width="7" height="12" fill="#1a1a2e" stroke="#00d4ff" strokeWidth="1"/>)}
          {/* Central castle door */}
          <rect x="428" y="95" width="44" height="50" fill="#0a0d1a" stroke="#00d4ff" strokeWidth="2" rx="3"/>
          {isCleared(5)
            ? <circle cx="450" cy="122" r="10" fill="rgba(0,255,136,0.3)" stroke="#00ff88" strokeWidth="2"/>
            : <><circle cx="450" cy="115" r="8" fill="none" stroke="#00d4ff" strokeWidth="2"/>
               <rect x="447" y="115" width="6" height="10" fill="none" stroke="#00d4ff" strokeWidth="2"/></>}
          {/* Glowing windows */}
          {[[400,85],[465,85],[395,110],[470,110]].map(([x,y],i) => (
            <rect key={i} x={x} y={y} width="14" height="10" rx="2"
                  fill="rgba(0,212,255,0.2)" stroke="#00d4ff" strokeWidth="1"
                  style={{ filter: 'drop-shadow(0 0 4px #00d4ff)' }}/>
          ))}
          {/* Lightning symbol */}
          <path d="M455 60 L443 78 L453 78 L441 96 L465 72 L453 72 L465 60Z" fill="#ffd700" opacity="0.9" style={{ filter: 'drop-shadow(0 0 6px #ffd700)' }}/>
          {/* Victory flag */}
          <line x1="450" y1="23" x2="450" y2="-2" stroke="#8892a4" strokeWidth="2"/>
          <polygon points="450,-2 478,8 450,18" fill="#00d4ff" style={{ filter: 'drop-shadow(0 0 8px #00d4ff)' }}/>
          <text x="450" y="162" textAnchor="middle" fill="#00d4ff" fontSize="10" fontFamily="Cinzel" fontWeight="bold"
                style={{ filter: 'drop-shadow(0 0 6px #00d4ff)' }}>FINAL CYBER CASTLE</text>
          {hoveredZone === 5 && (
            <ellipse cx="450" cy="88" rx="90" ry="110" fill="none" stroke="#00d4ff" strokeWidth="1.5"
                     opacity="0.4" strokeDasharray="6 4"/>
          )}
        </g>
      ) : (
        <g style={{ opacity: 0.3 }}>
          <ellipse cx="450" cy="145" rx="130" ry="35" fill="#1a1a2e" stroke="#2a3558" strokeWidth="1.5"/>
          <rect x="390" y="50" width="120" height="95" fill="#111827" stroke="#2a3558" strokeWidth="2"/>
          <rect x="380" y="36" width="140" height="18" fill="#0f1628" stroke="#2a3558" strokeWidth="1.5"/>
          {/* Chain lock overlay */}
          <circle cx="450" cy="95" r="20" fill="none" stroke="#3d4f7c" strokeWidth="2" strokeDasharray="4 4"/>
          <text x="450" y="100" textAnchor="middle" fill="#3d4f7c" fontSize="20">🔒</text>
          <text x="450" y="162" textAnchor="middle" fill="#3d4f7c" fontSize="9" fontFamily="Cinzel">CYBER CASTLE — LOCKED</text>
        </g>
      )}

      {/* Floating XP particles */}
      {[{x:320,y:200,c:'#ffd700'},{x:580,y:190,c:'#00d4ff'},{x:750,y:220,c:'#9b59b6'},{x:160,y:250,c:'#ff4757'}].map((p,i) => (
        <circle key={i} cx={p.x} cy={p.y} r="3" fill={p.c} opacity="0.6"
                style={{ animation: `float ${3+i}s ease-in-out ${i*0.8}s infinite`, filter: `drop-shadow(0 0 5px ${p.c})` }}/>
      ))}
    </svg>
  );
};

/* ── Zone Info Tooltip ── */
const ZONE_INFO = {
  1: { name:'Phishing Tower',    emoji:'🎣', color:'#ff4757', desc:'Detect deceptive emails, lookalike domains, and social urgency traps.',     difficulty:'⭐⭐', reward:'150 XP + Fisher Badge' },
  2: { name:'Password Fortress', emoji:'🔒', color:'#ffd700', desc:'Master entropy, passkeys, MFA, and credential stuffing defense.',           difficulty:'⭐⭐⭐', reward:'200 XP + Key Master Badge' },
  3: { name:'QR Temple',         emoji:'📱', color:'#9b59b6', desc:'Identify QR sticker overlays, quishing attacks, and rogue profiles.',        difficulty:'⭐⭐', reward:'175 XP + Temple Badge' },
  4: { name:'Scam Village',      emoji:'💰', color:'#f59e0b', desc:'Spot smishing, task scams, pig butchering, and fake emergency wires.',       difficulty:'⭐⭐⭐', reward:'225 XP + Scam Hunter Badge' },
  5: { name:'Final Cyber Castle',emoji:'🏰', color:'#00d4ff', desc:'The ultimate boss challenge — all threat types combined in one final siege.', difficulty:'⭐⭐⭐⭐⭐', reward:'500 XP + Cyber Sentinel Badge' },
};

export default function RoomSelect() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, loadProgress } = useGame();
  const [hoveredZone, setHoveredZone] = useState(null);

  useEffect(() => { loadProgress(); }, [loadProgress]);

  const completedRooms = user?.completedRooms || [];

  const isUnlocked = id => {
    if (id <= 4) return true;
    if (id === 5) return completedRooms.length >= 2;
    if (id === 6) return completedRooms.length >= 3;
    if (id === 7) return completedRooms.length >= 4;
    return false;
  };

  const handleZoneClick = id => {
    if (isUnlocked(id)) navigate(`/play/${id}`);
  };

  const info = hoveredZone ? ZONE_INFO[hoveredZone] : null;

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 100%)' }}>
      <Navbar />
      <div className="stars-bg" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pt-24">

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-6">
          <div className="rune-badge rune-badge-gold mx-auto mb-3">🗺 THE REALM MAP</div>
          <h1 className="font-fantasy text-3xl md:text-4xl font-bold text-white mb-2">
            CHOOSE YOUR ZONE
          </h1>
          <p className="text-sm max-w-xl mx-auto" style={{ color: '#8892a4' }}>
            Click an island to enter the zone · Conquer zones to unlock bridges · Reach the Final Castle
          </p>
          <div className="flex justify-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8892a4' }}>
              <div className="w-2 h-2 rounded-full bg-green-400"/>Cleared
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8892a4' }}>
              <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"/>Active
            </div>
            <div className="flex items-center gap-1.5 text-xs" style={{ color: '#8892a4' }}>
              <div className="w-2 h-2 rounded-full bg-gray-600"/>Locked
            </div>
          </div>
        </motion.div>

        {/* ── WORLD MAP ── */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="fantasy-panel rounded-2xl overflow-hidden relative mb-6"
                    style={{ height: '440px' }}>
          <WorldMapSVG completedRooms={completedRooms} onZoneClick={handleZoneClick}
                       hoveredZone={hoveredZone} setHoveredZone={setHoveredZone} />

          {/* Zone tooltip */}
          <AnimatePresence>
            {info && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 w-80">
                <div className="fantasy-panel rounded-xl p-4" style={{ borderColor: `${info.color}40` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl">{info.emoji}</span>
                    <div>
                      <h3 className="font-fantasy text-sm font-bold text-white">{info.name}</h3>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs">{info.difficulty}</span>
                        <span className="rune-badge text-[10px]" style={{ borderColor: `${info.color}40`, color: info.color }}>
                          {isUnlocked(hoveredZone) ? (completedRooms.includes(String(hoveredZone)) ? '✅ Cleared' : '⚔ Enter') : '🔒 Locked'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed mb-2" style={{ color: '#8892a4' }}>{info.desc}</p>
                  <div className="text-xs font-bold" style={{ color: info.color }}>🎁 {info.reward}</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Progress bar */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}
                    className="fantasy-panel rounded-xl p-4 flex items-center gap-4 mb-6">
          <span className="text-xl">🏰</span>
          <div className="flex-1">
            <div className="flex justify-between text-xs font-bold mb-1.5">
              <span style={{ color: '#8892a4' }}>REALM CONQUEST</span>
              <span style={{ color: '#00d4ff' }}>{completedRooms.length}/5 Zones Cleared</span>
            </div>
            <div className="xp-bar-track">
              <motion.div className="xp-bar-fill" initial={{ width: 0 }}
                animate={{ width: `${(completedRooms.length / 5) * 100}%` }}
                transition={{ duration: 1.5 }}/>
            </div>
          </div>
          {completedRooms.length >= 5 && (
            <button onClick={() => navigate('/final')} className="world-btn world-btn-gold px-4 py-2 text-xs flex-shrink-0">
              👑 Final Boss
            </button>
          )}
        </motion.div>

        {/* Zone quick-select cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(ZONE_INFO).map(([id, zone]) => {
            const zId = parseInt(id);
            const cleared = completedRooms.includes(String(zId));
            const unlocked = isUnlocked(zId);
            return (
              <motion.button key={id}
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (zId - 1) * 0.08 }}
                onClick={() => unlocked && handleZoneClick(zId)}
                className={`fantasy-panel rounded-xl p-4 text-center transition-all duration-300
                  ${unlocked ? 'hover:scale-105 cursor-pointer' : 'opacity-40 cursor-not-allowed'}
                  ${cleared ? 'border-green-500/40' : unlocked ? 'hover:border-cyan-500/40' : ''}`}
                style={{ borderColor: cleared ? 'rgba(0,255,136,0.3)' : unlocked ? `${zone.color}20` : '' }}>
                <div className="text-3xl mb-2 block">
                  {!unlocked ? '🔒' : cleared ? '✅' : zone.emoji}
                </div>
                <div className="font-fantasy text-xs font-bold text-white leading-tight mb-1">{zone.name}</div>
                <div className="text-[10px] font-bold" style={{ color: cleared ? '#00ff88' : unlocked ? zone.color : '#3d4f7c' }}>
                  {cleared ? 'CLEARED' : unlocked ? 'ENTER →' : 'LOCKED'}
                </div>
              </motion.button>
            );
          })}
        </div>

        {/* Bottom nav */}
        <div className="flex justify-center gap-3 mt-8 pb-8">
          <button onClick={() => navigate('/dashboard')} className="world-btn world-btn-ghost px-6 py-2 text-xs">
            ← Village
          </button>
          <button onClick={() => navigate('/cyber-dna')} className="world-btn world-btn-primary px-6 py-2 text-xs">
            🧬 Cyber DNA
          </button>
        </div>
      </div>
    </div>
  );
}
