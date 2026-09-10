import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Shield, Lock, QrCode, MessageSquare, Users, Bot, KeyRound, Sparkles, ArrowRight, Play, Eye } from 'lucide-react';
import Navbar from '../components/layout/Navbar';

const THREATS = [
  { icon: Shield, title: 'PHISHING', desc: 'Identify deceptive typo-squatted emails, fake login gateways, and malicious attachments.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
  { icon: Lock, title: 'PASSWORDS', desc: 'Master password entropy, Passkeys, MFA hardening, and prevent credential stuffing.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: QrCode, title: 'QR TRAPS', desc: 'Avoid sticker overlays, quishing emails, and rogue root configuration profiles.', color: 'text-indigo-600', bg: 'bg-indigo-50' },
  { icon: MessageSquare, title: 'SCAM MESSAGES', desc: 'Spot smishing, task scams, pig butchering, and fake emergency wire traps.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Users, title: 'SOCIAL ENGINEERING', desc: 'Resist tailgating, executive authority pressure, and USB drop baiting.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Bot, title: 'AI THREATS', desc: 'Detect deepfake CEO voice clones, document prompt injections, and AI slopsquatting.', color: 'text-purple-600', bg: 'bg-purple-50' },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 overflow-hidden relative font-sans">
      <Navbar />

      {/* Ambient backgrounds */}
      <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-cyan-200/50 blur-[120px] pointer-events-none" />
      <div className="absolute top-1/3 -right-40 w-96 h-96 rounded-full bg-indigo-200/40 blur-[120px] pointer-events-none" />

      {/* Hero Section */}
      <div className="relative z-10 container mx-auto px-6 pt-36 pb-20 flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs mb-6 shadow-sm font-bold"
        >
          <Sparkles size={14} className="text-cyan-600" /> IMMERSIVE AI-POWERED CYBERSECURITY ESCAPE ROOM
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-black tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-cyan-700"
        >
          CYBERLOCK
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="text-2xl md:text-3xl font-semibold text-slate-700 mb-6 tracking-tight max-w-3xl"
        >
          "Escape the Scam. Outsmart the Attacker."
        </motion.p>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="max-w-2xl text-slate-600 mb-10 text-sm md:text-base leading-relaxed font-medium"
        >
          An interactive cybersecurity escape room that trains you to recognize the threats hiding in everyday digital life — featuring dynamic AI Attackers, an AI Security Coach, and real-time Cyber DNA profiling.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button onClick={() => navigate('/register')} className="btn-primary text-base md:text-lg px-8 py-4 shadow-lg shadow-cyan-600/20">
            START THE ESCAPE
          </button>
          <button onClick={() => navigate('/demo')} className="btn-ghost text-base md:text-lg px-8 py-4 border-indigo-300 text-indigo-700 hover:bg-indigo-50">
            <Eye size={18} className="inline mr-2 text-indigo-600" /> HACKATHON DEMO MODE
          </button>
          <button onClick={() => document.getElementById('how-it-works').scrollIntoView({ behavior: 'smooth' })} className="btn-ghost text-base md:text-lg px-8 py-4">
            HOW IT WORKS
          </button>
        </motion.div>
      </div>

      {/* Threat Categories Matrix */}
      <div className="relative z-10 container mx-auto px-6 py-20">
        <div className="text-center mb-16 space-y-2">
          <span className="text-xs font-mono font-bold text-cyan-700 uppercase tracking-widest bg-cyan-50 px-3 py-1 rounded-full border border-cyan-200">
            THREAT LANDSCAPE SIMULATOR
          </span>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
            MASTER EVERY MODERN THREAT
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {THREATS.map((threat, i) => (
            <motion.div 
              key={threat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="bg-white rounded-3xl p-6 border border-slate-200 hover:border-cyan-400 hover:shadow-lg transition-all group shadow-sm text-slate-800"
            >
              <div className={`w-12 h-12 rounded-2xl ${threat.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <threat.icon className={`w-6 h-6 ${threat.color}`} />
              </div>
              <h3 className="text-lg font-bold mb-2 text-slate-900">{threat.title}</h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed">{threat.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* How it Works / Core Loop */}
      <div id="how-it-works" className="relative z-10 bg-white py-24 border-y border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16 space-y-2">
            <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-widest bg-indigo-50 px-3 py-1 rounded-full border border-indigo-200">
              ADAPTIVE GAMEPLAY LOOP
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 mt-2">
              HOW CYBERLOCK WORKS
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 max-w-5xl mx-auto text-center">
            {[
              { title: '1. Receive Threat', desc: 'AI Attacker creates a customized scenario targeting your weak areas.' },
              { title: '2. Investigate Clues', desc: 'Examine sender headers, decoded QR URLs, entropy, and social pretexts.' },
              { title: '3. Make Decision', desc: 'Classify threat and state your reasoning to prove cognitive understanding.' },
              { title: '4. AI Coach Feedback', desc: 'Review consequence chain, get coach analysis, and build your Cyber DNA.' }
            ].map((step, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-3xl p-6 flex flex-col items-center shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-cyan-100 border border-cyan-200 flex items-center justify-center font-mono font-bold text-cyan-800 mb-4 shadow-sm">
                  0{i + 1}
                </div>
                <h4 className="text-base font-bold text-slate-900 mb-2">{step.title}</h4>
                <p className="text-xs text-slate-600 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Footer */}
      <div className="relative z-10 container mx-auto px-6 py-28 text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Ready to test your cyber awareness?
        </h2>
        <p className="text-slate-600 max-w-md mx-auto text-sm">
          Join thousands of trainees sharpening their digital defenses against real-world manipulation.
        </p>
        <div>
          <button onClick={() => navigate('/register')} className="btn-primary text-lg px-10 py-5 shadow-lg shadow-cyan-600/25">
            ENTER CYBERLOCK NOW
          </button>
        </div>
      </div>
    </div>
  );
}

