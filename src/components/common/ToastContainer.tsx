import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Achievement } from '../../types/achievement';
import { Award, Sparkles } from 'lucide-react';

interface ToastContainerProps {
  toasts: Achievement[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-2 pointer-events-none select-none max-w-sm w-full px-4 sm:px-0">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.85 }}
            transition={{ type: 'spring', damping: 20, stiffness: 250 }}
            className="pointer-events-auto p-4 rounded-xl bg-gradient-to-r from-[#1b1429] to-[#120d1c] border border-amber-500/50 shadow-[0_10px_30px_rgba(0,0,0,0.8),0_0_20px_rgba(255,215,0,0.2)] flex items-center space-x-3 cursor-pointer"
            onClick={() => onDismiss(toast.id)}
          >
            <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
              <Award className="w-5 h-5" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5">
                <Sparkles className="w-3 h-3 text-amber-400 animate-spin" />
                <span className="text-[10px] font-mono tracking-widest text-amber-400 uppercase font-bold">
                  ACHIEVEMENT UNLOCKED
                </span>
              </div>
              <div className="font-bold text-white text-sm truncate">
                {toast.title}
              </div>
              <p className="text-xs text-zinc-400 line-clamp-1">
                {toast.description}
              </p>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
