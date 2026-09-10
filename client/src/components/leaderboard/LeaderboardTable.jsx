import React, { useState } from 'react';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Trophy, Medal, Award, ArrowUp, ArrowDown, Minus } from 'lucide-react';

const LeaderboardTable = ({ entries, currentUserId, category = 'Global' }) => {
  const [sortField, setSortField] = useState('score');
  const [sortAsc, setSortAsc] = useState(false);

  const defaultEntries = [
    { id: '1', rank: 1, username: 'CyberNinja', score: 9850, badges: 12, accuracy: 98, trend: 'up' },
    { id: '2', rank: 2, username: 'ZeroTrust', score: 9200, badges: 10, accuracy: 95, trend: 'same' },
    { id: '3', rank: 3, username: 'InfoSecPro', score: 8900, badges: 9, accuracy: 92, trend: 'down' },
    { id: '4', rank: 4, username: 'ByteHacker', score: 8500, badges: 8, accuracy: 89, trend: 'up' },
    { id: 'current', rank: 42, username: 'You', score: 4200, badges: 4, accuracy: 75, trend: 'up' },
  ];

  const data = entries || defaultEntries;

  const handleSort = (field) => {
    if (sortField === field) setSortAsc(!sortAsc);
    else {
      setSortField(field);
      setSortAsc(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.8)]" />;
    if (rank === 3) return <Award className="h-5 w-5 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.8)]" />;
    return <span className="text-slate-400 font-mono w-5 inline-block text-center">{rank}</span>;
  };

  const getTrendIcon = (trend) => {
    if (trend === 'up') return <ArrowUp className="h-4 w-4 text-green-400" />;
    if (trend === 'down') return <ArrowDown className="h-4 w-4 text-red-400" />;
    return <Minus className="h-4 w-4 text-slate-500" />;
  };

  return (
    <GlassCard padding="p-0" className="overflow-hidden">
      <div className="p-4 border-b border-white/10 bg-slate-800/50 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-100">{category} Rankings</h3>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 border-b border-slate-700">
              <th className="p-4 w-16 text-center">Rank</th>
              <th className="p-4 cursor-pointer hover:text-slate-200" onClick={() => handleSort('username')}>Player</th>
              <th className="p-4 cursor-pointer hover:text-slate-200 text-right" onClick={() => handleSort('score')}>Score</th>
              <th className="p-4 cursor-pointer hover:text-slate-200 text-center hidden sm:table-cell" onClick={() => handleSort('badges')}>Badges</th>
              <th className="p-4 cursor-pointer hover:text-slate-200 text-right hidden md:table-cell" onClick={() => handleSort('accuracy')}>Accuracy</th>
              <th className="p-4 text-center">Trend</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const isCurrent = row.id === currentUserId || row.id === 'current';
              
              return (
                <tr 
                  key={row.id} 
                  className={`border-b border-slate-800/50 transition-colors ${
                    isCurrent ? 'bg-cyan-900/30' : 'hover:bg-slate-800/50'
                  }`}
                >
                  <td className="p-4 text-center flex justify-center items-center h-full">
                    {getRankIcon(row.rank)}
                  </td>
                  <td className="p-4 font-bold">
                    <span className={isCurrent ? 'text-cyan-400' : 'text-slate-200'}>
                      {row.username}
                    </span>
                    {isCurrent && <span className="ml-2 text-[10px] bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded uppercase tracking-wider border border-cyan-500/30">(You)</span>}
                  </td>
                  <td className="p-4 text-right font-mono font-bold text-slate-100">{row.score.toLocaleString()}</td>
                  <td className="p-4 text-center hidden sm:table-cell text-slate-400">{row.badges}</td>
                  <td className="p-4 text-right hidden md:table-cell text-slate-400">{row.accuracy}%</td>
                  <td className="p-4 text-center flex justify-center items-center h-full">
                    {getTrendIcon(row.trend)}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </GlassCard>
  );
};

LeaderboardTable.propTypes = {
  entries: PropTypes.array,
  currentUserId: PropTypes.string,
  category: PropTypes.string,
};

export default LeaderboardTable;
