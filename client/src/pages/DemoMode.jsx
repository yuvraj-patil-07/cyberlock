import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../components/common/Button';
import { 
  Sparkles, Shield, QrCode, Bot, Activity, Award, CheckCircle, 
  ArrowRight, Play, RefreshCw, Cpu, Trophy, Zap 
} from 'lucide-react';
import { aiService } from '../services/aiService';

export default function DemoMode() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(1);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiChallenge, setAiChallenge] = useState(null);
  const [aiCoachFeedback, setAiCoachFeedback] = useState(null);

  const triggerAIGen = async () => {
    try {
      setAiLoading(true);
      const res = await aiService.generateChallenge('ai-threat', 'advanced', 'voice-cloning');
      setAiChallenge(res.data.challenge);
      const coachRes = await aiService.analyzePerformance();
      setAiCoachFeedback(coachRes.data);
      setActiveStep(3);
    } catch (err) {
      console.error(err);
      setActiveStep(3);
    } finally {
      setAiLoading(false);
    }
  };

  const steps = [
    { num: 1, title: 'PHISHING ROOM', icon: Shield, desc: 'Interactive Email Inbox Simulator with typo-squatted headers and evidence inspection.' },
    { num: 2, title: 'QR TRAP SIMULATOR', icon: QrCode, desc: 'Optical QR scanner with physical sticker overlay and APK dropper detection.' },
    { num: 3, title: 'AI ATTACKER GENERATOR', icon: Bot, desc: 'Live generative AI engine crafting harmless adaptive threat scenarios.' },
    { num: 4, title: 'AI SECURITY COACH', icon: Cpu, desc: 'Personalized reasoning feedback, cognitive bias diagnostics, and dynamic hints.' },
    { num: 5, title: 'CYBER DNA PROFILE', icon: Activity, desc: 'Multi-vector cognitive defense matrix and learning progress metrics.' },
    { num: 6, title: 'MASTER ESCAPE & LEADERBOARD', icon: Trophy, desc: 'Final Cyber Lock resolution, Cyber Sentinel badge, and rankings.' }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-slate-800 font-sans relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-cyan-100/60 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-100/60 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-4xl w-full space-y-8 py-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs uppercase tracking-widest font-bold shadow-sm">
            <Sparkles size={14} className="text-cyan-600" /> HACKATHON EVALUATION MODE
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            CYBERLOCK JUDGE DEMO
          </h1>
          <p className="text-slate-600 text-sm md:text-base max-w-2xl mx-auto font-medium">
            Experience the 6 core pillars of CYBERLOCK: From evidence-based investigation to adaptive AI generation, cognitive coaching, and Cyber DNA.
          </p>
        </div>

        {/* 6 Step Interactive Tour Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => (
            <motion.div
              key={s.num}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (s.num === 1) navigate('/play/1');
                else if (s.num === 2) navigate('/play/3');
                else if (s.num === 3) triggerAIGen();
                else if (s.num === 4) triggerAIGen();
                else if (s.num === 5) navigate('/cyber-dna');
                else if (s.num === 6) navigate('/final');
              }}
              className="bg-white border border-slate-200 p-5 rounded-3xl cursor-pointer hover:border-cyan-400 hover:shadow-lg transition-all group flex flex-col justify-between shadow-sm"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-2xl bg-cyan-50 text-cyan-600 border border-cyan-200 flex items-center justify-center group-hover:bg-cyan-100 transition-colors">
                    <s.icon size={20} />
                  </div>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-lg bg-slate-100 text-slate-600 border border-slate-200">
                    STEP 0{s.num}
                  </span>
                </div>
                <h3 className="font-bold text-sm text-slate-900 group-hover:text-cyan-700 transition-colors">{s.title}</h3>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">{s.desc}</p>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-mono font-bold text-cyan-700">
                <span>LAUNCH STEP</span>
                <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          ))}
        </div>

        {/* AI Generator Live Demo Output If Triggered */}
        {aiLoading && (
          <div className="p-6 bg-purple-50 border border-purple-200 rounded-3xl text-center space-y-2 animate-pulse shadow-sm">
            <Bot className="w-8 h-8 text-purple-600 mx-auto animate-spin" />
            <p className="font-mono text-sm font-bold text-purple-800">AI ATTACKER GENERATING ADAPTIVE THREAT SCENARIO...</p>
          </div>
        )}

        {aiChallenge && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-6 bg-white border border-purple-200 rounded-3xl shadow-xl space-y-4 text-slate-800"
          >
            <div className="flex items-center justify-between pb-3 border-b border-purple-100">
              <div className="flex items-center gap-2 text-purple-700 font-bold text-sm">
                <Bot size={18} />
                <span>DYNAMICALLY GENERATED AI CHALLENGE: {aiChallenge.title}</span>
              </div>
              <span className="text-[10px] font-mono font-bold px-2.5 py-1 bg-purple-100 text-purple-800 rounded-lg border border-purple-200">
                {aiChallenge.difficulty?.toUpperCase()}
              </span>
            </div>

            <p className="text-xs text-slate-700 font-mono bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {aiChallenge.scenario?.body || aiChallenge.explanation}
            </p>

            {aiCoachFeedback && (
              <div className="p-4 bg-purple-50 rounded-2xl border border-purple-100 text-xs space-y-1">
                <span className="font-bold text-purple-800 uppercase block font-mono">AI Coach Directive:</span>
                <p className="text-slate-700">{aiCoachFeedback.summary || aiCoachFeedback.actionableTip}</p>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button variant="primary" onClick={() => navigate(`/play/${aiChallenge.room || 6}`)}>
                PLAY THIS AI MISSION →
              </Button>
            </div>
          </motion.div>
        )}

        {/* Action Controls */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button variant="primary" size="lg" onClick={() => navigate('/play/1')}>
            START GUIDED ESCAPE (STEP 1)
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
            ENTER PLAYER DASHBOARD
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/admin')}>
            ADMIN ANALYTICS
          </Button>
        </div>
      </div>
    </div>
  );
}

