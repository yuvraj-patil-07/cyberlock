import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';
import { Trophy, Medal, Award, ChevronLeft, Sparkles, TrendingUp, Zap, Clock, ShieldCheck } from 'lucide-react';

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('top-score');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = [
    { id: 'top-score', label: 'Top Score', icon: Trophy },
    { id: 'fastest-detective', label: 'Fastest Detective', icon: Clock },
    { id: 'best-investigator', label: 'Best Investigator', icon: ShieldCheck },
    { id: 'most-improved', label: 'Most Improved', icon: TrendingUp },
    { id: 'cyber-sentinel', label: 'Cyber Sentinel', icon: Sparkles }
  ];

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/leaderboard?category=${activeTab}`);
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
        setLeaderboard([
          { rank: 1, username: 'CipherSentinel', totalScore: 15420, cyberScore: 96, evidenceCount: 42, improvementPct: 45, badgeCount: 9 },
          { rank: 2, username: 'NeonDetective', totalScore: 14250, cyberScore: 92, evidenceCount: 38, improvementPct: 38, badgeCount: 8 },
          { rank: 3, username: 'NullBreaker', totalScore: 13800, cyberScore: 89, evidenceCount: 35, improvementPct: 32, badgeCount: 7 },
          { rank: 4, username: 'DataWraith', totalScore: 12100, cyberScore: 84, evidenceCount: 29, improvementPct: 28, badgeCount: 6 },
          { rank: 5, username: 'ByteHunter', totalScore: 11500, cyberScore: 80, evidenceCount: 26, improvementPct: 25, badgeCount: 5 }
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchLeaderboard();
  }, [activeTab]);

  const top3 = leaderboard.slice(0, 3);
  const displayList = leaderboard.length > 0 ? leaderboard : [];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-800">
      <Navbar />

      <div className="flex-1 max-w-5xl mx-auto w-full px-6 py-12 pt-28 space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-800 font-mono text-xs mb-2 font-bold shadow-sm">
              <Trophy size={14} className="text-amber-600" /> GLOBAL DEFENDER RANKINGS
            </div>
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
              CYBER SENTINEL LEADERBOARD
            </h1>
          </div>
          <button onClick={() => navigate('/dashboard')} className="btn-ghost flex items-center gap-2 text-xs">
            <ChevronLeft size={16} /> COMMAND CENTER
          </button>
        </div>

        {/* Filter Category Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 custom-scrollbar">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-2.5 rounded-2xl whitespace-nowrap text-xs font-mono font-bold transition-all flex items-center gap-2 border ${
                  isActive
                    ? 'bg-cyan-50 text-cyan-800 border-cyan-300 shadow-sm'
                    : 'bg-white text-slate-600 border-slate-200 hover:text-slate-900 hover:bg-slate-50 shadow-sm'
                }`}
              >
                <Icon size={14} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Podium Top 3 */}
        {top3.length >= 3 && (
          <div className="grid grid-cols-3 gap-4 items-end h-56 max-w-2xl mx-auto pt-6">
            {/* Rank 2 */}
            <div className="relative bg-white border border-slate-200 shadow-md flex flex-col items-center justify-end p-4 bg-gradient-to-t from-slate-100 to-white h-4/5 rounded-3xl">
              <div className="absolute -top-5 flex justify-center w-full">
                <div className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-300 flex items-center justify-center text-slate-600 shadow-sm">
                  <Medal size={18} />
                </div>
              </div>
              <div className="text-center w-full truncate px-1">
                <span className="text-[10px] font-mono font-bold text-slate-500">#2 RANK</span>
                <p className="font-bold text-xs md:text-sm text-slate-900 truncate">{top3[1]?.username}</p>
                <p className="text-cyan-700 font-mono text-xs font-bold mt-0.5">{top3[1]?.totalScore} XP</p>
              </div>
            </div>

            {/* Rank 1 */}
            <div className="relative bg-white border-2 border-amber-300 flex flex-col items-center justify-end p-4 bg-gradient-to-t from-amber-50 to-white h-full rounded-3xl shadow-lg">
              <div className="absolute -top-6 flex justify-center w-full">
                <div className="w-12 h-12 rounded-full bg-amber-50 border-2 border-amber-400 flex items-center justify-center text-amber-600 shadow-md">
                  <Trophy size={22} />
                </div>
              </div>
              <div className="text-center w-full truncate px-1">
                <span className="text-[10px] font-mono text-amber-700 font-bold">#1 CHAMPION</span>
                <p className="font-black text-sm md:text-base text-slate-900 truncate">{top3[0]?.username}</p>
                <p className="text-amber-700 font-mono text-xs font-black mt-0.5">{top3[0]?.totalScore} XP</p>
              </div>
            </div>

            {/* Rank 3 */}
            <div className="relative bg-white border border-slate-200 shadow-md flex flex-col items-center justify-end p-4 bg-gradient-to-t from-amber-50/50 to-white h-3/4 rounded-3xl">
              <div className="absolute -top-5 flex justify-center w-full">
                <div className="w-10 h-10 rounded-full bg-amber-50 border-2 border-amber-300 flex items-center justify-center text-amber-700 shadow-sm">
                  <Medal size={18} />
                </div>
              </div>
              <div className="text-center w-full truncate px-1">
                <span className="text-[10px] font-mono font-bold text-amber-700">#3 RANK</span>
                <p className="font-bold text-xs md:text-sm text-slate-900 truncate">{top3[2]?.username}</p>
                <p className="text-cyan-700 font-mono text-xs font-bold mt-0.5">{top3[2]?.totalScore} XP</p>
              </div>
            </div>
          </div>
        )}

        {/* Leaderboard Table */}
        <div className="bg-white overflow-hidden rounded-3xl border border-slate-200 shadow-sm">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-600 text-xs font-mono font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">RANK</th>
                <th className="px-6 py-4">OPERATOR</th>
                <th className="px-6 py-4 text-center">CYBER SCORE</th>
                <th className="px-6 py-4 text-center">EVIDENCE LOGGED</th>
                <th className="px-6 py-4 text-right">TOTAL XP</th>
                <th className="px-6 py-4 text-right hidden md:table-cell">BADGES</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-xs md:text-sm">
              {displayList.map((player) => (
                <tr key={player.rank} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-4 font-mono font-bold text-slate-400 group-hover:text-cyan-700">
                    #{player.rank}
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-900 group-hover:text-cyan-700 transition-colors">
                    {player.username}
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-cyan-800 font-bold">
                    {player.cyberScore || 50}/100
                  </td>
                  <td className="px-6 py-4 text-center font-mono text-indigo-700 font-semibold">
                    {player.evidenceCount || 0} pts
                  </td>
                  <td className="px-6 py-4 text-right text-emerald-700 font-mono font-bold">
                    {player.totalScore?.toLocaleString() || 0} XP
                  </td>
                  <td className="px-6 py-4 text-right text-slate-500 hidden md:table-cell">
                    <div className="flex items-center justify-end gap-1 font-mono text-xs">
                      <Award size={14} className="text-purple-600" />
                      <span>{player.badgeCount || 0}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

