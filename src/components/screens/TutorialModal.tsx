import React from 'react';
import { motion } from 'framer-motion';
import { HelpCircle, X, Shield, Flame, Zap, DollarSign, Award } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface TutorialModalProps {
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl select-none">
      <motion.div
        initial={{ opacity: 0, scale: 0.94 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.94 }}
        className="w-full max-w-xl max-h-[85vh] flex flex-col rounded-2xl bg-[#0c0d16] border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-white/[0.02]">
          <div className="flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-amber-400" />
            <h3 className="font-display font-bold text-lg text-white">
              RULES OF SURVIVAL
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 text-sm text-zinc-300 font-sans">
          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
            <DollarSign className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white font-mono uppercase text-xs">
                The Starting Bankroll ($100)
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                You begin with $100 of fictional currency. Every round presents a unique, cinematic opportunity with safe or high-risk outcomes.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
            <Flame className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white font-mono uppercase text-xs">
                Push Your Luck & Risk Gauge
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                After every win, you choose: <strong className="text-amber-300">KEEP GOING</strong> or <strong className="text-emerald-300">CASH OUT</strong>. As your wealth and streak grow, the environmental Risk Meter escalates—making potential payouts astronomical, but errors catastrophic.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
            <Zap className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white font-mono uppercase text-xs">
                The Comeback Mechanic
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                If your bankroll drops below $50 or collapses from a peak, special <span className="text-red-400 font-bold">LAST CHANCE</span> desperate scenarios will trigger, giving you one audacious gamble to reclaim your fortune.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.03] border border-white/10 flex items-start space-x-3">
            <Award className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-white font-mono uppercase text-xs">
                Evolving Player Fantasy
              </div>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                From Back-Alley Hustler to Penthouse Oligarch and Cosmic God of Capital—the visuals, soundtrack, and absurdity of decisions evolve alongside your net worth.
              </p>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
