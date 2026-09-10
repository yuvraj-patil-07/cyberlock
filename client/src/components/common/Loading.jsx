import React from 'react';
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';
import PropTypes from 'prop-types';

export const InlineLoading = ({ message = 'Loading...', className = '' }) => (
  <div className={`flex items-center space-x-2 text-cyan-700 ${className}`}>
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
    >
      <Shield className="h-5 w-5" />
    </motion.div>
    <span className="font-mono text-sm font-semibold">{message}</span>
  </div>
);

const Loading = ({ message = 'INITIALIZING SECURE CONNECTION...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-cyan-700">
      <div className="relative">
        <motion.div
          className="absolute inset-0 border-4 border-cyan-500/20 rounded-full"
          animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          className="relative bg-white p-4 rounded-full border border-cyan-500/30 shadow-md"
        >
          <Shield className="h-12 w-12 text-cyan-600" />
        </motion.div>
      </div>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 1, repeat: Infinity, repeatType: 'reverse' }}
        className="mt-8 font-mono text-sm tracking-widest font-bold text-slate-700"
      >
        {message}
      </motion.p>
    </div>
  );
};

Loading.propTypes = {
  message: PropTypes.string,
};

InlineLoading.propTypes = {
  message: PropTypes.string,
  className: PropTypes.string,
};

export default Loading;
