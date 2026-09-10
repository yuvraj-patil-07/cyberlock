import React from 'react';
import GlassCard from '../common/GlassCard';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { Brain, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MissionCard = ({ mission }) => {
  const navigate = useNavigate();
  
  // Default mock mission
  const currentMission = mission || {
    id: 'qr-101',
    title: 'Deceptive Scan',
    room: 'QR Safety Room',
    difficulty: 'Medium',
    reason: 'Your weakest area is currently QR Safety (40%).',
  };

  return (
    <GlassCard glowColor="purple" className="relative overflow-hidden bg-white border border-slate-200">
      {/* AI Coach background badge */}
      <Brain className="absolute -right-4 -bottom-4 h-32 w-32 text-purple-200/40 rotate-12 pointer-events-none" />
      
      <div className="flex items-center gap-2 mb-2">
        <Brain className="h-5 w-5 text-purple-600" />
        <span className="text-xs font-bold text-purple-700 tracking-wider uppercase">AI Coach Recommendation</span>
      </div>
      
      <h3 className="text-xl font-bold text-slate-900 mb-1">{currentMission.title}</h3>
      <p className="text-sm text-cyan-700 font-semibold mb-4">{currentMission.room} • {currentMission.difficulty}</p>
      
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-3.5 mb-6">
        <p className="text-sm text-purple-900 italic">"{currentMission.reason}"</p>
      </div>
      
      <Button 
        variant="ai" 
        fullWidth 
        icon={ArrowRight} 
        onClick={() => navigate(`/rooms/${currentMission.id}`)}
      >
        Start Mission
      </Button>
    </GlassCard>
  );
};

MissionCard.propTypes = {
  mission: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    room: PropTypes.string,
    difficulty: PropTypes.string,
    reason: PropTypes.string,
  }),
};

export default MissionCard;
