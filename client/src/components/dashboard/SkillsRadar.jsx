import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Mail, Key, QrCode, MessageSquare, Users, Bot, Globe, ShieldAlert, KeyRound, AlertTriangle, Lock } from 'lucide-react';

const SkillsRadar = ({ skills }) => {
  let data = [];

  if (Array.isArray(skills) && skills.length > 0) {
    data = skills;
  } else if (skills && typeof skills === 'object') {
    data = [
      { name: 'Phishing', score: skills.phishing ?? 0, icon: ShieldAlert },
      { name: 'Passwords', score: skills.passwords ?? 0, icon: KeyRound },
      { name: 'QR Safety', score: skills.qrSafety ?? 0, icon: QrCode },
      { name: 'Scams', score: skills.scamDetection ?? 0, icon: AlertTriangle },
      { name: 'Social Eng', score: skills.socialEngineering ?? 0, icon: Users },
      { name: 'Privacy', score: skills.digitalPrivacy ?? 0, icon: Lock },
      { name: 'AI Threat', score: skills.aiThreats ?? 0, icon: Bot }
    ];
  } else {
    data = [
      { name: 'Phishing', score: 0, icon: ShieldAlert },
      { name: 'Passwords', score: 0, icon: KeyRound },
      { name: 'QR Safety', score: 0, icon: QrCode },
      { name: 'Scams', score: 0, icon: AlertTriangle },
      { name: 'Social Eng', score: 0, icon: Users },
      { name: 'Privacy', score: 0, icon: Lock },
      { name: 'AI Threat', score: 0, icon: Bot }
    ];
  }

  const getColor = (score) => {
    if (score >= 80) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (score >= 65) return 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]';
    if (score >= 30) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
    return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]';
  };

  const minScore = Math.min(...data.map(d => d.score));

  return (
    <div className="flex flex-col h-full justify-between">
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
          <Globe size={16} className="text-cyan-600" />
          <span>Multi-Vector Cognitive Firewall</span>
        </h3>
        <span className="text-[11px] font-mono text-cyan-700 font-bold">Live Skill Matrix</span>
      </div>

      <div className="space-y-4">
        {data.map((skill, index) => {
          const isWeakest = skill.score === minScore;
          const Icon = skill.icon || Globe;
          return (
            <div key={skill.name} className="relative">
              <div className="flex justify-between items-end mb-1">
                <div className="flex items-center gap-2">
                  <Icon className={`h-4 w-4 ${isWeakest ? 'text-red-600 animate-pulse' : 'text-cyan-700'}`} />
                  <span className={`text-xs font-semibold ${isWeakest ? 'text-red-800 font-bold' : 'text-slate-800'}`}>
                    {skill.name}
                    {isWeakest && (
                      <span className="ml-2 text-[10px] bg-red-100 text-red-800 px-1.5 py-0.5 rounded border border-red-300 font-bold">
                        Primary Gap
                      </span>
                    )}
                  </span>
                </div>
                <span className="text-xs font-mono font-bold text-slate-700">{skill.score}%</span>
              </div>
              <div className={`h-2.5 w-full bg-slate-100 rounded-full overflow-hidden p-0.5 border ${isWeakest ? 'border-red-300' : 'border-slate-200'}`}>
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.score}%` }}
                  transition={{ duration: 1, delay: index * 0.08, ease: 'easeOut' }}
                  className={`h-full rounded-full ${getColor(skill.score)}`}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

SkillsRadar.propTypes = {
  skills: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
};

export default SkillsRadar;
