import React from 'react';
import { motion } from 'framer-motion';
import { Play, Shield, TrendingUp, Skull, Sparkles } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface StartScreenProps {
  onStartRun: () => void;
  onOpenTutorial: () => void;
  runCount: number;
  bestPeakWealth?: number;
}

export const StartScreen: React.FC<StartScreenProps> = ({
  onStartRun,
  onOpenTutorial,
  runCount,
  bestPeakWealth,
}) => {
  const handleStart = () => {
    sound.playWin();
    sound.startAmbientMusic();
    onStartRun();
  };

  const formattedBest = bestPeakWealth
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(bestPeakWealth)
    : null;

  return (
    <div className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-2xl mx-auto text-center select-none z-10">
      {/* Golden Glowing Badge */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-amber-300 text-xs font-mono font-bold tracking-[0.2em] uppercase mb-6 shadow-[0_0_20px_rgba(245,158,11,0.25)]"
      >
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>HIGH STAKES ROGUELITE DECISIONS</span>
      </motion.div>

      {/* Main Title */}
      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="font-display font-black text-5xl sm:text-6xl md:text-7xl tracking-wider text-white mb-4 drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
      >
        ONE MORE <span className="text-gold-gradient">SPIN</span>
      </motion.h1>

      {/* Starting Wealth Teaser */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="space-y-1 mb-8"
      >
        <div className="text-2xl sm:text-3xl font-mono font-bold text-amber-300">
          You start with <span className="underline decoration-amber-500 underline-offset-8 font-black">$100</span>.
        </div>
        <p className="text-zinc-400 text-sm sm:text-base max-w-md mx-auto pt-2 font-sans leading-relaxed">
          How far can you take it before pure greed collapses your empire?
        </p>
      </motion.div>

      {/* Three Simple Pillars */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full mb-8 text-left"
      >
        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <TrendingUp className="w-5 h-5 text-emerald-400 mb-1.5" />
          <div className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            1. Make Decisions
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Choose increasingly absurd, high-risk opportunities.
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <Shield className="w-5 h-5 text-amber-400 mb-1.5" />
          <div className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            2. Cash Out in Time
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Bank your fortune and retire like royalty.
          </div>
        </div>

        <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 backdrop-blur-md">
          <Skull className="w-5 h-5 text-red-400 mb-1.5" />
          <div className="font-bold text-white text-xs font-mono uppercase tracking-wider">
            3. Or Lose Everything
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">
            Push too far and watch your billions evaporate to zero.
          </div>
        </div>
      </motion.div>

      {/* Call to Action: START RUN */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 w-full"
      >
        <motion.button
          whileHover={{ scale: 1.04, y: -2 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          className="w-full sm:w-auto px-10 py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black text-lg tracking-wider font-mono shadow-[0_0_35px_rgba(255,215,0,0.5)] flex items-center justify-center space-x-2 cursor-pointer transition-all"
        >
          <Play className="w-5 h-5 fill-black" />
          <span>START RUN #{runCount + 1}</span>
        </motion.button>
      </motion.div>

      {/* High Score Footnote */}
      {formattedBest && (
        <div className="mt-6 text-xs font-mono text-zinc-500">
          Your All-Time Peak: <span className="text-amber-400 font-semibold">{formattedBest}</span>
        </div>
      )}
    </div>
  );
};
