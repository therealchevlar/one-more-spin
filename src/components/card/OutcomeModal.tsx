import React from 'react';
import { motion } from 'framer-motion';
import { ChoiceOutcomeResult } from '../../types/game';
import { sound } from '../../engine/soundEngine';
import { TrendingUp, TrendingDown, ArrowRight, LogOut, Sparkles } from 'lucide-react';

interface OutcomeModalProps {
  outcome: ChoiceOutcomeResult;
  riskScore: number;
  onKeepGoing: () => void;
  onCashOut: () => void;
}

export const OutcomeModal: React.FC<OutcomeModalProps> = ({
  outcome,
  riskScore,
  onKeepGoing,
  onCashOut,
}) => {
  const isWin = outcome.success;

  const handleKeepGoing = () => {
    sound.playChipClick();
    onKeepGoing();
  };

  const handleCashOut = () => {
    sound.playCashOut();
    onCashOut();
  };

  const formattedDelta = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(Math.abs(outcome.delta));

  const formattedNewWealth = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(outcome.wealthAfter);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
    >
      <motion.div
        initial={{ scale: 0.88, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ type: 'spring', damping: 24, stiffness: 300 }}
        className={`w-full max-w-lg rounded-2xl p-6 sm:p-8 backdrop-blur-2xl border ${
          isWin
            ? 'bg-gradient-to-b from-[#111e17] via-[#0d1410] to-[#070b09] border-emerald-500/40 shadow-[0_0_50px_rgba(16,185,129,0.25)]'
            : 'bg-gradient-to-b from-[#241113] via-[#160c0e] to-[#0a0607] border-red-500/40 shadow-[0_0_50px_rgba(239,68,68,0.25)]'
        }`}
      >
        {/* Outcome Header Badge */}
        <div className="flex flex-col items-center text-center space-y-2 mb-4">
          <div
            className={`w-14 h-14 rounded-2xl flex items-center justify-center border shadow-lg ${
              isWin
                ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-400'
                : 'bg-red-500/20 border-red-500/40 text-red-400'
            }`}
          >
            {isWin ? <TrendingUp className="w-8 h-8" /> : <TrendingDown className="w-8 h-8" />}
          </div>

          <span className="text-[11px] font-mono tracking-[0.25em] text-zinc-400 uppercase font-semibold">
            {outcome.eventTitle}
          </span>

          <h3 className="font-display font-black text-2xl sm:text-3xl text-white">
            {isWin ? (outcome.isJackpot ? 'JACKPOT STRIKE!' : 'PROFITABLE OUTCOME!') : 'HEAVY HIT!'}
          </h3>
        </div>

        {/* Delta Amount Banner */}
        <div className="py-4 my-2 text-center rounded-xl bg-black/40 border border-white/5">
          <span
            className={`font-mono font-black text-3xl sm:text-4xl tracking-tight ${
              isWin ? 'text-emerald-400 drop-shadow-[0_0_20px_rgba(16,185,129,0.5)]' : 'text-red-400 drop-shadow-[0_0_20px_rgba(239,68,68,0.5)]'
            }`}
          >
            {outcome.delta >= 0 ? `+${formattedDelta}` : `-${formattedDelta}`}
          </span>
          <div className="text-xs font-mono text-zinc-400 mt-1">
            Current Bankroll: <span className="text-white font-bold">{formattedNewWealth}</span>
          </div>
        </div>

        {/* Narrative Consequence */}
        <p className="text-sm text-zinc-300 text-center leading-relaxed mb-6 font-sans px-2">
          {outcome.message}
        </p>

        {/* THE CENTRAL DILEMMA: KEEP GOING OR CASH OUT? */}
        <div className="space-y-3 pt-2 border-t border-white/10">
          <div className="text-center text-[11px] font-mono tracking-widest text-zinc-400 uppercase">
            THE MOMENT OF TRUTH: CASH OUT OR PUSH YOUR LUCK?
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* CASH OUT BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCashOut}
              className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 hover:border-amber-400/40 text-zinc-200 font-semibold text-sm transition-all cursor-pointer"
            >
              <LogOut className="w-4 h-4 text-amber-400" />
              <span>CASH OUT ({formattedNewWealth})</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 border border-white/10">
                [C]
              </span>
            </motion.button>

            {/* KEEP GOING BUTTON */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleKeepGoing}
              className="flex items-center justify-center space-x-2 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-500 text-black font-extrabold text-sm shadow-[0_0_25px_rgba(255,215,0,0.4)] transition-all cursor-pointer"
            >
              <span>KEEP GOING</span>
              <span className="hidden sm:inline-block text-[10px] font-mono px-1.5 py-0.5 rounded bg-black/20 text-black border border-black/20 font-bold">
                [SPACE]
              </span>
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>

          <div className="text-center text-[10px] font-mono text-zinc-500">
            Next turn risk: approx. <span className="text-amber-400 font-bold">{Math.min(riskScore + 4, 95)}%</span>.
            "One more spin won't hurt... right?"
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
