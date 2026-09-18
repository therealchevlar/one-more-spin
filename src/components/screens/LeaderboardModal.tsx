import React from 'react';
import { motion } from 'framer-motion';
import { HallOfFameEntry } from '../../types/leaderboard';
import { Trophy, X, Crown, Medal } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface LeaderboardModalProps {
  entries: HallOfFameEntry[];
  onClose: () => void;
}

export const LeaderboardModal: React.FC<LeaderboardModalProps> = ({ entries, onClose }) => {
  const formatMoney = (n: number) =>
    new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(n);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-2xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0c0d16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">HALL OF FAME</h3>
          </div>
          <button
            onClick={() => {
              sound.playChipClick();
              onClose();
            }}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Tycoons */}
        <div className="flex-1 overflow-y-auto p-6 space-y-3">
          {entries.map((entry, index) => {
            const isTop3 = index < 3;
            const rankMedal =
              index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${entry.rank}`;

            return (
              <div
                key={entry.rank}
                className={`p-4 rounded-xl border transition-all ${
                  entry.isPlayer
                    ? 'bg-amber-950/40 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.2)] ring-1 ring-amber-500/30'
                    : isTop3
                    ? 'bg-white/[0.04] border-white/15'
                    : 'bg-white/[0.02] border-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-lg font-black w-7 text-center">
                      {rankMedal}
                    </span>

                    <span className="text-2xl">{entry.avatar}</span>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-sm text-white">
                          {entry.playerName}
                        </span>
                        {entry.isPlayer && (
                          <span className="bg-amber-500 text-black text-[9px] font-black px-1.5 py-0.5 rounded uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        {entry.title} • {entry.decisionsCount} Decisions
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="font-mono font-black text-sm sm:text-base text-amber-300">
                      {formatMoney(entry.peakWealth)}
                    </div>
                    <span
                      className={`text-[10px] font-mono uppercase font-bold ${
                        entry.outcome === 'CASHOUT' ? 'text-emerald-400' : 'text-red-400'
                      }`}
                    >
                      {entry.outcome === 'CASHOUT' ? 'CASHED OUT' : 'COLLAPSED'}
                    </span>
                  </div>
                </div>

                {entry.quote && (
                  <p className="mt-2 text-xs text-zinc-400 italic pl-12 border-l-2 border-white/10">
                    "{entry.quote}"
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
