import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RunState } from '../../types/game';
import { Skull, RefreshCw, Eye, AlertOctagon } from 'lucide-react';
import { generateRunObituary } from '../../data/obituaries';
import { SeededRNG } from '../../engine/rng';
import { sound } from '../../engine/soundEngine';

interface GameOverScreenProps {
  run: RunState;
  onPlayAgain: () => void;
  onViewRun: () => void;
}

export const GameOverScreen: React.FC<GameOverScreenProps> = ({
  run,
  onPlayAgain,
  onViewRun,
}) => {
  const [drainCounter, setDrainCounter] = useState(run.peakWealth);
  const [drainComplete, setDrainComplete] = useState(false);

  useEffect(() => {
    // Play dramatic bust sound on load
    sound.playBust();

    // Fast drain countdown: starts at peak/last wealth and rolls rapidly down to 0 in 1.2s
    const startVal = run.peakWealth;
    const duration = 1200;
    const startTime = performance.now();

    const animateDrain = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Exponential decay
      const current = Math.round(startVal * (1 - progress));
      setDrainCounter(current);

      if (progress < 1) {
        requestAnimationFrame(animateDrain);
      } else {
        setDrainCounter(0);
        setDrainComplete(true);
      }
    };

    requestAnimationFrame(animateDrain);
  }, [run.peakWealth]);

  const obituary = generateRunObituary(
    run.peakWealth,
    run.decisionsCount,
    run.biggestWin,
    run.biggestMistake,
    run.fatalEventTitle || 'greed',
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
      {/* Red Shattered Emblem */}
      <motion.div
        initial={{ scale: 0.8, rotate: 10 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', damping: 15 }}
        className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-400 p-0.5 shadow-[0_0_40px_rgba(239,68,68,0.4)] mb-4"
      >
        <div className="w-full h-full bg-[#18080a] rounded-[14px] flex items-center justify-center text-red-500">
          <Skull className="w-8 h-8" />
        </div>
      </motion.div>

      {/* Dramatic Wealth Drain Counter */}
      <div className="w-full rounded-2xl bg-gradient-to-b from-[#240d0f] via-[#14080a] to-[#070304] border border-red-500/30 p-5 mb-5 shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_30px_rgba(239,68,68,0.2)]">
        <div className="text-[10px] font-mono tracking-widest text-red-400 uppercase font-semibold">
          LIQUIDATION IN PROGRESS
        </div>
        <div className="font-mono font-black text-4xl sm:text-5xl text-red-400 py-1 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]">
          {formatMoney(drainCounter)}
        </div>
        <div className="text-[11px] font-mono text-zinc-500">
          Fatal Turn: <span className="text-zinc-300 font-semibold">{run.fatalEventTitle || 'Fatal Gamble'}</span>
        </div>
      </div>

      {/* Main Collapse Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="font-display font-black text-3xl sm:text-4xl text-white tracking-wide mb-1"
      >
        YOUR EMPIRE COLLAPSED
      </motion.h2>

      <p className="text-red-400 font-mono text-xs tracking-widest uppercase mb-6">
        Total Financial Ruin • Run #{run.runNumber} Terminated
      </p>

      {/* Run Summary Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 w-full mb-5">
        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Final Wealth</div>
          <div className="text-base font-mono font-black text-red-400 mt-0.5">$0</div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Peak Wealth</div>
          <div className="text-base font-mono font-bold text-amber-400 mt-0.5">
            {formatMoney(run.peakWealth)}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Decisions</div>
          <div className="text-base font-mono font-bold text-white mt-0.5">
            {run.decisionsCount}
          </div>
        </div>

        <div className="p-3 rounded-xl bg-white/[0.03] border border-white/10">
          <div className="text-[10px] font-mono text-zinc-400 uppercase">Biggest Win</div>
          <div className="text-base font-mono font-bold text-emerald-400 mt-0.5">
            +{formatMoney(run.biggestWin)}
          </div>
        </div>
      </div>

      {/* Procedural AI Obituary Roast */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="w-full p-4 rounded-xl bg-black/50 border border-white/5 text-xs sm:text-sm text-zinc-300 font-sans leading-relaxed text-left whitespace-pre-line mb-6 italic"
      >
        "{obituary}"
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
          className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-extrabold text-sm font-mono flex items-center justify-center space-x-2 shadow-[0_0_25px_rgba(255,215,0,0.3)] transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>PLAY AGAIN ($100)</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            sound.playChipClick();
            onViewRun();
          }}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-zinc-200 font-semibold text-sm flex items-center justify-center space-x-2 transition-all cursor-pointer"
        >
          <Eye className="w-4 h-4 text-cyan-400" />
          <span>VIEW RUN LOGS</span>
        </motion.button>
      </div>
    </motion.div>
  );
};
