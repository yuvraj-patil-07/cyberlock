import React from 'react';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';

const RecentActivity = ({ activities }) => {
  // Mock data
  const data = activities || [
    { id: 1, title: 'Suspicious Invoice', category: 'Phishing', result: 'correct', xp: '+50', time: '10 mins ago' },
    { id: 2, title: 'Bank Login Alert', category: 'Phishing', result: 'wrong', xp: '+10', time: '15 mins ago' },
    { id: 3, title: 'Password Entropy', category: 'Passwords', result: 'correct', xp: '+50', time: '1 hour ago' },
    { id: 4, title: 'Parking Meter QR', category: 'QR Safety', result: 'correct', xp: '+50', time: '2 hours ago' },
  ];

  return (
    <GlassCard>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-slate-900">Recent Activity</h3>
        <button className="text-xs text-cyan-700 hover:text-cyan-800 font-bold">View All</button>
      </div>
      
      <div className="space-y-3">
        {data.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 hover:bg-cyan-50/50 transition-colors">
            <div className="flex items-center gap-3">
              {item.result === 'correct' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
              ) : (
                <XCircle className="h-5 w-5 text-rose-600 flex-shrink-0" />
              )}
              <div>
                <p className="text-sm font-medium text-slate-800">{item.title}</p>
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <span className="font-semibold text-slate-600">{item.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {item.time}</span>
                </div>
              </div>
            </div>
            <div className={`text-sm font-mono font-bold ${item.result === 'correct' ? 'text-emerald-700' : 'text-slate-500'}`}>
              {item.xp} XP
            </div>
          </div>
        ))}
      </div>
    </GlassCard>
  );
};

RecentActivity.propTypes = {
  activities: PropTypes.array,
};

export default RecentActivity;
