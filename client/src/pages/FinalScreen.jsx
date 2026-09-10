import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';
import Button from '../components/common/Button';
import { 
  Award, ShieldCheck, Zap, Sparkles, Trophy, ArrowRight, RefreshCw, 
  Target, Clock, Heart, Flame 
} from 'lucide-react';

export default function FinalScreen() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dna, setDna] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await gameService.getCyberDNA();
        setDna(res.data);
      } catch (err) {
        console.error('Error fetching final stats:', err);
      }
    };
    fetchStats();
  }, []);

  const cyberScore = dna?.overallScore || user?.cyberScore || 87;
  const threatsDetected = dna?.totalThreatsDetected || user?.totalChallengesAttempted || 17;
  const correctDecisions = dna?.correctDecisions || user?.totalCorrect || 15;
  const evidenceFound = dna?.evidenceFoundCount || 31;
  const improvement = dna?.improvementPct || 34;
  const strongestSkill = dna?.strongestSkill?.label || 'Password Hygiene';
  const weakestSkill = dna?.weakestSkill?.label || 'AI Threat Awareness';

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans text-slate-800">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-cyan-100/50 via-purple-50/50 to-slate-50 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 max-w-3xl w-full space-y-8"
      >
        {/* Celebration Header */}
        <div className="text-center space-y-3">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
            className="w-24 h-24 bg-gradient-to-tr from-amber-100 via-yellow-100 to-emerald-100 border-2 border-yellow-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg animate-pulse"
          >
            <Sparkles className="w-12 h-12 text-yellow-600" />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 font-mono text-xs tracking-widest uppercase font-bold">
            🏆 MASTER CYBER SENTINEL UNLOCKED
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-600 via-indigo-600 to-purple-600 tracking-tight">
            YOU ESCAPED CYBERLOCK
          </h1>
          <p className="text-sm md:text-base text-slate-600 max-w-lg mx-auto">
            You successfully navigated digital deception, investigated forensic evidence, and outsmarted the adaptive threat engine.
          </p>
        </div>

        {/* Core Stats Dashboard Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-3xl border border-slate-200 p-6 md:p-8 shadow-xl space-y-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4 text-center">
            <div className="bg-cyan-50/60 p-3 rounded-2xl border border-cyan-200">
              <span className="text-[10px] font-mono text-cyan-800 font-bold uppercase block mb-1">CYBER SCORE</span>
              <span className="text-2xl md:text-3xl font-black text-cyan-700 font-mono">{cyberScore}</span>
              <span className="text-[10px] text-cyan-600 block">/ 100</span>
            </div>

            <div className="bg-purple-50/60 p-3 rounded-2xl border border-purple-200">
              <span className="text-[10px] font-mono text-purple-800 font-bold uppercase block mb-1">THREATS SCANNED</span>
              <span className="text-2xl md:text-3xl font-black text-purple-700 font-mono">{threatsDetected}</span>
              <span className="text-[10px] text-purple-600 block">Scenarios</span>
            </div>

            <div className="bg-emerald-50/60 p-3 rounded-2xl border border-emerald-200">
              <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase block mb-1">ACCURACY</span>
              <span className="text-2xl md:text-3xl font-black text-emerald-700 font-mono">{correctDecisions}</span>
              <span className="text-[10px] text-emerald-600 block">Correct</span>
            </div>

            <div className="bg-amber-50/60 p-3 rounded-2xl border border-amber-200">
              <span className="text-[10px] font-mono text-amber-800 font-bold uppercase block mb-1">EVIDENCE LOGGED</span>
              <span className="text-2xl md:text-3xl font-black text-amber-700 font-mono">{evidenceFound}</span>
              <span className="text-[10px] text-amber-600 block">Indicators</span>
            </div>

            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200">
              <span className="text-[10px] font-mono text-slate-700 font-bold uppercase block mb-1">TIME TAKEN</span>
              <span className="text-2xl md:text-3xl font-black text-slate-800 font-mono">06:42</span>
              <span className="text-[10px] text-slate-500 block">Minutes</span>
            </div>

            <div className="bg-green-50 p-3 rounded-2xl border border-green-200">
              <span className="text-[10px] font-mono text-green-800 font-bold uppercase block mb-1">IMPROVEMENT</span>
              <span className="text-2xl md:text-3xl font-black text-green-700 font-mono">+{improvement}%</span>
              <span className="text-[10px] text-green-600 block">Skill Gain</span>
            </div>
          </div>

          {/* DNA Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <ShieldCheck size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-emerald-800 font-bold uppercase tracking-widest block">STRONGEST COGNITIVE SKILL</span>
                <p className="text-sm font-bold text-slate-900">{strongestSkill}</p>
              </div>
            </div>

            <div className="p-4 bg-purple-50 border border-purple-200 rounded-2xl flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 shrink-0">
                <Target size={22} />
              </div>
              <div>
                <span className="text-[10px] font-mono text-purple-800 font-bold uppercase tracking-widest block">RECOMMENDED FOCUS AREA</span>
                <p className="text-sm font-bold text-slate-900">{weakestSkill}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button variant="primary" size="lg" onClick={() => navigate('/cyber-dna')}>
            VIEW FULL CYBER DNA
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/rooms')}>
            TRAIN MY WEAKNESS
          </Button>
          <Button variant="ghost" size="lg" onClick={() => navigate('/dashboard')}>
            COMMAND CENTER
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
