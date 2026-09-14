import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { gameService } from '../services/gameService';

const SKILLS = [
  { key: 'awareness',        label: 'Awareness',        color: '#4a90d0' },
  { key: 'reaction',         label: 'Reaction',         color: '#e05040' },
  { key: 'security',         label: 'Security',         color: '#50c878' },
  { key: 'criticalThinking', label: 'Critical Thinking', color: '#f0a030' },
  { key: 'digitalEtiquette', label: 'Digital Etiquette', color: '#9b59b6' },
];

export default function CyberDNA() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [dna, setDna] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    gameService.getCyberDNA()
      .then(res => { setDna(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <span className="text-4xl cq-pulse">🛡️</span>
          <p className="mt-2 font-pixel text-[10px]" style={{ color: '#6a5a4a' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 h-full overflow-auto">
      <div className="max-w-lg mx-auto">
        <div className="cq-panel-dark">
          {/* Title */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">🧬</span>
            <h1 className="font-pixel text-sm text-white" style={{ textShadow: '2px 2px 0 #000' }}>
              Cyber DNA
            </h1>
          </div>

          {/* Skill bars */}
          <div className="flex flex-col gap-4">
            {SKILLS.map((skill, i) => {
              const level = dna?.skills?.[skill.key]?.level || (i + 1);
              const pct = Math.min(100, (level / 5) * 100);

              return (
                <motion.div
                  key={skill.key}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-3"
                >
                  {/* Skill icon */}
                  <div className="w-8 h-8 flex items-center justify-center text-lg"
                       style={{ background: skill.color, border: '2px solid #000' }}>
                    🛡️
                  </div>

                  {/* Skill name + bar */}
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-pixel text-[8px] text-gray-300">{skill.label}</span>
                      <span className="font-pixel text-[8px] text-gray-400">Lv. {level}</span>
                    </div>
                    <div className="cq-bar" style={{ height: '14px' }}>
                      <div className="cq-bar-fill"
                           style={{ width: `${pct}%`, background: skill.color, transition: `width 0.5s ease ${i * 0.1}s` }}>
                        <div style={{
                          position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
                          background: 'rgba(255,255,255,0.25)'
                        }} />
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Overall score */}
          <div className="mt-6 pt-4 border-t-2 border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-pixel text-[9px] text-gray-400">Overall Score</span>
              <span className="font-pixel text-lg" style={{ color: '#ffc060', textShadow: '2px 2px 0 #000' }}>
                {dna?.overallScore || user?.cyberScore || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
