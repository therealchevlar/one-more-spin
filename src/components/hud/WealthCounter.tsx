import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { WealthTier, WEALTH_TIERS } from '../../types/game';

interface WealthCounterProps {
  wealth: number;
  tier: WealthTier;
  lastDelta?: number;
}

export const WealthCounter: React.FC<WealthCounterProps> = ({ wealth, tier, lastDelta }) => {
  const [displayNumber, setDisplayNumber] = useState(wealth);
  const [showDelta, setShowDelta] = useState(false);

  // Smooth number interpolation
  useEffect(() => {
    let start = displayNumber;
    const end = wealth;
    if (start === end) return;

    setShowDelta(true);
    const timeout = setTimeout(() => setShowDelta(false), 2400);

    const duration = 800; // ms
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.round(start + (end - start) * easeProgress);

      setDisplayNumber(currentVal);

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setDisplayNumber(end);
      }
    };

    requestAnimationFrame(updateCounter);

    return () => clearTimeout(timeout);
  }, [wealth]);

  // Format currency with commas
  const formattedWealth = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(displayNumber);

  const tierConfig = WEALTH_TIERS[tier];

  return (
    <div className="relative flex flex-col items-center justify-center py-2 select-none">
      {/* Floating Delta Animation */}
      <AnimatePresence>
        {showDelta && lastDelta !== undefined && lastDelta !== 0 && (
          <motion.div
            key={lastDelta}
            initial={{ opacity: 0, y: 15, scale: 0.8 }}
            animate={{ opacity: 1, y: -22, scale: 1.15 }}
            exit={{ opacity: 0, y: -38, scale: 0.9 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className={`absolute -top-3 font-mono font-bold text-lg md:text-xl tracking-wide px-3 py-0.5 rounded-full backdrop-blur-md border ${
              lastDelta > 0
                ? 'text-emerald-400 bg-emerald-950/80 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
                : 'text-red-400 bg-red-950/80 border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.5)]'
            }`}
          >
            {lastDelta > 0 ? `+${new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lastDelta)}` : new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(lastDelta)}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Counter Display */}
      <div className="flex items-baseline space-x-1">
        <motion.div
          key={tier}
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          className="font-mono font-black text-4xl sm:text-5xl md:text-6xl tracking-tight text-white drop-shadow-[0_2px_15px_rgba(0,0,0,0.9)]"
          style={{
            textShadow: `0 0 35px ${tierConfig.color}40`,
          }}
        >
          {formattedWealth}
        </motion.div>
      </div>

      {/* Sublabel & Tier Aura */}
      <div className="flex items-center space-x-2 mt-1">
        <span className="text-[11px] font-bold tracking-[0.25em] text-zinc-400 uppercase">
          Net Worth
        </span>
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-zinc-600" />
        <span
          className="text-xs font-semibold tracking-wider uppercase transition-colors duration-500"
          style={{ color: tierConfig.color }}
        >
          {tierConfig.label}
        </span>
      </div>
    </div>
  );
};
