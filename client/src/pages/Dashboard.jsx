import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { useGame } from '../hooks/useGame';
import { aiService } from '../services/aiService';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';

// Widgets
import CyberScoreWidget from '../components/dashboard/CyberScoreWidget';
import StatsGrid from '../components/dashboard/StatsGrid';
import SkillsRadar from '../components/dashboard/SkillsRadar';
import BadgeWidget from '../components/dashboard/BadgeWidget';
import RecentActivity from '../components/dashboard/RecentActivity';

import { 
  ShieldAlert, User, Target, Trophy, Award, Activity, 
  Sparkles, TrendingUp, AlertTriangle, ArrowRight, Heart, Shield, Zap 
} from 'lucide-react';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const { progress, loadProgress } = useGame();
  const navigate = useNavigate();
  const [recommendation, setRecommendation] = useState(null);

  useEffect(() => {
    loadProgress();
    const fetchRec = async () => {
      try {
        const res = await aiService.getRecommendation();
        setRecommendation(res.data.recommendation);
      } catch (err) {
        setRecommendation({
          room: 1,
          title: "PHISHING ROOM — Level 2",
          reason: "Reinforce deceptive sender identification and artificial urgency detection."
        });
      }
    };
    fetchRec();
  }, [loadProgress]);

  const cyberScore = user?.cyberScore ?? 70;
  const level = user?.level ?? 1;
  const xp = user?.xp ?? 0;
  const lives = user?.lives ?? 5;
  const trustScore = user?.trustScore ?? 100;
  const badges = user?.badges ?? [];
  const skillProfile = user?.skillProfile ?? {
    phishing: 75,
    passwords: 85,
    qrSafety: 60,
    scamDetection: 70,
    socialEngineering: 65,
    aiThreats: 50,
    digitalPrivacy: 70
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 pt-28 space-y-8">
        {/* Top Header Command Center Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-50 border border-cyan-200 text-cyan-700 font-mono text-xs mb-2 font-bold">
              <span className="w-2 h-2 rounded-full bg-cyan-600 animate-ping" />
              OPERATOR ACTIVE // LEVEL {level}
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              SECURITY COMMAND CENTER
            </h1>
            <p className="text-slate-500 text-xs md:text-sm mt-1">
              Logged in as <strong className="text-slate-800">{user?.username || 'Agent'}</strong> ({user?.email})
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" onClick={() => navigate('/rooms')} className="flex items-center gap-2 text-xs">
              <Target size={16} /> ENTER ESCAPE ROOMS
            </Button>
            <Button variant="ghost" onClick={() => navigate('/cyber-dna')} className="flex items-center gap-2 text-xs">
              <Activity size={16} /> CYBER DNA
            </Button>
            <Button variant="ghost" onClick={() => navigate('/leaderboard')} className="flex items-center gap-2 text-xs">
              <Trophy size={16} /> LEADERBOARD
            </Button>
          </div>
        </div>

        {/* Top Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CyberScoreWidget score={cyberScore} />

          <div className="md:col-span-2">
            <StatsGrid stats={{ level, xp, lives, trustScore }} />
          </div>
        </div>

        {/* Middle Section: Recommended Mission & Skills Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* AI Recommended Mission Banner */}
          <div className="lg:col-span-6 bg-white border border-indigo-200 rounded-3xl p-6 flex flex-col justify-between relative overflow-hidden shadow-sm">
            <div className="absolute -right-6 -bottom-6 w-36 h-36 bg-indigo-50 rounded-full blur-2xl pointer-events-none" />

            <div>
              <div className="flex items-center gap-2 text-indigo-700 font-mono text-xs font-bold uppercase tracking-wider mb-3">
                <Sparkles size={16} />
                <span>AI SECURITY COACH RECOMMENDATION</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                {recommendation?.title || "PHISHING ROOM — Advanced Analysis"}
              </h3>
              <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-6 font-medium">
                {recommendation?.reason || "Your detection instincts are strong, but artificial urgency and lookalike domains represent your primary vulnerability vector."}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button 
                variant="primary" 
                onClick={() => navigate(`/play/${recommendation?.room || 1}`)}
                className="w-full flex items-center justify-center gap-2 text-xs py-3"
              >
                LAUNCH RECOMMENDED MISSION <ArrowRight size={14} />
              </Button>
            </div>
          </div>

          {/* Skills Radar / Multi-Vector Chart */}
          <div className="lg:col-span-6 bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <SkillsRadar skills={skillProfile} />
          </div>
        </div>

        {/* Badges Widget & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7">
            <BadgeWidget badges={badges} />
          </div>
          <div className="lg:col-span-5">
            <RecentActivity />
          </div>
        </div>
      </div>
    </div>
  );
}
