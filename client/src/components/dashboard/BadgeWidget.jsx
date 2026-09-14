import React, { useState } from 'react';
import { motion } from 'framer-motion';
import GlassCard from '../common/GlassCard';
import Modal from '../common/Modal';
import PropTypes from 'prop-types';
import { BADGE_DEFINITIONS } from '../../utils/constants';
import { 
  ShieldAlert, Lock, QrCode, MessageSquare, Users, Bot, 
  Sparkles, Flame, CheckCircle, Award 
} from 'lucide-react';

const ICON_MAP = {
  ShieldAlert,
  Lock,
  QrCode,
  MessageSquare,
  Users,
  Bot,
  Sparkles,
  Flame,
  CheckCircle,
  Award
};

const BadgeWidget = ({ badges = [] }) => {
  const [selectedBadge, setSelectedBadge] = useState(null);

  // Extract earned badge slugs
  const earnedSlugs = new Set();
  if (Array.isArray(badges)) {
    badges.forEach(b => {
      if (b?.badgeId?.slug) earnedSlugs.add(b.badgeId.slug);
      else if (b?.slug) earnedSlugs.add(b.slug);
      else if (typeof b === 'string') earnedSlugs.add(b);
    });
  }

  const allBadges = BADGE_DEFINITIONS.map(def => {
    const isEarned = earnedSlugs.has(def.slug);
    const IconComponent = ICON_MAP[def.icon] || Award;
    return {
      ...def,
      earned: isEarned,
      IconComponent,
      description: def.description || `Awarded for excelling in ${def.name} operations.`
    };
  });

  const earnedCount = allBadges.filter(b => b.earned).length;

  return (
    <>
      <div className="glass-card p-3 flex flex-col justify-between h-full bg-white border border-slate-200 shadow-sm">
        <div className="flex justify-between items-center pb-3 border-b border-slate-200 mb-4">
          <div className="flex items-center gap-2">
            <Award size={18} className="text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">Accreditation Badges</h3>
          </div>
          <span className="text-xs font-mono text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200 font-bold">
            {earnedCount} / {allBadges.length} UNLOCKED
          </span>
        </div>
        
        <div className="grid grid-cols-5 sm:grid-cols-9 gap-3">
          {allBadges.map((badge, idx) => {
            const Icon = badge.IconComponent;
            return (
              <motion.button
                key={badge.slug}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedBadge(badge)}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className={`aspect-square rounded-2xl flex items-center justify-center border transition-all ${
                  badge.earned 
                    ? 'bg-cyan-50 border-cyan-300 shadow-sm cursor-pointer hover:border-cyan-500' 
                    : 'bg-slate-100 border-slate-200 opacity-40 grayscale cursor-pointer hover:opacity-70'
                }`}
                title={badge.name}
              >
                <Icon className={`h-5 w-5 ${badge.earned ? badge.color : 'text-slate-400'}`} />
              </motion.button>
            );
          })}
        </div>
      </div>

      <Modal isOpen={!!selectedBadge} onClose={() => setSelectedBadge(null)} title="Badge Dossier">
        {selectedBadge && (
          <div className="flex flex-col items-center text-center p-4">
            <div className={`p-3 rounded-3xl bg-slate-50 border ${
              selectedBadge.earned ? 'border-cyan-300 shadow-md' : 'border-slate-200'
            } mb-4`}>
              <selectedBadge.IconComponent className={`h-16 w-16 ${selectedBadge.earned ? selectedBadge.color : 'text-slate-400'}`} />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-1">{selectedBadge.name}</h3>
            <span className={`text-xs font-mono font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 ${
              selectedBadge.earned 
                ? 'bg-green-100 text-green-800 border border-green-300' 
                : 'bg-slate-100 text-slate-600 border border-slate-300'
            }`}>
              {selectedBadge.earned ? 'ACHIEVEMENT UNLOCKED' : 'LOCKED — COMPLETE SIMULATIONS'}
            </span>
            <p className="text-xs text-slate-600 max-w-sm leading-relaxed">{selectedBadge.description}</p>
          </div>
        )}
      </Modal>
    </>
  );
};

BadgeWidget.propTypes = {
  badges: PropTypes.array,
};

export default BadgeWidget;
