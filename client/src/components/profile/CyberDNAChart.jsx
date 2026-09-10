import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Shield, Mail, Key, QrCode, MessageSquare, Globe, ShieldAlert, Star, AlertTriangle, TrendingUp } from 'lucide-react';

const CyberDNAChart = ({ skills }) => {
  const defaultSkills = {
    phishing: { score: 85, icon: Mail, name: 'Phishing Defense' },
    passwords: { score: 60, icon: Key, name: 'Credential Security' },
    qr: { score: 40, icon: QrCode, name: 'QR Safety' },
    social: { score: 90, icon: MessageSquare, name: 'Social Engineering' },
    browsing: { score: 75, icon: Globe, name: 'Safe Browsing' },
    malware: { score: 50, icon: ShieldAlert, name: 'Malware Identification' }
  };

  const data = skills || defaultSkills;
  const categories = Object.entries(data);

  // Find highest, lowest, and most improved
  const scores = categories.map(([_, val]) => val.score);
  const max = Math.max(...scores);
  const min = Math.min(...scores);

  const getColor = (score) => {
    if (score >= 80) return 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] border-green-500/50';
    if (score >= 60) return 'bg-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.5)] border-yellow-500/50';
    if (score >= 40) return 'bg-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.5)] border-orange-500/50';
    return 'bg-red-500 shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/50';
  };

  return (
    <GlassCard>
      <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4">
        <Shield className="h-6 w-6 text-cyan-400" />
        <h3 className="text-xl font-bold text-slate-100 uppercase tracking-widest">Cyber DNA</h3>
      </div>

      <div className="space-y-6">
        {categories.map(([key, val], idx) => {
          const isHighest = val.score === max;
          const isLowest = val.score === min;

          return (
            <div key={key} className="relative">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-slate-800 border border-slate-700`}>
                    <val.icon className="h-5 w-5 text-slate-300" />
                  </div>
                  <span className="font-bold text-slate-200">{val.name}</span>
                  
                  {isHighest && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-yellow-400 bg-yellow-500/10 px-2 py-0.5 rounded border border-yellow-500/30">
                      <Star className="h-3 w-3" /> Strongest
                    </span>
                  )}
                  {isLowest && (
                    <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-red-400 bg-red-500/10 px-2 py-0.5 rounded border border-red-500/30">
                      <AlertTriangle className="h-3 w-3" /> Weakest
                    </span>
                  )}
                </div>
                <span className="font-mono text-xl font-bold text-slate-100">{val.score}%</span>
              </div>
              
              <div className="h-3 w-full bg-slate-900 rounded-full overflow-hidden border border-white/5">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${val.score}%` }}
                  transition={{ duration: 1.5, delay: idx * 0.1, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getColor(val.score)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
};

CyberDNAChart.propTypes = {
  skills: PropTypes.object,
};

export default CyberDNAChart;
