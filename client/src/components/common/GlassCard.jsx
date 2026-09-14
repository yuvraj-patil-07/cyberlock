import React from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const GlassCard = ({
  children,
  className = '',
  glowColor = 'none',
  hoverable = false,
  padding = 'p-3',
  ...props
}) => {
  const glowStyles = {
    cyan: 'shadow-[0_4px_20px_rgba(8,145,178,0.12)] border-cyan-500/30',
    purple: 'shadow-[0_4px_20px_rgba(124,58,237,0.12)] border-purple-500/30',
    red: 'shadow-[0_4px_20px_rgba(225,29,72,0.12)] border-rose-500/30',
    none: 'border-slate-200 shadow-sm',
  };

  const hoverProps = hoverable
    ? {
        whileHover: { scale: 1.01, boxShadow: `0 10px 25px -5px ${glowColor === 'none' ? 'rgba(0,0,0,0.08)' : glowColor === 'cyan' ? 'rgba(8,145,178,0.2)' : glowColor === 'purple' ? 'rgba(124,58,237,0.2)' : 'rgba(225,29,72,0.2)'}` },
      }
    : {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      {...hoverProps}
      className={`bg-white/95 backdrop-blur-xl border rounded-2xl ${glowStyles[glowColor]} ${padding} text-slate-800 ${className}`}
      {...props}
    >
      {children}
    </motion.div>
  );
};

GlassCard.Header = ({ icon: Icon, title, className = '' }) => (
  <div className={`flex items-center space-x-3 mb-4 border-b border-slate-100 pb-3 ${className}`}>
    {Icon && <Icon className="h-6 w-6 text-cyan-600" />}
    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
  </div>
);

GlassCard.Body = ({ children, className = '' }) => (
  <div className={className}>{children}</div>
);

GlassCard.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
  glowColor: PropTypes.oneOf(['cyan', 'purple', 'red', 'none']),
  hoverable: PropTypes.bool,
  padding: PropTypes.string,
};

export default GlassCard;

