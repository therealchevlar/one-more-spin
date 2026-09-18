import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { GameEvent, Choice } from '../../types/event';
import { ChoiceButton } from './ChoiceButton';
import { Sparkles, AlertCircle, Compass, Zap } from 'lucide-react';

interface EventCardProps {
  event: GameEvent;
  onSelectChoice: (choice: Choice) => void;
  disabled?: boolean;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onSelectChoice, disabled }) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [rotX, setRotX] = useState(0);
  const [rotY, setRotY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50 });

  // 3D Perspective Tilt on Mouse Movement (Balatro card feel)
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -7; // degrees
    const rotateY = ((x - centerX) / centerX) * 7;

    setRotX(rotateX);
    setRotY(rotateY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setRotX(0);
    setRotY(0);
    setGlarePos({ x: 50, y: 50 });
  };

  // Rarity Theme Styling
  const getRarityBadge = () => {
    switch (event.rarity) {
      case 'COMMON':
        return {
          label: 'STANDARD OPPORTUNITY',
          border: 'border-zinc-500/40',
          glow: 'rgba(148, 163, 184, 0.2)',
          text: 'text-zinc-300',
          badgeBg: 'bg-zinc-800/80',
        };
      case 'UNCOMMON':
        return {
          label: 'UNCOMMON VENTURE',
          border: 'border-cyan-500/50',
          glow: 'rgba(6, 182, 212, 0.3)',
          text: 'text-cyan-300',
          badgeBg: 'bg-cyan-950/80',
        };
      case 'RARE':
        return {
          label: 'HIGH-ROLLER SPECIAL',
          border: 'border-purple-500/50',
          glow: 'rgba(168, 85, 247, 0.35)',
          text: 'text-purple-300',
          badgeBg: 'bg-purple-950/80',
        };
      case 'EPIC':
        return {
          label: 'SYNDICATE PLAY',
          border: 'border-amber-500/60',
          glow: 'rgba(245, 158, 11, 0.4)',
          text: 'text-amber-300',
          badgeBg: 'bg-amber-950/80',
        };
      case 'LEGENDARY':
        return {
          label: 'LEGENDARY GAMBIT',
          border: 'border-yellow-400/80',
          glow: 'rgba(255, 215, 0, 0.5)',
          text: 'text-yellow-300 font-black',
          badgeBg: 'bg-yellow-950/90',
        };
      case 'ABSURD':
        return {
          label: 'COSMIC ABSURDITY',
          border: 'border-fuchsia-500/80',
          glow: 'rgba(217, 70, 239, 0.5)',
          text: 'text-fuchsia-300 font-black',
          badgeBg: 'bg-fuchsia-950/90',
        };
      case 'LAST_CHANCE':
        return {
          label: '⚠️ LAST CHANCE RESURRECTION ⚠️',
          border: 'border-red-500',
          glow: 'rgba(239, 68, 68, 0.6)',
          text: 'text-red-400 font-extrabold animate-pulse',
          badgeBg: 'bg-red-950',
        };
      default:
        return {
          label: 'EVENT',
          border: 'border-white/20',
          glow: 'rgba(255, 255, 255, 0.1)',
          text: 'text-zinc-300',
          badgeBg: 'bg-zinc-800',
        };
    }
  };

  const rarity = getRarityBadge();

  return (
    <div className="w-full max-w-xl mx-auto perspective-1000 my-auto py-2">
      <motion.div
        ref={cardRef}
        key={event.id}
        initial={{ opacity: 0, y: 40, scale: 0.94, rotateX: 12 }}
        animate={{ opacity: 1, y: 0, scale: 1, rotateX: 0 }}
        exit={{ opacity: 0, y: -40, scale: 0.95 }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotX}deg) rotateY(${rotY}deg)`,
          transformStyle: 'preserve-3d',
          boxShadow: `0 25px 60px -15px rgba(0,0,0,0.9), 0 0 35px ${rarity.glow}`,
        }}
        className={`relative rounded-2xl bg-gradient-to-b from-[#141624] via-[#0c0d16] to-[#080910] border ${rarity.border} p-5 sm:p-7 backdrop-blur-2xl transition-transform duration-100 select-none overflow-hidden`}
      >
        {/* Holographic / Dynamic Light Glare Overlay */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.4) 0%, transparent 60%)`,
          }}
        />

        {/* Card Header: Rarity Badge & Scenario Icon */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3.5 mb-4">
          <div
            className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded-full text-[11px] font-mono font-bold tracking-widest uppercase border ${rarity.badgeBg} ${rarity.border} ${rarity.text}`}
          >
            {event.isDesperation ? (
              <Zap className="w-3.5 h-3.5 text-red-400" />
            ) : (
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>{rarity.label}</span>
          </div>

          <div className="flex items-center space-x-1 text-zinc-500">
            <Compass className="w-4 h-4" />
            <span className="text-[10px] font-mono uppercase tracking-wider">CHANCE DECK</span>
          </div>
        </div>

        {/* Card Scenario Storytelling */}
        <div className="space-y-2 mb-6">
          <h2 className="font-display font-black text-xl sm:text-2xl tracking-wide text-white drop-shadow-md">
            {event.title}
          </h2>

          {event.subtitle && (
            <p className="font-mono text-xs text-amber-400/90 font-medium tracking-wide">
              {event.subtitle}
            </p>
          )}

          <div className="pt-2 text-zinc-300 text-sm sm:text-base leading-relaxed font-sans">
            {event.description}
          </div>
        </div>

        {/* Decision Choices Section */}
        <div className="space-y-3 pt-2 border-t border-white/5">
          <div className="text-[11px] font-mono tracking-widest text-zinc-400 uppercase font-semibold flex items-center justify-between">
            <span>SELECT YOUR ACTION:</span>
            <span className="text-amber-400/80">RISK VS REWARD</span>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {event.choices.map((choice, index) => (
              <ChoiceButton
                key={choice.id}
                choice={choice}
                onSelect={onSelectChoice}
                disabled={disabled}
                shortcutIndex={index + 1}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};
