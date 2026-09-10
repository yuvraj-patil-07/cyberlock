import React, { useEffect, useState, useRef } from 'react';
import { motion, animate } from 'framer-motion';
import PropTypes from 'prop-types';

const AnimatedCounter = ({ 
  value, 
  duration = 1, 
  prefix = '', 
  suffix = '', 
  decimals = 0,
  className = ''
}) => {
  const [displayValue, setDisplayValue] = useState(0);
  const prevValue = useRef(0);

  useEffect(() => {
    const controls = animate(prevValue.current, value, {
      duration,
      onUpdate: (latest) => setDisplayValue(latest),
      ease: 'easeOut',
    });

    prevValue.current = value;
    return controls.stop;
  }, [value, duration]);

  return (
    <motion.span className={className} animate={{ opacity: 1 }}>
      {prefix}
      {Number(displayValue).toFixed(decimals)}
      {suffix}
    </motion.span>
  );
};

AnimatedCounter.propTypes = {
  value: PropTypes.number.isRequired,
  duration: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  decimals: PropTypes.number,
  className: PropTypes.string,
};

export default AnimatedCounter;
