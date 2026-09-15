import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Zap, Server, Wifi, Lock, AlertTriangle } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   FIREWALL DEFENSE — Network packet filter game.
   Packets appear one at a time; player must rapidly
   decide BLOCK or ALLOW before the timer expires.
   ═══════════════════════════════════════════════════ */

const PACKETS = [
  {
    id: 1,
    src: '192.168.1.45',
    port: 443,
    proto: 'HTTPS',
    desc: 'Employee accessing company dashboard via SSO login',
    action: 'allow',
    threat: null,
    explanation: 'Normal internal HTTPS traffic from a known corporate IP address. Safe to allow.'
  },
  {
    id: 2,
    src: '45.33.32.156',
    port: 80,
    proto: 'HTTP',
    desc: 'GET /admin?id=1 OR 1=1; DROP TABLE users--',
    action: 'block',
    threat: 'SQL Injection',
    explanation: 'Classic SQL injection payload trying to bypass auth and destroy the user database.'
  },
  {
    id: 3,
    src: '198.51.100.23',
    port: 53,
    proto: 'DNS',
    desc: 'DNS query → c2-botnet-controller.evil.xyz',
    action: 'block',
    threat: 'C2 Beacon',
    explanation: 'DNS request to a known Command & Control domain. This machine is likely compromised by a botnet.'
  },
  {
    id: 4,
    src: '10.0.0.12',
    port: 1194,
    proto: 'OpenVPN',
    desc: 'Remote employee establishing VPN tunnel to office',
    action: 'allow',
    threat: null,
    explanation: 'Standard OpenVPN connection from a remote worker. Encrypted tunnel to corporate network is legitimate.'
  },
  {
    id: 5,
    src: '203.0.113.42',
    port: '—',
    proto: 'TCP',
    desc: 'Sequential port scan: 22 → 80 → 443 → 3306 → 5432 → 8080',
    action: 'block',
    threat: 'Port Scan',
    explanation: 'Systematic scanning from an external IP to find open services — classic reconnaissance for a future attack.'
  },
  {
    id: 6,
    src: '10.0.0.5',
    port: 25,
    proto: 'SMTP',
    desc: 'Mail server sending outbound email to clients',
    action: 'allow',
    threat: null,
    explanation: 'Company mail server sending legitimate outbound email. Standard SMTP traffic on the expected port.'
  },
  {
    id: 7,
    src: '10.0.0.99',
    port: 443,
    proto: 'HTTPS',
    desc: '2.3 GB encrypted archive → mega.nz/upload at 3:14 AM',
    action: 'block',
    threat: 'Data Exfiltration',
    explanation: 'Massive encrypted upload to a file-sharing service at 3 AM indicates data exfiltration or insider threat.'
  },
  {
    id: 8,
    src: '172.16.0.8',
    port: 443,
    proto: 'HTTPS',
    desc: 'Workstation downloading update from microsoft.com',
    action: 'allow',
    threat: null,
    explanation: 'Windows Update from the official Microsoft domain. Routine, expected maintenance traffic.'
  },
  {
    id: 9,
    src: '185.220.101.33',
    port: 8333,
    proto: 'TCP',
    desc: 'stratum+tcp://pool.cryptomine.io — Bitcoin mining pool',
    action: 'block',
    threat: 'Cryptojacking',
    explanation: 'Connection to a cryptocurrency mining pool. Someone is using company hardware to mine Bitcoin.'
  },
  {
    id: 10,
    src: '198.51.100.77',
    port: 4444,
    proto: 'TCP',
    desc: 'Reverse shell — Meterpreter payload detected',
    action: 'block',
    threat: 'Reverse Shell',
    explanation: 'Port 4444 is the default Meterpreter port. Active exploitation giving attackers remote access to the server.'
  }
];

const TOTAL = PACKETS.length;
const TIME_PER_PKT = 6; // seconds

const SocialRoom = ({ challenge, onComplete, onFeedback }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [serverHP, setServerHP] = useState(100);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_PKT);
  const [fb, setFb] = useState(null);
  const [phase, setPhase] = useState('play'); // 'play' | 'done'
  const [log, setLog] = useState([]);         // mini log of results

  const pkt = PACKETS[idx];

  /* ── Timer ── */
  useEffect(() => {
    if (phase !== 'play' || fb) return;
    if (timeLeft <= 0) { decide('timeout'); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase, fb]);

  /* reset on new packet */
  useEffect(() => { if (phase === 'play') { setTimeLeft(TIME_PER_PKT); setFb(null); } }, [idx, phase]);

  /* ── Decision handler ── */
  const decide = useCallback((v) => {
    if (fb || phase !== 'play') return;

    // timeout = auto-allow (dangerous if malicious)
    const effective = v === 'timeout' ? 'allow' : v;
    const ok = effective === pkt.action;

    if (ok) {
      setScore(p => p + 15);
      setCorrect(p => p + 1);
      setFb({ ok: true, txt: effective === 'block' ? '🛡 BLOCKED!' : '✅ ALLOWED' });
    } else {
      setLives(p => p - 1);
      const dmg = pkt.threat ? 20 : 10;
      setServerHP(p => Math.max(0, p - dmg));
      setFb({
        ok: false,
        txt: v === 'timeout' ? '⏰ AUTO-ALLOWED!' : (effective === 'allow' ? '💥 BREACH!' : '🚫 FALSE ALARM')
      });
    }

    setLog(p => [...p, { id: pkt.id, ok, action: effective }]);
    if (onFeedback) onFeedback({ isCorrect: ok, text: pkt.explanation });

    setTimeout(() => {
      const newLives = ok ? lives : lives - 1;
      if (newLives <= 0 || idx + 1 >= TOTAL) { setPhase('done'); return; }
      setIdx(p => p + 1);
    }, 2000);
  }, [fb, phase, pkt, idx, lives, onFeedback]);

  /* ── Finish ── */
  const finish = () => {
    const passed = lives > 0;
    if (passed) {
      onComplete({ xp: score, coins: Math.floor(score / 3) });
    } else {
      onComplete({ xp: Math.floor(score / 2), coins: 0, failed: true });
    }
  };

  /* ════════ RESULT SCREEN ════════ */
  if (phase === 'done') {
    const passed = lives > 0;
    return (
      <div className="flex flex-col h-full items-center justify-center p-4 text-center gap-3"
           style={{ background: 'linear-gradient(180deg,#0a0f14,#0f1a26)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <span className="text-5xl block mb-1">{passed ? '🏰' : '💥'}</span>
        </motion.div>
        <h2 className="font-pixel text-base text-white">{passed ? 'SERVER DEFENDED' : 'SERVER BREACHED'}</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          {passed ? 'Your firewall held strong! The network is secure.' : 'Malicious packets got through. The server has been compromised.'}
        </p>

        <div className="flex gap-6 my-2">
          <div className="text-center">
            <div className="text-xl font-bold text-cyan-400">{score}</div>
            <div className="text-[10px] text-slate-500">XP</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-emerald-400">{correct}/{idx + 1}</div>
            <div className="text-[10px] text-slate-500">CORRECT</div>
          </div>
          <div className="text-center">
            <div className={`text-xl font-bold ${serverHP > 50 ? 'text-green-400' : serverHP > 20 ? 'text-yellow-400' : 'text-red-400'}`}>{serverHP}%</div>
            <div className="text-[10px] text-slate-500">SERVER HP</div>
          </div>
        </div>

        {/* Mini packet log */}
        <div className="flex gap-1 my-1">
          {log.map(l => (
            <span key={l.id} className={`w-5 h-5 rounded text-[10px] flex items-center justify-center font-bold ${l.ok ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'}`}>
              {l.ok ? '✓' : '✗'}
            </span>
          ))}
        </div>

        <button onClick={finish} className="pixel-btn pixel-btn-primary px-8 py-2 text-xs">
          {passed ? '✓ COMPLETE ROOM' : '← RETURN TO MAP'}
        </button>
      </div>
    );
  }

  /* ════════ GAME UI ════════ */
  const timerPct = (timeLeft / TIME_PER_PKT) * 100;
  const hpColor = serverHP > 60 ? '#22c55e' : serverHP > 30 ? '#eab308' : '#ef4444';

  return (
    <div className="flex flex-col h-full relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg,#0a0f14,#0f1a26)' }}>

      {/* background grid */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{ backgroundImage: 'linear-gradient(#1e3a4a 1px,transparent 1px),linear-gradient(90deg,#1e3a4a 1px,transparent 1px)', backgroundSize: '35px 35px' }} />

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-emerald-500/20 z-10">
        <div className="flex items-center gap-1.5">
          <Wifi className="w-4 h-4 text-emerald-400" />
          <span className="font-pixel text-[10px] text-emerald-300">PKT {idx + 1}/{TOTAL}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2].map(i => <span key={i} className={`text-sm ${i < lives ? '' : 'opacity-20 grayscale'}`}>❤️</span>)}
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="font-pixel text-[10px] text-yellow-300">{score} XP</span>
        </div>
      </div>

      {/* ── SERVER HEALTH ── */}
      <div className="px-3 py-1 z-10 flex items-center gap-2">
        <Server className="w-3 h-3" style={{ color: hpColor }} />
        <span className="text-[10px] font-mono text-slate-400">SERVER</span>
        <div className="flex-1 h-2 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
          <motion.div className="h-full rounded-full" style={{ background: hpColor, width: `${serverHP}%` }}
                      animate={{ width: `${serverHP}%` }} transition={{ duration: 0.5 }} />
        </div>
        <span className="text-[10px] font-mono" style={{ color: hpColor }}>{serverHP}%</span>
      </div>

      {/* ── TIMER BAR ── */}
      <div className="h-1 bg-slate-800 z-10 mx-3 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full"
                    style={{ background: timeLeft <= 2 ? '#ef4444' : '#22d3ee', width: `${timerPct}%` }}
                    transition={{ duration: 0.3 }} />
      </div>

      {/* ── MAIN CONTENT ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-3 py-2 z-10 min-h-0 relative">
        <AnimatePresence mode="wait">
          {fb ? (
            <motion.div key="fb" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ opacity: 0 }}
                        className="text-center px-4">
              <span className={`font-pixel text-xl drop-shadow-[2px_2px_0_#000] ${fb.ok ? 'text-green-400' : 'text-red-400'}`}>
                {fb.txt}
              </span>
              <p className="text-[11px] text-slate-300 mt-2 max-w-sm leading-relaxed">{pkt.explanation}</p>
            </motion.div>
          ) : (
            <motion.div key={`p-${idx}`} initial={{ x: 100, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -100, opacity: 0 }} transition={{ type: 'spring', stiffness: 180 }}
                        className="w-full max-w-md">

              {/* Packet card */}
              <div className={`rounded-xl border p-3 backdrop-blur-sm shadow-2xl ${pkt.threat ? 'bg-red-950/40 border-red-500/30' : 'bg-slate-800/80 border-slate-600'}`}>
                {/* Packet header */}
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${pkt.threat ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                    {pkt.proto}
                  </span>
                  {pkt.threat && (
                    <span className="flex items-center gap-1 text-[10px] text-red-400 font-mono">
                      <AlertTriangle className="w-3 h-3" /> {pkt.threat}
                    </span>
                  )}
                </div>

                {/* Packet details */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-[11px] font-mono mb-2">
                  <div><span className="text-slate-500">SRC:</span> <span className="text-white">{pkt.src}</span></div>
                  <div><span className="text-slate-500">PORT:</span> <span className="text-white">{pkt.port}</span></div>
                </div>

                {/* Payload */}
                <div className="bg-black/40 rounded-lg p-2 border border-slate-700">
                  <div className="text-[10px] text-slate-500 font-mono mb-1">PAYLOAD:</div>
                  <p className="text-xs text-white font-mono leading-relaxed break-all">{pkt.desc}</p>
                </div>
              </div>

              {/* Mini log */}
              {log.length > 0 && (
                <div className="flex gap-1 mt-2 justify-center">
                  {log.map(l => (
                    <span key={l.id} className={`w-4 h-4 rounded text-[8px] flex items-center justify-center font-bold ${l.ok ? 'bg-emerald-500/30 text-emerald-400' : 'bg-red-500/30 text-red-400'}`}>
                      {l.ok ? '✓' : '✗'}
                    </span>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ACTION BUTTONS ── */}
      {!fb && phase === 'play' && (
        <div className="flex justify-center gap-4 px-4 pb-3 z-10">
          <button onClick={() => decide('block')}
                  className="flex-1 max-w-[170px] py-2.5 rounded-xl font-pixel text-xs bg-red-600 hover:bg-red-500 text-white border-2 border-red-400 shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <Shield className="w-5 h-5" /> BLOCK
          </button>
          <button onClick={() => decide('allow')}
                  className="flex-1 max-w-[170px] py-2.5 rounded-xl font-pixel text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 shadow-[0_4px_0_#065f46] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <Lock className="w-5 h-5" /> ALLOW
          </button>
        </div>
      )}
    </div>
  );
};

export default SocialRoom;
