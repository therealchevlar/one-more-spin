import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Hash } from 'lucide-react';

interface StreakTrackerProps {
  streak: number;
  decisionsCount: number;
  runNumber: number;
  multiplier: number;
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({
  streak,
  decisionsCount,
  runNumber,
  multiplier,
}) => {
  return (
    <div className="flex items-center space-x-2 md:space-x-4 select-none">
      {/* Run Badge */}
      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
        <Hash className="w-3.5 h-3.5 text-zinc-400" />
        <span className="font-mono text-xs font-semibold text-zinc-300">
          RUN {runNumber}
        </span>
      </div>

      {/* Decisions Survived */}
      <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 backdrop-blur-md">
        <Shield className="w-3.5 h-3.5 text-cyan-400" />
        <span className="font-mono text-xs font-semibold text-zinc-300">
          {decisionsCount} {decisionsCount === 1 ? 'DECISION' : 'SURVIVED'}
        </span>
      </div>

      {/* Streak & Multiplier */}
      {streak > 1 && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-amber-950/40 border border-amber-500/30 text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.2)]"
        >
          <Sparkles className="w-3.5 h-3.5 animate-spin text-amber-400" />
          <span className="font-mono text-xs font-bold tracking-wider">
            {streak} STREAK {multiplier > 1 ? `(${multiplier.toFixed(1)}x)` : ''}
          </span>
        </motion.div>
      )}
    </div>
  );
};
