import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { CheckCircle2, XCircle, ArrowRight, Brain, Sparkles, ShieldCheck } from 'lucide-react';

const ChallengeResult = ({ 
  isCorrect, 
  xpEarned, 
  trustChange, 
  explanation, 
  onNext, 
  scoring, 
  coachExplanation 
}) => {
  const earnedXP = xpEarned ?? scoring?.xpEarned ?? (isCorrect ? 50 : 10);
  const changedTrust = trustChange ?? scoring?.trustChange ?? (isCorrect ? 15 : -20);
  const analysisText = coachExplanation?.analysis || explanation || (isCorrect ? 'Threat successfully analyzed and mitigated.' : 'Security vulnerability triggered.');
  const actionableTip = coachExplanation?.actionableTip || (isCorrect ? 'Maintain vigilance on subtle anomalies.' : 'Always verify authenticity via known direct channels.');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      className={`bg-white border-2 rounded-2xl p-4 max-w-2xl mx-auto shadow-xl relative overflow-hidden text-slate-800 ${
        isCorrect 
          ? 'border-emerald-500 shadow-emerald-500/10' 
          : 'border-rose-500 shadow-rose-500/10'
      }`}
    >
      <div className={`absolute top-0 left-0 w-full h-2.5 ${isCorrect ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 10, stiffness: 100, delay: 0.2 }}
        >
          {isCorrect ? (
            <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-3 drop-shadow-md" />
          ) : (
            <XCircle className="h-20 w-20 text-rose-500 mb-3 drop-shadow-md" />
          )}
        </motion.div>

        <h2 className={`text-3xl font-black mb-2 ${isCorrect ? 'text-emerald-600' : 'text-rose-600'}`}>
          {isCorrect ? 'Threat Neutralized' : 'Security Breach Detected'}
        </h2>

        <div className="flex gap-4 mb-6 font-mono text-base font-bold">
          <span className="bg-cyan-50 text-cyan-700 px-4 py-1.5 rounded-xl border border-cyan-200">
            +{earnedXP} XP
          </span>
          <span className={`px-4 py-1.5 rounded-xl border ${
            changedTrust >= 0 
              ? 'bg-emerald-50 text-emerald-700 border-emerald-200' 
              : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {changedTrust >= 0 ? '+' : ''}{changedTrust} Trust
          </span>
        </div>

        {/* AI Coach Analysis Card */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-8 w-full text-left relative shadow-sm">
          <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold text-sm uppercase tracking-wider">
            <Brain className="h-5 w-5" />
            <span>AI Coach Debrief</span>
          </div>
          <p className="text-slate-700 text-sm leading-relaxed mb-3">{analysisText}</p>
          
          <div className="pt-3 border-t border-slate-200/80 flex items-start gap-2 text-xs text-indigo-900 bg-indigo-50/50 p-2.5 rounded-xl">
            <Sparkles className="h-4 w-4 text-indigo-600 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-indigo-950">Key Security Tip: </span>
              {actionableTip}
            </div>
          </div>
        </div>

        <Button 
          variant={isCorrect ? 'success' : 'danger'} 
          size="lg" 
          icon={ArrowRight} 
          onClick={onNext}
          className="w-full sm:w-auto px-8"
        >
          Next Challenge
        </Button>
      </div>
    </motion.div>
  );
};

ChallengeResult.propTypes = {
  isCorrect: PropTypes.bool.isRequired,
  xpEarned: PropTypes.number,
  trustChange: PropTypes.number,
  explanation: PropTypes.string,
  onNext: PropTypes.func.isRequired,
  scoring: PropTypes.object,
  coachExplanation: PropTypes.object,
};

export default ChallengeResult;

