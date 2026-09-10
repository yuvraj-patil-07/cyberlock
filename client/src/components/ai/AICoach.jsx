import React from 'react';
import { motion } from 'framer-motion';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { Brain, MessageSquare, Loader2 } from 'lucide-react';

const AICoach = ({ analysis, recommendations, isLoading, onAskCoach }) => {
  return (
    <div className="bg-slate-900 border border-purple-500/30 rounded-xl overflow-hidden flex flex-col h-full shadow-[0_0_20px_rgba(168,85,247,0.1)]">
      <div className="bg-purple-900/40 border-b border-purple-500/20 p-4 flex items-center gap-3">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur animate-pulse opacity-50" />
          <div className="bg-slate-900 p-2 rounded-full relative z-10 border border-purple-500/50">
            <Brain className="h-6 w-6 text-purple-400" />
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-slate-100">AI Cyber Coach</h3>
          <p className="text-xs text-purple-400 font-mono">Status: ONLINE</p>
        </div>
      </div>

      <div className="flex-grow p-4 overflow-y-auto space-y-4">
        {isLoading ? (
          <div className="flex items-center gap-3 text-purple-400 p-4">
            <Loader2 className="h-5 w-5 animate-spin" />
            <span className="text-sm font-mono">Analyzing behavioral patterns...</span>
          </div>
        ) : (
          <>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Current Assessment</h4>
              <p className="text-sm text-slate-300 leading-relaxed">
                {analysis || "You're showing strong capability in password security, but your phishing detection speed is slower than average."}
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-purple-900/20 rounded-lg p-4 border border-purple-500/20">
              <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider mb-2">Recommendations</h4>
              <ul className="text-sm text-slate-300 space-y-2 list-disc pl-4">
                {recommendations ? recommendations.map((rec, i) => <li key={i}>{rec}</li>) : (
                  <>
                    <li>Always check sender email domains, not just display names.</li>
                    <li>Hover over links to verify destinations before clicking.</li>
                    <li>Complete the 'Advanced Phishing' module next.</li>
                  </>
                )}
              </ul>
            </motion.div>
          </>
        )}
      </div>

      <div className="p-4 border-t border-purple-500/20 bg-slate-800/50">
        <Button 
          variant="ai" 
          fullWidth 
          icon={MessageSquare} 
          disabled={isLoading}
          onClick={onAskCoach}
        >
          Ask For Advice
        </Button>
      </div>
    </div>
  );
};

AICoach.propTypes = {
  analysis: PropTypes.string,
  recommendations: PropTypes.arrayOf(PropTypes.string),
  isLoading: PropTypes.bool,
  onAskCoach: PropTypes.func,
};

export default AICoach;
