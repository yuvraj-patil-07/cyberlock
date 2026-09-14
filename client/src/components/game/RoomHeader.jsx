import React from 'react';
import TrustScoreBar from '../common/TrustScoreBar';
import PropTypes from 'prop-types';
import { Heart, Clock, Shield, Target } from 'lucide-react';

const RoomHeader = ({ roomName, currentChallenge, totalChallenges, lives, trustScore, timer }) => {
  return (
    <div className="bg-slate-900/80 backdrop-blur-md border-b border-white/10 sticky top-16 z-30 w-full">
      <div className="max-w-7xl mx-auto px-4 py-3">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="p-2 bg-cyan-500/20 rounded-lg border border-cyan-500/30">
              <Shield className="h-6 w-6 text-cyan-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-100">{roomName}</h1>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span className="flex items-center gap-1">
                  <Target className="h-4 w-4" /> 
                  {currentChallenge} / {totalChallenges}
                </span>
                {timer !== undefined && (
                  <span className="flex items-center gap-1 font-mono text-cyan-400">
                    <Clock className="h-4 w-4" /> 
                    {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Heart 
                  key={i} 
                  className={`h-5 w-5 ${i < lives ? 'text-red-500 fill-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.5)]' : 'text-slate-700'}`} 
                />
              ))}
            </div>
            <div className="w-48 hidden sm:block">
              <TrustScoreBar score={trustScore} />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

RoomHeader.propTypes = {
  roomName: PropTypes.string.isRequired,
  currentChallenge: PropTypes.number.isRequired,
  totalChallenges: PropTypes.number.isRequired,
  lives: PropTypes.number.isRequired,
  trustScore: PropTypes.number.isRequired,
  timer: PropTypes.number,
};

export default RoomHeader;
