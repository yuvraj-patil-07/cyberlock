import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FEATURES = [
  { icon: '📧', title: 'Phishing Lab',         desc: 'Spot fake emails before they trap you' },
  { icon: '🔐', title: 'Password Vault',        desc: 'Build unbreakable passwords, defeat weak ones' },
  { icon: '🔳', title: 'QR Temple',             desc: 'Scan wisely — not every code is safe' },
  { icon: '🎭', title: 'Scam Market',           desc: 'Navigate scam messages and social tricks' },
  { icon: '🛡️', title: 'Firewall Defense',      desc: 'Block attacks and defend the server' },
  { icon: '🤖', title: 'Deepfake Detective',    desc: 'Detect AI-generated threats and voice cloning' },
  { icon: '👑', title: 'Final Cyber Castle',    desc: 'Expert multi-vector attack — the ultimate test' },
];

const STATS = [
  { value: '7',    label: 'Escape Rooms' },
  { value: '56+',  label: 'Challenges' },
  { value: '9',    label: 'Badges' },
  { value: 'AI',   label: 'Coach' },
];

function AboutModal({ onClose }) {
  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
        transition={{ type: 'spring', bounce: 0.25 }}
        style={{
          background: 'linear-gradient(135deg, #0a0d1a 0%, #111827 50%, #0d1b2a 100%)',
          border: '2px solid #06b6d4',
          borderRadius: '16px',
          padding: '2rem',
          maxWidth: '600px',
          width: '100%',
          boxShadow: '0 0 60px rgba(6,182,212,0.3)',
          maxHeight: '90vh',
          overflowY: 'auto',
        }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🛡️</div>
          <h2 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.9rem', color: '#06b6d4', marginBottom: '0.5rem' }}>
            HOW TO PLAY
          </h2>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: '20px', color: '#8892a4' }}>
            Escape the Scam. Outsmart the Attacker.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
          {[
            { icon: '❤️', title: 'Lives System', desc: 'You start with 3 lives. Wrong answers cost a life. Lose all 3 and the room resets.' },
            { icon: '🛡️', title: 'Trust Score', desc: 'Each correct answer builds your trust. Mistakes chip it away. Keep it above 60 to stay safe.' },
            { icon: '⚡', title: 'XP & Levels', desc: 'Earn XP for every correct answer. Find hidden evidence for bonus XP. Level up to unlock harder rooms.' },
            { icon: '🔍', title: 'Evidence', desc: 'Click highlighted elements to collect evidence clues. More evidence = more XP and better AI analysis.' },
            { icon: '🤖', title: 'AI Coach', desc: 'After each challenge, your AI Coach explains what went wrong and how to stay safer online.' },
            { icon: '🏆', title: 'Badges', desc: 'Complete rooms and achieve milestones to earn collector badges. Can you get all 9?' },
          ].map(step => (
            <div key={step.title} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start',
              background: 'rgba(255,255,255,0.03)', borderRadius: '10px', padding: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{step.icon}</span>
              <div>
                <p style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.5rem', color: '#e2e8f0', marginBottom: '0.25rem' }}>
                  {step.title}
                </p>
                <p style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#8892a4', lineHeight: '1.4' }}>
                  {step.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <button onClick={onClose} style={{
          width: '100%', padding: '0.75rem',
          background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
          border: 'none', borderRadius: '8px', color: 'white',
          fontFamily: "'Press Start 2P', monospace", fontSize: '0.6rem', cursor: 'pointer',
          letterSpacing: '1px',
        }}>
          ⚔️ LET&apos;S PLAY
        </button>
      </motion.div>
    </motion.div>
  );
}

export default function Landing() {
  const navigate = useNavigate();
  const [showAbout, setShowAbout] = useState(false);

  return (
    <div className="min-h-screen relative overflow-x-hidden"
         style={{ background: 'linear-gradient(180deg, #0a0d1a 0%, #111827 40%, #0a1520 100%)' }}>

      {/* Animated grid background */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: 0.07 }}>
        <div style={{
          backgroundImage: 'linear-gradient(#06b6d4 1px, transparent 1px), linear-gradient(90deg, #06b6d4 1px, transparent 1px)',
          backgroundSize: '60px 60px', width: '100%', height: '100%',
        }} />
      </div>

      {/* Floating particles */}
      {['💀','🔐','⚠️','🛡️','🔳','📧'].map((e, i) => (
        <motion.div key={i} className="absolute text-2xl pointer-events-none select-none"
          style={{ left: `${10 + i * 16}%`, top: `${20 + (i % 3) * 20}%`, opacity: 0.12 }}
          animate={{ y: [0, -20, 0], rotate: [0, 10, -10, 0] }}
          transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.8 }}>
          {e}
        </motion.div>
      ))}

      {/* Hero Section */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 text-center pt-16 pb-24">

        {/* Badge */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <span style={{
            background: 'rgba(6,182,212,0.15)', border: '1px solid #06b6d4', borderRadius: '100px',
            padding: '0.25rem 0.75rem', color: '#06b6d4', fontFamily: "'Press Start 2P', monospace",
            fontSize: '0.45rem', letterSpacing: '2px',
          }}>
            🛡 AI-POWERED CYBERSECURITY GAME
          </span>
        </motion.div>

        {/* Title */}
        <motion.div className="mt-6 mb-4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
          transition={{ type: 'spring', bounce: 0.4, delay: 0.3 }}>
          <h1 style={{
            fontFamily: "'Press Start 2P', monospace",
            fontSize: 'clamp(2.5rem, 10vw, 5rem)',
            fontWeight: 900,
            background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            textShadow: 'none',
            lineHeight: 1.1,
            letterSpacing: '-0.02em',
          }}>
            CYBER<br />LOCK
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          style={{ fontFamily: "'VT323', monospace", fontSize: '26px', color: '#94a3b8', marginBottom: '2.5rem', maxWidth: '400px' }}>
          Escape the Scam. Outsmart the Attacker.<br />Learn real cybersecurity skills — the fun way.
        </motion.p>

        {/* Stats Row */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          style={{ display: 'flex', gap: '2rem', marginBottom: '2.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {STATS.map(s => (
            <div key={s.label} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '1.2rem', color: '#ffd700' }}>{s.value}</div>
              <div style={{ fontFamily: "'VT323', monospace", fontSize: '16px', color: '#64748b', marginTop: '0.2rem' }}>{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1rem' }}>
          <button onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none', borderRadius: '10px', color: 'white', padding: '0.9rem 2rem',
              fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem', cursor: 'pointer',
              letterSpacing: '1px', boxShadow: '0 0 30px rgba(6,182,212,0.4)',
              transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(6,182,212,0.6)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 0 30px rgba(6,182,212,0.4)'; }}>
            ⚔ START GAME
          </button>
          <button onClick={() => navigate('/login')}
            style={{
              background: 'transparent', border: '2px solid #3d4f7c', borderRadius: '10px', color: '#94a3b8',
              padding: '0.9rem 2rem', fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem', cursor: 'pointer',
              letterSpacing: '1px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#06b6d4'; e.currentTarget.style.color = '#06b6d4'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4f7c'; e.currentTarget.style.color = '#94a3b8'; }}>
            🔑 LOGIN
          </button>
          <button onClick={() => setShowAbout(true)}
            style={{
              background: 'transparent', border: '2px solid #3d4f7c', borderRadius: '10px', color: '#94a3b8',
              padding: '0.9rem 2rem', fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem', cursor: 'pointer',
              letterSpacing: '1px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#8b5cf6'; e.currentTarget.style.color = '#8b5cf6'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4f7c'; e.currentTarget.style.color = '#94a3b8'; }}>
            📖 HOW TO PLAY
          </button>
          <button onClick={() => navigate('/settings')}
            style={{
              background: 'transparent', border: '2px solid #3d4f7c', borderRadius: '10px', color: '#94a3b8',
              padding: '0.9rem 2rem', fontFamily: "'Press Start 2P', monospace", fontSize: '0.65rem', cursor: 'pointer',
              letterSpacing: '1px', transition: 'all 0.2s', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#10b981'; e.currentTarget.style.color = '#10b981'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4f7c'; e.currentTarget.style.color = '#94a3b8'; }}>
            ⚙ SETTINGS
          </button>
        </motion.div>
      </div>

      {/* Features Grid */}
      <div className="relative z-10 pb-24 px-4 max-w-5xl mx-auto">
        <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
          style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', color: '#e2e8f0',
            textAlign: 'center', marginBottom: '2rem', letterSpacing: '2px' }}>
          7 ROOMS TO MASTER
        </motion.h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
          {FEATURES.map((f, i) => (
            <motion.div key={f.title}
              initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              whileHover={{ scale: 1.03, y: -4 }}
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px', padding: '1.25rem',
                backdropFilter: 'blur(10px)',
                cursor: 'default',
                transition: 'border-color 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(6,182,212,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{f.icon}</div>
              <h3 style={{ fontFamily: "'Press Start 2P', monospace", fontSize: '0.55rem', color: '#e2e8f0', marginBottom: '0.5rem' }}>
                {f.title}
              </h3>
              <p style={{ fontFamily: "'VT323', monospace", fontSize: '17px', color: '#64748b', lineHeight: '1.5' }}>
                {f.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          style={{ textAlign: 'center', marginTop: '3rem' }}>
          <button onClick={() => navigate('/register')}
            style={{
              background: 'linear-gradient(135deg, #06b6d4, #3b82f6)',
              border: 'none', borderRadius: '12px', color: 'white', padding: '1rem 3rem',
              fontFamily: "'Press Start 2P', monospace", fontSize: '0.7rem', cursor: 'pointer',
              letterSpacing: '1px', boxShadow: '0 0 40px rgba(6,182,212,0.5)',
            }}
            onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}>
            🛡️ BEGIN YOUR TRAINING
          </button>
          <p style={{ fontFamily: "'VT323', monospace", fontSize: '18px', color: '#475569', marginTop: '1rem' }}>
            Free to play · No download needed · Works on any device
          </p>
        </motion.div>
      </div>

      {/* About Modal */}
      <AnimatePresence>
        {showAbout && <AboutModal onClose={() => setShowAbout(false)} />}
      </AnimatePresence>
    </div>
  );
}
