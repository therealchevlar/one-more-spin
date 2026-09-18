import React from 'react';
import { motion } from 'framer-motion';
import { Flame, AlertTriangle } from 'lucide-react';

interface RiskMeterProps {
  riskScore: number; // 0 to 100
}

export const RiskMeter: React.FC<RiskMeterProps> = ({ riskScore }) => {
  // Determine color and warning level based on risk percentage
  const isExtreme = riskScore >= 75;
  const isHigh = riskScore >= 55 && riskScore < 75;

  const barColor = isExtreme
    ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-red-600'
    : isHigh
    ? 'bg-gradient-to-r from-yellow-400 to-amber-500'
    : 'bg-gradient-to-r from-emerald-400 to-cyan-400';

  const glowColor = isExtreme
    ? 'rgba(239, 68, 68, 0.4)'
    : isHigh
    ? 'rgba(245, 158, 11, 0.3)'
    : 'rgba(16, 185, 129, 0.2)';

  // Build segmented block display like retro roguelike terminal: ████████░░ 82%
  const totalBlocks = 10;
  const filledBlocks = Math.round((riskScore / 100) * totalBlocks);
  const blockString = '█'.repeat(filledBlocks) + '░'.repeat(totalBlocks - filledBlocks);

  return (
    <div className="flex flex-col items-center select-none">
      <div className="flex items-center space-x-2 text-xs font-mono font-bold tracking-wider uppercase mb-1">
        {isExtreme ? (
          <motion.div
            animate={{ scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 0.8 }}
            className="text-red-500 flex items-center space-x-1"
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            <span className="text-red-400">CRITICAL RISK</span>
          </motion.div>
        ) : (
          <div className="flex items-center space-x-1 text-zinc-400">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>RISK EXPOSURE</span>
          </div>
        )}
      </div>

      <div className="flex items-center space-x-2 w-full max-w-[220px]">
        {/* Progress Bar Container */}
        <div className="relative flex-1 h-2.5 bg-black/60 rounded-full overflow-hidden border border-white/10 p-0.5">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${riskScore}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className={`h-full rounded-full ${barColor}`}
            style={{
              boxShadow: `0 0 12px ${glowColor}`,
            }}
          />
        </div>

        {/* Percentage Label */}
        <span
          className={`font-mono text-xs font-bold w-9 text-right ${
            isExtreme ? 'text-red-400 font-extrabold animate-pulse' : isHigh ? 'text-amber-300' : 'text-emerald-400'
          }`}
        >
          {riskScore}%
        </span>
      </div>

      {/* Retro Ascii Bar representation for luxury terminal feel */}
      <span className="hidden sm:inline font-mono text-[10px] text-zinc-500 tracking-widest mt-0.5">
        {blockString}
      </span>
    </div>
  );
};
