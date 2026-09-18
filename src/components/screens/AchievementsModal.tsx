import React from 'react';
import { motion } from 'framer-motion';
import { Achievement } from '../../types/achievement';
import { Award, X, CheckCircle2, Lock } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface AchievementsModalProps {
  achievements: Achievement[];
  onClose: () => void;
}

export const AchievementsModal: React.FC<AchievementsModalProps> = ({ achievements, onClose }) => {
  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case 'DIAMOND':
        return 'text-cyan-400 bg-cyan-950/60 border-cyan-500/40';
      case 'PLATINUM':
        return 'text-slate-300 bg-slate-800/60 border-slate-400/40';
      case 'GOLD':
        return 'text-amber-400 bg-amber-950/60 border-amber-500/40';
      case 'SILVER':
        return 'text-zinc-300 bg-zinc-800/60 border-zinc-500/40';
      default:
        return 'text-amber-600 bg-amber-950/40 border-amber-700/40';
    }
  };

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
            <Award className="w-5 h-5 text-purple-400" />
            <h3 className="font-display font-bold text-lg text-white">
              TROPHY ROOM ({unlockedCount}/{achievements.length})
            </h3>
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

        {/* Grid of Achievements */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all ${
                ach.unlocked
                  ? 'bg-gradient-to-b from-[#171226] to-[#0d0a17] border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]'
                  : 'bg-white/[0.02] border-white/5 opacity-55'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded border uppercase ${getTierBadge(
                      ach.tier
                    )}`}
                  >
                    {ach.tier}
                  </span>
                </div>

                {ach.unlocked ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Lock className="w-4 h-4 text-zinc-600" />
                )}
              </div>

              <div className="font-sans font-bold text-sm text-white mt-2">
                {ach.title}
              </div>

              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {ach.description}
              </p>

              {ach.unlockedAt && (
                <div className="text-[10px] font-mono text-zinc-500 mt-2">
                  Unlocked {new Date(ach.unlockedAt).toLocaleDateString()}
                </div>
              )}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
