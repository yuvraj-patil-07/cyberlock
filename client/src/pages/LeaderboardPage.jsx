import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import api from '../services/api';
import Navbar from '../components/layout/Navbar';

/* ── Trophy pedestal ── */
const TrophyPedestal = ({ rank, player, height, isGold }) => {
  const colors = {
    1: { primary:'bg-yellow-500', border:'border-yellow-200', emoji:'👑', label:'CHAMPION', text:'text-yellow-200' },
    2: { primary:'bg-gray-400', border:'border-gray-200', emoji:'🥈', label:'RUNNER UP', text:'text-gray-200' },
    3: { primary:'bg-[#b45309]', border:'border-[#fcd34d]', emoji:'🥉', label:'3RD PLACE', text:'text-[#fcd34d]' },
  }[rank];

  return (
    <motion.div initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }}
                transition={{ delay: rank * 0.15, type: 'spring', bounce: 0.4 }}
                className="flex flex-col items-center z-10">
      
      <div className="text-4xl mb-2 animate-bounce drop-shadow-[4px_4px_0_#000]">{colors.emoji}</div>

      <div className="mb-2 text-center">
        <div className={`font-pixel text-[10px] mb-1 ${colors.text} drop-shadow-[1px_1px_0_#000]`}>{colors.label}</div>
        <div className="font-pixel text-white text-xs truncate max-w-[100px] drop-shadow-[2px_2px_0_#000]">
          {player?.username || '—'}
        </div>
        <div className={`text-xs font-pixel mt-1 ${colors.text} drop-shadow-[1px_1px_0_#000]`}>
          {(player?.totalScore || 0).toLocaleString()} XP
        </div>
      </div>

      <div className={`relative ${colors.primary} border-4 ${colors.border} flex flex-col items-center justify-start pt-4 shadow-[8px_8px_0_rgba(0,0,0,0.5)]`}
           style={{ width:'100px', height:`${height}px` }}>
        <div className="font-pixel text-4xl text-white drop-shadow-[4px_4px_0_#000]">
          {rank}
        </div>
      </div>
    </motion.div>
  );
};

const TABS = [
  { id:'top-score',       label:'⚔ CHAMPIONS' },
  { id:'fastest-detective',label:'⚡ SPEEDSTERS' },
  { id:'best-investigator',label:'🔍 DETECTIVES' },
  { id:'most-improved',   label:'📈 RISING' },
  { id:'cyber-sentinel',  label:'🛡 SENTINELS' },
];

const RANK_ICONS = ['👑','🥈','🥉','4','5','6','7','8','9','10'];

export default function LeaderboardPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab]   = useState('top-score');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading]        = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/leaderboard?category=${activeTab}`);
        setLeaderboard(res.data.leaderboard || []);
      } catch {
        setLeaderboard([
          { rank:1, username:'CipherSentinel', totalScore:15420, cyberScore:96, evidenceCount:42, improvementPct:45, badgeCount:9 },
          { rank:2, username:'NeonDetective',  totalScore:14250, cyberScore:92, evidenceCount:38, improvementPct:38, badgeCount:8 },
          { rank:3, username:'NullBreaker',    totalScore:13800, cyberScore:89, evidenceCount:35, improvementPct:32, badgeCount:7 },
          { rank:4, username:'DataWraith',     totalScore:12100, cyberScore:84, evidenceCount:29, improvementPct:28, badgeCount:6 },
          { rank:5, username:'ByteHunter',     totalScore:11500, cyberScore:80, evidenceCount:26, improvementPct:25, badgeCount:5 },
        ]);
      } finally { setLoading(false); }
    };
    fetchLeaderboard();
  }, [activeTab]);

  const top3 = leaderboard.slice(0, 3);

  return (
    <div className="min-h-screen bg-[#3f000f] font-pixel text-white relative">
      <Navbar />
      
      {/* Background pattern */}
      <div className="absolute inset-0 pointer-events-none opacity-20"
           style={{
             backgroundImage: 'repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000)',
             backgroundPosition: '0 0, 20px 20px',
             backgroundSize: '40px 40px'
           }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8 pt-24 space-y-8">

        {/* ── HEADER ── */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center">
          <div className="pixel-tag bg-yellow-600 text-white mx-auto mb-4 inline-block shadow-[4px_4px_0_rgba(0,0,0,0.5)]">🏆 HALL OF LEGENDS</div>
          <h1 className="text-4xl md:text-5xl text-yellow-400 mb-2 drop-shadow-[4px_4px_0_#000]">
            CYBER SENTINEL RANKINGS
          </h1>
          <p className="text-sm text-gray-300 drop-shadow-[2px_2px_0_#000]">
            The greatest defenders of the digital realm.
          </p>
        </motion.div>

        {/* ── FILTER TABS ── */}
        <div className="flex flex-wrap justify-center gap-4">
          {TABS.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`pixel-btn text-xs py-3 ${
                activeTab === tab.id ? 'pixel-btn-primary' : 'bg-gray-800 text-gray-400 border-4 border-gray-900 shadow-[4px_4px_0_#000] active:translate-y-1 active:shadow-none'
              }`}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── TROPHY PODIUM ── */}
        {top3.length >= 3 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
                      className="pixel-panel-wood p-8 relative overflow-hidden flex flex-col items-center border-[#b45309]">
            <h2 className="text-lg text-yellow-400 mb-8 drop-shadow-[2px_2px_0_#000]">
              ✦ HALL OF CHAMPIONS ✦
            </h2>
            <div className="flex items-end justify-center gap-6 h-64">
              <TrophyPedestal rank={2} player={top3[1]} height={120}/>
              <TrophyPedestal rank={1} player={top3[0]} height={160} isGold={true}/>
              <TrophyPedestal rank={3} player={top3[2]} height={90}/>
            </div>
          </motion.div>
        )}

        {/* ── FULL RANKINGS TABLE ── */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                    className="pixel-panel-parchment p-0 border-[#78350f]">
          
          <div className="flex bg-[#78350f] text-white p-4 border-b-4 border-[#451a03] text-xs">
            <div className="w-16 text-center">RANK</div>
            <div className="flex-1">HERO</div>
            <div className="w-24 text-center">SCORE</div>
            <div className="w-24 text-center">CLUES</div>
            <div className="w-24 text-right">XP</div>
          </div>

          <div className="flex flex-col">
            {leaderboard.map((player, idx) => (
              <motion.div key={player.rank}
                initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }}
                transition={{ delay: idx * 0.04 }}
                className={`flex p-4 items-center border-b-4 border-[#d97706]/20 text-sm ${player.rank <= 3 ? 'bg-yellow-500/20' : 'hover:bg-black/5'}`}>
                
                <div className="w-16 text-center text-xl drop-shadow-[2px_2px_0_rgba(0,0,0,0.3)]">
                  {player.rank <= 3 ? RANK_ICONS[idx] : `#${player.rank}`}
                </div>
                
                <div className="flex-1 font-bold text-[#451a03]">
                  {player.username}
                </div>
                
                <div className="w-24 text-center text-blue-800">
                  {player.cyberScore || 50}
                </div>
                
                <div className="w-24 text-center text-purple-800">
                  {player.evidenceCount || 0}
                </div>
                
                <div className="w-24 text-right text-orange-800 font-bold">
                  {(player.totalScore || 0).toLocaleString()}
                </div>

              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bottom actions */}
        <div className="flex justify-center gap-6 pb-8">
          <button onClick={() => navigate('/dashboard')} className="pixel-btn pixel-btn-secondary px-8">
            VILLAGE
          </button>
          <button onClick={() => navigate('/rooms')} className="pixel-btn pixel-btn-primary px-8">
            ENTER BATTLE
          </button>
        </div>
      </div>
    </div>
  );
}
