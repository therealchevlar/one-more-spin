import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { RunRecord } from '../../types/leaderboard';
import { X, History, TrendingUp, Skull, Calendar, ChevronRight } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface RunHistoryModalProps {
  runs: RunRecord[];
  onClose: () => void;
}

export const RunHistoryModal: React.FC<RunHistoryModalProps> = ({ runs, onClose }) => {
  const [selectedRun, setSelectedRun] = useState<RunRecord | null>(null);

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
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-cyan-400" />
            <h3 className="font-display font-bold text-lg text-white">RUN ARCHIVES</h3>
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

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {runs.length === 0 ? (
            <div className="text-center py-12 text-zinc-500 font-mono text-sm">
              No completed runs recorded yet. Start your first game!
            </div>
          ) : (
            <div className="space-y-3">
              {runs.map((run) => (
                <div
                  key={run.id}
                  onClick={() => setSelectedRun(selectedRun?.id === run.id ? null : run)}
                  className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 hover:border-white/15 transition-all cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-9 h-9 rounded-lg flex items-center justify-center border ${
                          run.outcome === 'CASHOUT'
                            ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
                            : 'bg-red-950/60 border-red-500/40 text-red-400'
                        }`}
                      >
                        {run.outcome === 'CASHOUT' ? (
                          <TrendingUp className="w-5 h-5" />
                        ) : (
                          <Skull className="w-5 h-5" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-mono font-bold text-sm text-white">
                            RUN #{run.runNumber}
                          </span>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold uppercase ${
                              run.outcome === 'CASHOUT'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-red-500/10 text-red-400 border border-red-500/20'
                            }`}
                          >
                            {run.outcome === 'CASHOUT' ? 'WALKED AWAY' : 'BUST'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 text-[11px] font-mono text-zinc-400 mt-0.5">
                          <Calendar className="w-3 h-3 text-zinc-500" />
                          <span>{new Date(run.date).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{run.decisionsCount} Decisions</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-mono font-bold text-sm sm:text-base text-amber-300">
                        Peak: {formatMoney(run.peakWealth)}
                      </div>
                      <div className="text-xs font-mono text-zinc-400">
                        Final: {formatMoney(run.finalWealth)}
                      </div>
                    </div>
                  </div>

                  {/* Expanded Run Details & Summary */}
                  {selectedRun?.id === run.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 pt-3 border-t border-white/10 text-xs text-zinc-300 font-sans leading-relaxed whitespace-pre-line bg-black/40 p-3 rounded-lg"
                    >
                      {run.summary}
                    </motion.div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
