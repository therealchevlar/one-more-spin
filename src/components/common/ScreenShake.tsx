import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

interface ScreenShakeProps {
  triggerKey: number | string;
  intensity?: 'small' | 'large' | 'catastrophic';
  children: React.ReactNode;
}

export const ScreenShake: React.FC<ScreenShakeProps> = ({
  triggerKey,
  intensity = 'small',
  children,
}) => {
  const [shaking, setShaking] = useState(false);

  useEffect(() => {
    if (!triggerKey) return;
    setShaking(true);
    const timer = setTimeout(() => setShaking(false), 450);
    return () => clearTimeout(timer);
  }, [triggerKey]);

  const getShakeAnimation = () => {
    if (!shaking) return { x: 0, y: 0 };

    if (intensity === 'catastrophic') {
      return {
        x: [0, -18, 16, -14, 12, -8, 6, -3, 0],
        y: [0, 12, -10, 8, -6, 4, -2, 0],
      };
    }

    if (intensity === 'large') {
      return {
        x: [0, -10, 8, -6, 5, -2, 0],
        y: [0, 6, -5, 4, -2, 0],
      };
    }

    return {
      x: [0, -5, 4, -3, 2, 0],
      y: [0, 3, -2, 1, 0],
    };
  };

  return (
    <motion.div
      animate={getShakeAnimation()}
      transition={{ duration: 0.45, ease: 'easeOut' }}
      className="w-full h-full"
    >
      {children}
    </motion.div>
  );
};
