import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { 
  Activity, ShieldAlert, Target, Award, ArrowRight, TrendingUp, 
  Sparkles, ShieldCheck, Zap, RefreshCw, AlertTriangle 
} from 'lucide-react';

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
      } catch (err) {
        console.error('Failed to load Cyber DNA:', err);
        // Fallback DNA data
        setDna({
          categories: [
            { key: 'phishing', label: 'Phishing Awareness', score: user?.skillProfile?.phishing || 75, color: '#0891b2' },
            { key: 'passwords', label: 'Password Hygiene', score: user?.skillProfile?.passwords || 85, color: '#059669' },
            { key: 'qrSafety', label: 'QR Safety', score: user?.skillProfile?.qrSafety || 60, color: '#7c3aed' },
            { key: 'scamDetection', label: 'Scam Detection', score: user?.skillProfile?.scamDetection || 70, color: '#d97706' },
            { key: 'socialEngineering', label: 'Social Engineering Resistance', score: user?.skillProfile?.socialEngineering || 65, color: '#e11d48' },
            { key: 'aiThreats', label: 'AI Threat Awareness', score: user?.skillProfile?.aiThreats || 50, color: '#4f46e5' },
            { key: 'digitalPrivacy', label: 'Digital Privacy', score: user?.skillProfile?.digitalPrivacy || 70, color: '#2563eb' }
          ],
          overallScore: user?.cyberScore || 70,
          riskLevel: 'medium',
          riskLabel: 'Educational Cyber Risk: MEDIUM',
          strongestSkill: { label: 'Password Hygiene', score: 85 },
          weakestSkill: { label: 'AI Threat Awareness', score: 50 },
          mostImprovedSkill: { label: 'Phishing Awareness', score: 75 },
          improvementPct: 34,
          firstScore: 46,
          currentScore: 70
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDNA();
  }, [user]);

  const categories = dna?.categories || [];
  const riskLevel = (dna?.riskLevel || 'medium').toLowerCase();

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'low': return 'text-emerald-700 border-emerald-300 bg-emerald-50';
      case 'medium': return 'text-amber-700 border-amber-300 bg-amber-50';
      case 'high': return 'text-orange-700 border-orange-300 bg-orange-50';
      case 'critical': return 'text-rose-700 border-rose-300 bg-rose-50';
      default: return 'text-cyan-700 border-cyan-300 bg-cyan-50';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-12 pt-28 space-y-8">
        {/* Page Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-purple-700 font-mono text-xs mb-2 font-bold shadow-sm">
              <Sparkles size={14} className="text-purple-600" /> ADAPTIVE COGNITIVE SECURITY METRICS
            </div>
            <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              YOUR CYBER DNA
            </h1>
            <p className="text-slate-600 text-sm mt-1 font-medium">
              Multi-dimensional analysis of your cyber resilience, cognitive reflexes, and threat detection acumen.
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              DASHBOARD
            </Button>
            <Button variant="primary" onClick={() => navigate('/rooms')}>
              ENTER ESCAPE ROOMS
            </Button>
          </div>
        </div>

        {/* Top 3 Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Risk Level Card */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-purple-500 to-indigo-500" />
            <Activity className="w-10 h-10 text-purple-600 mb-3" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">EDUCATIONAL CYBER RISK</span>
            <div className={`px-4 py-1.5 rounded-full text-2xl font-black border font-mono uppercase mb-2 ${getRiskColor(riskLevel)}`}>
              {riskLevel} RISK
            </div>
            <p className="text-[11px] text-slate-500 max-w-xs mt-1">
              Educational assessment score — not a professional security audit.
            </p>
          </div>

          {/* Overall Cyber Score */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 to-emerald-500" />
            <ShieldCheck className="w-10 h-10 text-cyan-600 mb-3" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">OVERALL CYBER SCORE</span>
            <div className="text-4xl font-black text-cyan-700 font-mono">
              {dna?.overallScore || 50} <span className="text-lg text-slate-400 font-normal">/ 100</span>
            </div>
            <span className="text-xs text-emerald-700 font-mono font-bold mt-1 flex items-center gap-1">
              <TrendingUp size={14} className="text-emerald-600" /> +{dna?.improvementPct || 0}% Improvement
            </span>
          </div>

          {/* Learning Progress / Improvement */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-amber-500 to-rose-500" />
            <Zap className="w-10 h-10 text-amber-600 mb-3" />
            <span className="text-xs font-mono font-bold text-slate-500 uppercase tracking-widest mb-1">SKILL EVOLUTION</span>
            <div className="flex items-center gap-4 text-center my-1">
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold">First Attempt</span>
                <span className="text-lg font-bold font-mono text-slate-500">{dna?.firstScore || 50}%</span>
              </div>
              <ArrowRight size={18} className="text-slate-400" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono font-bold">Current Score</span>
                <span className="text-lg font-bold font-mono text-emerald-700">{dna?.currentScore || 50}%</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500">Continuous AI adaptive training</p>
          </div>
        </div>

        {/* Category Breakdown Bars */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 space-y-6 shadow-sm">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <Target className="text-cyan-600" />
              <h2 className="text-lg font-bold text-slate-900">7-Vector Proficiency Matrix</h2>
            </div>
            <span className="text-xs font-mono font-semibold text-slate-500">0% (Vulnerable) → 100% (Immune)</span>
          </div>

          <div className="space-y-5">
            {categories.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.label}</span>
                  <span className="font-mono text-cyan-800 font-bold">{cat.score}%</span>
                </div>
                <div className="h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: cat.color || '#0891b2' }}
                    initial={{ width: 0 }}
                    animate={{ width: `${cat.score}%` }}
                    transition={{ duration: 1, delay: idx * 0.1 }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tactical Strengths & Weakness Analysis */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Strongest */}
          <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-200">
            <span className="text-[11px] font-mono text-emerald-700 font-bold uppercase tracking-widest block mb-1">
              STRONGEST SKILL
            </span>
            <p className="text-base font-bold text-slate-900">{dna?.strongestSkill?.label || 'Password Hygiene'}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              Demonstrates exceptional awareness against brute-force, dictionary, and reuse vulnerabilities.
            </p>
          </div>

          {/* Weakest */}
          <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200">
            <span className="text-[11px] font-mono text-rose-700 font-bold uppercase tracking-widest block mb-1">
              PRIMARY WEAKNESS
            </span>
            <p className="text-base font-bold text-slate-900">{dna?.weakestSkill?.label || 'AI Threat Awareness'}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              High vulnerability to generative deepfakes, prompt injections, and synthetic voice social engineering.
            </p>
          </div>

          {/* Most Improved */}
          <div className="p-5 rounded-2xl bg-purple-50 border border-purple-200">
            <span className="text-[11px] font-mono text-purple-700 font-bold uppercase tracking-widest block mb-1">
              MOST IMPROVED SKILL
            </span>
            <p className="text-base font-bold text-slate-900">{dna?.mostImprovedSkill?.label || 'Phishing Detection'}</p>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed font-medium">
              +38% accuracy gains in detecting lookalike domains and email gateway bypass lures.
            </p>
          </div>
        </div>

        {/* AI Coach Personalized Training Recommendation */}
        <div className="p-6 rounded-3xl bg-indigo-50 border border-indigo-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-indigo-100 border border-indigo-200 rounded-2xl text-indigo-700">
              <ShieldAlert size={28} />
            </div>
            <div>
              <span className="text-xs font-mono font-bold text-indigo-700 uppercase tracking-wider block">AI SECURITY COACH DIRECTIVE</span>
              <h3 className="text-lg font-bold text-slate-900 mt-0.5">
                Recommended Mission: {dna?.weakestSkill?.label || 'AI THREAT LAB'} Training
              </h3>
              <p className="text-xs text-slate-600 max-w-xl mt-1 leading-relaxed font-medium">
                Closing your vulnerability in {dna?.weakestSkill?.label || 'AI threats'} will boost your overall Cyber DNA into the Low Risk profile.
              </p>
            </div>
          </div>

          <Button variant="primary" size="lg" onClick={() => navigate('/rooms')}>
            TRAIN WEAKNESS NOW →
          </Button>
        </div>
      </div>
    </div>
  );
}

