import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Button from '../common/Button';
import PropTypes from 'prop-types';
import { ArrowDown, ShieldAlert, HeartCrack, AlertTriangle } from 'lucide-react';

const ConsequenceEngine = ({ consequenceChain, trustChange, onRecoveryStart }) => {
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (activeStep < consequenceChain.length) {
      const timer = setTimeout(() => {
        setActiveStep(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [activeStep, consequenceChain.length]);

  return (
    <div className="bg-white border-2 border-rose-300 rounded-2xl p-6 shadow-xl text-slate-800">
      <div className="flex items-center justify-center gap-3 mb-6 text-rose-600">
        <ShieldAlert className="h-8 w-8 animate-bounce" />
        <h2 className="text-2xl font-black uppercase tracking-widest">Security Breach Cascading</h2>
      </div>

      <div className="space-y-4 mb-8">
        <AnimatePresence>
          {consequenceChain.slice(0, activeStep).map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col items-center"
            >
              <div className="bg-rose-50 border border-rose-200 rounded-xl p-4 w-full text-center text-rose-950 font-medium shadow-sm">
                <span className="font-bold text-rose-700 mr-2">Phase {idx + 1}:</span>
                {step}
              </div>
              {idx < consequenceChain.length - 1 && (
                <ArrowDown className="h-6 w-6 text-rose-400 my-2 animate-bounce" />
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {activeStep >= consequenceChain.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center pt-2 border-t border-slate-100"
        >
          <div className="inline-flex items-center justify-center gap-2 bg-rose-100 text-rose-700 px-6 py-3 rounded-2xl border border-rose-300 font-mono text-xl mb-4 font-bold shadow-sm">
            <HeartCrack className="h-6 w-6 text-rose-600" />
            Trust Score {trustChange}
          </div>
          
          <p className="text-slate-600 text-sm mb-6 max-w-md mx-auto leading-relaxed">
            In a production environment, this vulnerability allows unauthorized lateral movement. Let's debrief and patch the attack vector.
          </p>

          <Button variant="danger" size="lg" onClick={onRecoveryStart}>
            Begin Recovery Protocol
          </Button>
        </motion.div>
      )}
    </div>
  );
};

ConsequenceEngine.propTypes = {
  consequenceChain: PropTypes.arrayOf(PropTypes.string).isRequired,
  trustChange: PropTypes.number.isRequired,
  onRecoveryStart: PropTypes.func.isRequired,
};

export default ConsequenceEngine;

