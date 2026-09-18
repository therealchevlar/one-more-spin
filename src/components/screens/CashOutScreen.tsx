import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { RunState } from '../../types/game';
import { Trophy, RefreshCw, Award, ArrowRight } from 'lucide-react';
import { generateCashOutStory } from '../../data/obituaries';
import { SeededRNG } from '../../engine/rng';
import { sound } from '../../engine/soundEngine';

interface CashOutScreenProps {
  run: RunState;
  onPlayAgain: () => void;
  onOpenLeaderboard: () => void;
}

export const CashOutScreen: React.FC<CashOutScreenProps> = ({
  run,
  onPlayAgain,
  onOpenLeaderboard,
}) => {
  useEffect(() => {
    // Tasteful celebratory confetti shower (gold, amber, emerald)
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ffd700', '#f59e0b', '#10b981', '#38bdf8', '#fef08a'],
    });

    const timer = setTimeout(() => {
      confetti({
        particleCount: 50,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#ffd700', '#10b981'],
      });
      confetti({
        particleCount: 50,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#ffd700', '#38bdf8'],
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const retirementStory = generateCashOutStory(
    run.wealth,
    run.decisionsCount,
    run.streak,
    new SeededRNG(run.seed)
  );

  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-[85vh] flex flex-col items-center justify-center px-4 py-8 max-w-xl mx-auto text-center select-none z-10"
    >
      {/* Triumphant Golden Crown Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15, stiffness: 200 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 p-0.5 shadow-[0_0_35px_rgba(255,215,0,0.4)] mb-4"
      >
        <div className="w-full h-full bg-[#0c0d16] rounded-[14px] flex items-center justify-center text-amber-400">
          <Trophy className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Main Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide mb-1"
      >
        YOU WALKED AWAY
      </motion.h2>

      <p className="text-amber-400/90 font-mono text-xs tracking-widest uppercase mb-6">
        Bankroll Secured • Run #{run.runNumber} Concluded
      </p>

      {/* Large Wealth Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="w-full rounded-2xl bg-gradient-to-b from-[#1c1a14] via-[#101016] to-[#0a0a0f] border border-amber-500/30 p-6 shadow-[0_15px_40px_rgba(0,0,0,0.8),0_0_25px_rgba(255,215,0,0.15)] mb-6"
      >
        <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
          Final Accumulated Fortune
        </div>
        <div className="font-mono font-black text-4xl sm:text-5xl text-gold-gradient py-2">
          {formatMoney(run.wealth)}
        </div>
        <div className="text-xs font-mono text-zinc-500">
          Started with $100 • Return: {((run.wealth / 100) * 100).toLocaleString()}%
        </div>
      </motion.div>

      {/* Stats Breakdown Grid */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="grid grid-cols-3 gap-3 w-full mb-6"
      >
        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Peak Wealth</div>
          <div className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
            {formatMoney(run.peakWealth)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Decisions Survived</div>
          <div className="text-sm sm:text-base font-mono font-bold text-white mt-0.5">
            {run.decisionsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.04] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Winning Streak</div>
          <div className="text-sm sm:text-base font-mono font-bold text-amber-400 mt-0.5">
            {run.streak} Wins
          </div>
        </div>
      </motion.div>

      {/* Procedural Retirement Story */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="w-full p-4 rounded-xl bg-black/40 border border-white/5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed text-left whitespace-pre-line mb-6"
      >
        {retirementStory}
      </motion.div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4 w-full">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playChipClick();
            onPlayAgain();
          }}
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm font-mono flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>START NEXT RUN</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playChipClick();
            onOpenLeaderboard();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Award className="w-4 h-4 text-amber-400" />
          <span>VIEW HALL OF FAME</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
