import React from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import PropTypes from 'prop-types';
import { Mail, Key, QrCode, MessageSquare, Users, Bot, Globe } from 'lucide-react';

const SkillsRadar = ({ skills }) => {
  let data = [];

  if (Array.isArray(skills) && skills.length > 0) {
    data = skills;
  } else if (skills && typeof skills === 'object') {
    data = [
      { name: 'Phishing Detection', score: skills.phishing ?? 75, icon: Mail },
      { name: 'Password Hygiene', score: skills.passwords ?? 85, icon: Key },
      { name: 'QR Safety', score: skills.qrSafety ?? 60, icon: QrCode },
      { name: 'Scam Detection', score: skills.scamDetection ?? 70, icon: MessageSquare },
      { name: 'Social Engineering', score: skills.socialEngineering ?? 65, icon: Users },
      { name: 'AI Threat Awareness', score: skills.aiThreats ?? 50, icon: Bot }
    ];
  } else {
    data = [
      { name: 'Phishing Detection', score: 75, icon: Mail },
      { name: 'Password Hygiene', score: 85, icon: Key },
      { name: 'QR Safety', score: 60, icon: QrCode },
      { name: 'Scam Detection', score: 70, icon: MessageSquare },
      { name: 'Social Engineering', score: 65, icon: Users },
      { name: 'AI Threat Awareness', score: 50, icon: Bot }
    ];
  }

  const getColor = (score) => {
    if (score >= 80) return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]';
    if (score >= 65) return 'bg-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)]';
    if (score >= 50) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]';
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
