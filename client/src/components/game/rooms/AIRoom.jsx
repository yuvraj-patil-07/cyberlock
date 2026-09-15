import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Scan, Zap, CheckCircle, XCircle } from 'lucide-react';

/* ═══════════════════════════════════════════════════
   DEEPFAKE DETECTIVE — 10 self-contained AI-forensics
   scenarios. Player rapidly classifies content as
   REAL (authentic) or FAKE (AI-generated).
   ═══════════════════════════════════════════════════ */

const DEEPFAKE_ITEMS = [
  {
    id: 1,
    category: '🎙 Voice Clone',
    content: `CEO calls at 5:15 PM: "I'm at the airport — transfer $250K to this escrow NOW. The portal is glitching, so wire it manually. Deal closes in 20 minutes."`,
    verdict: 'fake',
    explanation: 'AI voice clones replicate speech from short audio samples. Urgency to bypass security protocols is a classic fraud indicator.'
  },
  {
    id: 2,
    category: '📧 AI Phishing',
    content: `"Dear User, We detected unauthorized access at 14:32 UTC. Verify identity immediately: https://amaz0n-security.support/verify"`,
    verdict: 'fake',
    explanation: 'AI-generated phishing with perfect grammar. The typosquatted domain "amaz0n" (zero instead of "o") reveals the scam.'
  },
  {
    id: 3,
    category: '📱 SMS Alert',
    content: `"Your package #1Z999AA10123456784 has been delivered to your front door. — UPS Notifications"`,
    verdict: 'real',
    explanation: 'Standard delivery notification with a valid tracking format. No urgency, no suspicious links, no credential requests.'
  },
  {
    id: 4,
    category: '🎥 Deepfake Call',
    content: `CFO on Zoom: "We're restructuring payroll — wire deposits to this new account. Don't loop in HR yet — it's confidential."`,
    verdict: 'fake',
    explanation: 'Deepfake video impersonates executives in real-time. "Don\'t tell HR" is a social isolation tactic used in business fraud.'
  },
  {
    id: 5,
    category: '🤖 AI Chatbot',
    content: `[IT Help Desk Chat]: "Hi! Your workstation flagged a critical zero-day. I need your admin password to deploy the emergency patch remotely."`,
    verdict: 'fake',
    explanation: 'IT support never requests passwords. This is an AI chatbot impersonating staff to harvest credentials.'
  },
  {
    id: 6,
    category: '📰 AI News',
    content: `"BREAKING: Company CEO arrested by FBI for insider trading. Stock crashes 40%. Click for the full investigation report →"`,
    verdict: 'fake',
    explanation: 'AI-generated disinformation to manipulate stock prices and cause panic. Always verify with official sources.'
  },
  {
    id: 7,
    category: '🔔 System Notice',
    content: `"[Automated] Your MFA enrollment expires in 7 days. Visit yourcompany.okta.com/settings to re-enroll. — IT Security"`,
    verdict: 'real',
    explanation: 'Legitimate automated reminder from an official Okta domain. Informational, no urgency or credential harvesting.'
  },
  {
    id: 8,
    category: '🎙 Vishing',
    content: `Voicemail: "Account locked due to suspicious activity. Press 1 NOW to reach our fraud team or your account will be permanently closed in 1 hour."`,
    verdict: 'fake',
    explanation: 'Banks never threaten account closure via voicemail. Urgency + "Press 1" is a classic AI vishing pattern.'
  },
  {
    id: 9,
    category: '📧 Newsletter',
    content: `"Monthly Security Digest: Your password was changed 45 days ago. Policy requires rotation every 90 days. No action needed now. — Security Team"`,
    verdict: 'real',
    explanation: 'Informational newsletter — no links, no urgency, no action required. Standard corporate communication.'
  },
  {
    id: 10,
    category: '🎥 Deepfake Interview',
    content: `A "journalist" video-calls your VP: "Confirm the merger — we publish at 6 PM. Click the DocuSign link I'm sending now to approve the draft."`,
    verdict: 'fake',
    explanation: 'Deepfake journalists use social pressure to extract confidential info. Real journalists don\'t send DocuSign links mid-interview.'
  }
];

const TOTAL = DEEPFAKE_ITEMS.length;
const TIME_PER_ITEM = 10; // seconds

const AIRoom = ({ challenge, onComplete, onFeedback }) => {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [correct, setCorrect] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_ITEM);
  const [streak, setStreak] = useState(0);
  const [fb, setFb] = useState(null);          // per-item feedback
  const [phase, setPhase] = useState('play');   // 'play' | 'done'

  const item = DEEPFAKE_ITEMS[idx];

  /* ── Timer ── */
  useEffect(() => {
    if (phase !== 'play' || fb) return;
    if (timeLeft <= 0) { answer('timeout'); return; }
    const t = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(t);
  }, [timeLeft, phase, fb]);

  /* reset on new item */
  useEffect(() => { if (phase === 'play') { setTimeLeft(TIME_PER_ITEM); setFb(null); } }, [idx, phase]);

  /* ── Answer handler ── */
  const answer = useCallback((v) => {
    if (fb || phase !== 'play') return;
    const ok = v === item.verdict;

    if (ok) {
      const bonus = streak >= 2 ? 5 : 0;
      setScore(p => p + 15 + bonus);
      setStreak(p => p + 1);
      setCorrect(p => p + 1);
      setFb({ ok: true, txt: streak >= 2 ? '🔥 STREAK +20' : '✓ CORRECT +15' });
    } else {
      setLives(p => p - 1);
      setStreak(0);
      setFb({ ok: false, txt: v === 'timeout' ? '⏰ TOO SLOW' : '✗ WRONG' });
    }
    if (onFeedback) onFeedback({ isCorrect: ok, text: item.explanation });

    setTimeout(() => {
      const newLives = ok ? lives : lives - 1;
      if (newLives <= 0 || idx + 1 >= TOTAL) { setPhase('done'); return; }
      setIdx(p => p + 1);
    }, 2000);
  }, [fb, phase, item, idx, lives, streak, onFeedback]);

  /* ── Finish handler ── */
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
           style={{ background: 'linear-gradient(180deg,#0a0e1a,#1a1040)' }}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', bounce: 0.5 }}>
          <span className="text-5xl block mb-1">{passed ? '🧠' : '💀'}</span>
        </motion.div>
        <h2 className="font-pixel text-base text-white">{passed ? 'NEURAL SCAN COMPLETE' : 'NEURAL BREACH'}</h2>
        <p className="text-xs text-slate-400 max-w-xs">
          {passed ? 'You successfully identified the deepfakes!' : 'The AI deceived you. Train harder, agent.'}
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
            <div className="text-xl font-bold text-yellow-400">{lives}</div>
            <div className="text-[10px] text-slate-500">LIVES LEFT</div>
          </div>
        </div>
        <button onClick={finish} className="pixel-btn pixel-btn-primary px-8 py-2 text-xs">
          {passed ? '✓ COMPLETE ROOM' : '← RETURN TO MAP'}
        </button>
      </div>
    );
  }

  /* ════════ GAME UI ════════ */
  const timerPct = (timeLeft / TIME_PER_ITEM) * 100;

  return (
    <div className="flex flex-col h-full relative overflow-hidden"
         style={{ background: 'linear-gradient(180deg,#0a0e1a,#1a1040)' }}>

      {/* background dots */}
      <div className="absolute inset-0 pointer-events-none opacity-10"
           style={{ backgroundImage: 'radial-gradient(circle,#6366f1 1px,transparent 1px)', backgroundSize: '30px 30px' }} />

      {/* ── TOP BAR ── */}
      <div className="flex items-center justify-between px-3 py-1.5 bg-black/40 border-b border-cyan-500/20 z-10">
        <div className="flex items-center gap-1.5">
          <Brain className="w-4 h-4 text-cyan-400" />
          <span className="font-pixel text-[10px] text-cyan-300">SCAN {idx + 1}/{TOTAL}</span>
        </div>
        <div className="flex items-center gap-0.5">
          {[0, 1, 2].map(i => <span key={i} className={`text-sm ${i < lives ? '' : 'opacity-20 grayscale'}`}>❤️</span>)}
        </div>
        <div className="flex items-center gap-1">
          <Zap className="w-3 h-3 text-yellow-400" />
          <span className="font-pixel text-[10px] text-yellow-300">{score} XP</span>
          {streak >= 2 && <span className="font-pixel text-[10px] text-orange-400 ml-1">🔥x{streak}</span>}
        </div>
      </div>

      {/* ── TIMER BAR ── */}
      <div className="h-1 bg-slate-800 z-10">
        <motion.div className="h-full rounded-r"
                    style={{ background: timeLeft <= 3 ? '#ef4444' : '#22d3ee', width: `${timerPct}%` }}
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
              <p className="text-[11px] text-slate-300 mt-2 max-w-sm leading-relaxed">{item.explanation}</p>
            </motion.div>
          ) : (
            <motion.div key={`i-${idx}`} initial={{ x: 80, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -80, opacity: 0 }} transition={{ type: 'spring', stiffness: 200 }}
                        className="w-full max-w-lg">
              {/* category badge */}
              <div className="text-center mb-2">
                <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {item.category}
                </span>
              </div>
              {/* content card */}
              <div className="bg-slate-800/80 border border-slate-600 rounded-xl p-3 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-1.5 mb-2 text-slate-500 text-[10px] font-mono">
                  <Scan className="w-3 h-3" /> INTERCEPTED — CLASSIFY:
                </div>
                <p className="text-sm text-white leading-relaxed font-mono">{item.content}</p>
              </div>
              {/* scanning line */}
              <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
                          className="h-0.5 bg-cyan-400 mt-2 rounded-full shadow-[0_0_10px_#22d3ee]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── ACTION BUTTONS ── */}
      {!fb && phase === 'play' && (
        <div className="flex justify-center gap-4 px-4 pb-3 z-10">
          <button onClick={() => answer('real')}
                  className="flex-1 max-w-[170px] py-2.5 rounded-xl font-pixel text-xs bg-emerald-600 hover:bg-emerald-500 text-white border-2 border-emerald-400 shadow-[0_4px_0_#065f46] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <CheckCircle className="w-5 h-5" /> REAL
          </button>
          <button onClick={() => answer('fake')}
                  className="flex-1 max-w-[170px] py-2.5 rounded-xl font-pixel text-xs bg-red-600 hover:bg-red-500 text-white border-2 border-red-400 shadow-[0_4px_0_#7f1d1d] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center gap-2">
            <XCircle className="w-5 h-5" /> FAKE
          </button>
        </div>
      )}
    </div>
  );
};

export default AIRoom;
