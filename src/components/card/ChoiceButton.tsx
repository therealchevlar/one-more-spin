import React from 'react';
import { motion } from 'framer-motion';
import { Choice } from '../../types/event';
import { sound } from '../../engine/soundEngine';
import { ShieldCheck, Flame, Skull, HelpCircle, LogOut } from 'lucide-react';

interface ChoiceButtonProps {
  choice: Choice;
  onSelect: (choice: Choice) => void;
  disabled?: boolean;
  shortcutIndex?: number;
}

export const ChoiceButton: React.FC<ChoiceButtonProps> = ({
  choice,
  onSelect,
  disabled,
  shortcutIndex,
}) => {
  const handleMouseEnter = () => {
    if (!disabled) {
      sound.playChipClick();
    }
  };

  const handleClick = () => {
    if (!disabled) {
      onSelect(choice);
    }
  };

  // Theme styling based on risk level
  const getRiskBadge = () => {
    switch (choice.riskLevel) {
      case 'SAFE':
        return {
          icon: <ShieldCheck className="w-4 h-4 text-emerald-400" />,
          label: 'SAFE OPPORTUNITY',
          badgeClass: 'bg-emerald-950/80 text-emerald-400 border-emerald-500/30',
          btnBorder: 'hover:border-emerald-500/60 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]',
          accent: 'border-l-4 border-l-emerald-500',
        };
      case 'RISKY':
        return {
          icon: <Flame className="w-4 h-4 text-amber-400" />,
          label: 'HIGH RISK',
          badgeClass: 'bg-amber-950/80 text-amber-400 border-amber-500/30',
          btnBorder: 'hover:border-amber-500/60 hover:shadow-[0_0_25px_rgba(245,158,11,0.25)]',
          accent: 'border-l-4 border-l-amber-500',
        };
      case 'INSANE':
        return {
          icon: <Skull className="w-4 h-4 text-red-400" />,
          label: 'EXTREME GAMBLE',
          badgeClass: 'bg-red-950/80 text-red-400 border-red-500/30 animate-pulse',
          btnBorder: 'hover:border-red-500/70 hover:shadow-[0_0_30px_rgba(239,68,68,0.35)]',
          accent: 'border-l-4 border-l-red-500',
        };
      case 'WALK_AWAY':
        return {
          icon: <LogOut className="w-4 h-4 text-zinc-400" />,
          label: 'PASS',
          badgeClass: 'bg-zinc-800/80 text-zinc-400 border-zinc-600/30',
          btnBorder: 'hover:border-zinc-400/40',
          accent: 'border-l-4 border-l-zinc-500',
        };
      default:
        return {
          icon: <HelpCircle className="w-4 h-4 text-cyan-400" />,
          label: 'WILDCARD',
          badgeClass: 'bg-cyan-950/80 text-cyan-400 border-cyan-500/30',
          btnBorder: 'hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.2)]',
          accent: 'border-l-4 border-l-cyan-500',
        };
    }
  };

  const riskStyle = getRiskBadge();

  return (
    <motion.button
      whileHover={disabled ? {} : { scale: 1.015, y: -2 }}
      whileTap={disabled ? {} : { scale: 0.985 }}
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
      disabled={disabled}
      className={`group relative w-full text-left p-4 rounded-xl backdrop-blur-xl bg-[#0e101a]/85 border border-white/10 transition-all duration-200 cursor-pointer overflow-hidden ${riskStyle.accent} ${riskStyle.btnBorder} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
    >
      {/* Subtle hover gradient wash */}
      <div className="absolute inset-0 bg-gradient-to-r from-white/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      <div className="flex flex-col space-y-2">
        {/* Top line: Risk Badge + Win Probability Odds */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1.5">
            <span
              className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider uppercase border ${riskStyle.badgeClass}`}
            >
              {riskStyle.icon}
              <span>{riskStyle.label}</span>
            </span>

            {shortcutIndex !== undefined && (
              <span className="hidden sm:inline-block font-mono text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-zinc-400 border border-white/10">
                [{shortcutIndex}]
              </span>
            )}
          </div>

          {choice.oddsDisplay && (
            <span className="font-mono text-xs font-bold text-zinc-300 tracking-wider bg-black/40 px-2 py-0.5 rounded border border-white/5">
              {choice.oddsDisplay}
            </span>
          )}
        </div>

        {/* Choice Main Label */}
        <div className="font-sans font-bold text-base sm:text-lg text-white group-hover:text-amber-200 transition-colors">
          {choice.label}
        </div>

        {/* Sublabel / Strategy Description */}
        {choice.sublabel && (
          <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed font-normal">
            {choice.sublabel}
          </p>
        )}

        {/* Quick Upside Preview */}
        <div className="pt-1 flex items-center space-x-3 text-[11px] font-mono text-zinc-500">
          {choice.reward.multiplier && (
            <span className="text-emerald-400/90 font-semibold">
              Potential: {choice.reward.multiplier}x Payout
            </span>
          )}
          {choice.reward.percentageOfWealth && (
            <span className="text-emerald-400/90 font-semibold">
              Up to +{Math.round(choice.reward.percentageOfWealth * 100)}% Net Worth
            </span>
          )}
          {choice.penalty.totalBust && (
            <span className="text-red-400/90 font-semibold">
              Downside: TOTAL RUIN ($0)
            </span>
          )}
        </div>
      </div>
    </motion.button>
  );
};
