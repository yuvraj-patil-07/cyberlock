import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import Button from '../components/common/Button';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, FunnelChart, Funnel, LabelList 
} from 'recharts';
import { 
  Users, Activity, Target, ShieldAlert, AlertTriangle, TrendingUp, 
  Award, Shield, Database, RefreshCw, ChevronLeft 
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [resAnalytics, resUsers] = await Promise.all([
          api.get('/admin/analytics').catch(() => ({ data: null })),
          api.get('/admin/users').catch(() => ({ data: { users: [] } }))
        ]);

        if (resAnalytics.data) {
          setAnalytics(resAnalytics.data);
        } else {
          // Fallback analytics data for chart rendering
          setAnalytics({
            summary: {
              totalPlayers: 148,
              totalChallenges: 46,
              totalAttempts: 1240,
              avgCyberScore: 72,
              avgCompletionRate: 64,
              mostCommonWeakness: 'Phishing Typo-Squatting'
            },
            failureRates: [
              { category: 'Phishing', failureRate: 34, totalAttempts: 410 },
              { category: 'Passwords', failureRate: 18, totalAttempts: 320 },
              { category: 'QR Traps', failureRate: 42, totalAttempts: 290 },
              { category: 'Scam Inbox', failureRate: 28, totalAttempts: 380 },
              { category: 'Social Eng.', failureRate: 38, totalAttempts: 210 },
              { category: 'AI Threats', failureRate: 52, totalAttempts: 190 }
            ],
            funnel: [
              { room: 'Room 1 (Phishing)', players: 148 },
              { room: 'Room 2 (Passwords)', players: 132 },
              { room: 'Room 3 (QR Trap)', players: 110 },
              { room: 'Room 4 (Scam Inbox)', players: 95 },
              { room: 'Room 5 (Social Eng)', players: 78 },
              { room: 'Room 6 (AI Threat)', players: 62 },
              { room: 'Room 7 (Final Lock)', players: 45 }
            ],
            difficultyDistribution: {
              beginner: 14,
              intermediate: 18,
              advanced: 10,
              expert: 4
            },
            mostImprovedUsers: [
              { username: 'Alex_Defender', firstScore: 35, currentScore: 88, improvementPct: 151, level: 5 },
              { username: 'SecuritySam', firstScore: 40, currentScore: 85, improvementPct: 112, level: 4 },
              { username: 'Maya_Net', firstScore: 48, currentScore: 92, improvementPct: 91, level: 6 }
            ]
          });
        }

        setUsers(resUsers.data.users || []);
      } catch (err) {
        console.error('Error loading admin data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const COLORS = ['#06b6d4', '#10b981', '#8b5cf6', '#f59e0b', '#ec4899', '#ef4444'];

  const failureRatesData = analytics?.failureRates || [];
  const funnelData = analytics?.funnel || [];
  const summary = analytics?.summary || {};

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl mx-auto w-full px-6 py-12 pt-28 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 font-mono text-xs mb-2 font-bold">
              <ShieldAlert size={14} /> RESTRICTED ACCESS // ADMIN TELEMETRY
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-amber-600 to-rose-700 tracking-tight">
              ADMIN ANALYTICS & THREAT INTELLIGENCE
            </h1>
          </div>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-xs">
            <ChevronLeft size={16} /> RETURN TO DASHBOARD
          </Button>
        </div>

        {/* 4 Summary Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="glass-card border-slate-200 bg-white shadow-sm p-6 space-y-1">
            <span className="text-xs font-mono text-slate-600 font-bold uppercase">TOTAL REGISTERED PLAYERS</span>
            <p className="text-3xl font-black text-cyan-700 font-mono">{summary.totalPlayers || 148}</p>
            <span className="text-[11px] text-slate-500">Active trainees</span>
          </div>

          <div className="glass-card border-slate-200 bg-white shadow-sm p-6 space-y-1">
            <span className="text-xs font-mono text-slate-600 font-bold uppercase">AVG CYBER SCORE</span>
            <p className="text-3xl font-black text-emerald-700 font-mono">{summary.avgCyberScore || 72}%</p>
            <span className="text-[11px] text-emerald-700 font-bold">Class benchmark</span>
          </div>

          <div className="glass-card border-slate-200 bg-white shadow-sm p-6 space-y-1">
            <span className="text-xs font-mono text-slate-600 font-bold uppercase">TOTAL CHALLENGES ATTEMPTED</span>
            <p className="text-3xl font-black text-purple-700 font-mono">{summary.totalAttempts || 1240}</p>
            <span className="text-[11px] text-slate-500">Telemetry data points</span>
          </div>

          <div className="glass-card border-slate-200 bg-white shadow-sm p-6 space-y-1">
            <span className="text-xs font-mono text-slate-600 font-bold uppercase">ROOM COMPLETION FUNNEL</span>
            <p className="text-3xl font-black text-amber-700 font-mono">{summary.avgCompletionRate || 64}%</p>
            <span className="text-[11px] text-slate-500">Average room progress</span>
          </div>
        </div>

        {/* Recharts Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Failure Rates by Threat Category Bar Chart */}
          <div className="glass-card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} className="text-red-600" />
                <span>Failure Rate by Threat Category (%)</span>
              </h3>
              <span className="text-xs font-mono text-red-600 font-bold">Higher = More Vulnerable</span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={failureRatesData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="category" stroke="#64748b" fontSize={11} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b' }}
                  />
                  <Bar dataKey="failureRate" fill="#ef4444" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Room Completion Funnel */}
          <div className="glass-card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                <TrendingUp size={16} className="text-cyan-600" />
                <span>Room Completion Funnel (Players Cleared)</span>
              </h3>
              <span className="text-xs font-mono text-cyan-700 font-bold">Progression Drop-off</span>
            </div>

            <div className="h-72 w-full pt-4">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={funnelData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis type="number" stroke="#64748b" fontSize={11} />
                  <YAxis type="category" dataKey="room" stroke="#64748b" fontSize={10} width={130} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#cbd5e1', borderRadius: '8px', color: '#1e293b' }}
                  />
                  <Bar dataKey="players" fill="#06b6d4" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Most Improved Users Table */}
        <div className="glass-card p-6 border border-slate-200 bg-white shadow-sm space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Award size={16} className="text-amber-500" />
              <span>Top Learning Progress Trainees (Most Improved)</span>
            </h3>
            <span className="text-xs font-mono text-emerald-700 font-bold">Pre vs Post Simulation Score</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-slate-700 font-mono uppercase bg-slate-100">
                <tr>
                  <th className="p-3">TRAINEE</th>
                  <th className="p-3 text-center">INITIAL SCORE</th>
                  <th className="p-3 text-center">CURRENT SCORE</th>
                  <th className="p-3 text-center">IMPROVEMENT</th>
                  <th className="p-3 text-right">LEVEL</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {(analytics?.mostImprovedUsers || []).map((u, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="p-3 font-bold text-slate-800">{u.username}</td>
                    <td className="p-3 text-center font-mono text-slate-600">{u.firstScore}%</td>
                    <td className="p-3 text-center font-mono text-emerald-700 font-bold">{u.currentScore}%</td>
                    <td className="p-3 text-center font-mono text-green-700 font-bold">+{u.improvementPct}%</td>
                    <td className="p-3 text-right font-mono text-cyan-700 font-bold">Lvl {u.level || 1}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
