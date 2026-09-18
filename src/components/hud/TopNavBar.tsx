import React from 'react';
import { Volume2, VolumeX, Music, Trophy, History, Award, HelpCircle } from 'lucide-react';
import { sound } from '../../engine/soundEngine';

interface TopNavBarProps {
  soundEnabled: boolean;
  musicEnabled: boolean;
  onToggleSound: () => void;
  onToggleMusic: () => void;
  onOpenHistory: () => void;
  onOpenLeaderboard: () => void;
  onOpenAchievements: () => void;
  onOpenTutorial: () => void;
}

export const TopNavBar: React.FC<TopNavBarProps> = ({
  soundEnabled,
  musicEnabled,
  onToggleSound,
  onToggleMusic,
  onOpenHistory,
  onOpenLeaderboard,
  onOpenAchievements,
  onOpenTutorial,
}) => {
  const handleClick = (callback: () => void) => {
    sound.playChipClick();
    callback();
  };

  return (
    <header className="w-full max-w-6xl mx-auto px-4 py-3 flex items-center justify-between border-b border-white/5 backdrop-blur-md z-30 select-none">
      {/* Brand Title */}
      <div className="flex items-center space-x-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-amber-600 to-yellow-300 p-0.5 shadow-[0_0_15px_rgba(255,215,0,0.3)]">
          <div className="w-full h-full bg-[#0c0d14] rounded-[7px] flex items-center justify-center font-display font-black text-amber-400 text-sm">
            $
          </div>
        </div>
        <div className="flex flex-col">
          <span className="font-display font-bold text-sm md:text-base tracking-[0.15em] text-white">
            ONE MORE SPIN
          </span>
          <span className="text-[9px] font-mono tracking-widest text-zinc-500 uppercase">
            High Stakes Roguelite
          </span>
        </div>
      </div>

      {/* Action Controls & Navigation */}
      <div className="flex items-center space-x-1 sm:space-x-2">
        {/* Sound FX Toggle */}
        <button
          onClick={() => handleClick(onToggleSound)}
          title={soundEnabled ? 'Mute Sound Effects' : 'Enable Sound Effects'}
          className={`p-2 rounded-lg transition-colors border ${
            soundEnabled
              ? 'text-amber-400 bg-amber-500/10 border-amber-500/20 hover:bg-amber-500/20'
              : 'text-zinc-500 bg-white/5 border-white/10 hover:text-zinc-300'
          }`}
        >
          {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
        </button>

        {/* Ambient Music Toggle */}
        <button
          onClick={() => handleClick(onToggleMusic)}
          title={musicEnabled ? 'Mute Casino Music' : 'Play Casino Music'}
          className={`p-2 rounded-lg transition-colors border ${
            musicEnabled
              ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20 hover:bg-emerald-500/20'
              : 'text-zinc-500 bg-white/5 border-white/10 hover:text-zinc-300'
          }`}
        >
          <Music className="w-4 h-4" />
        </button>

        <div className="w-[1px] h-5 bg-white/10 mx-1 hidden sm:block" />

        {/* Leaderboard */}
        <button
          onClick={() => handleClick(onOpenLeaderboard)}
          title="Hall of Fame"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all hover:text-amber-300"
        >
          <Trophy className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden md:inline">Hall of Fame</span>
        </button>

        {/* Achievements */}
        <button
          onClick={() => handleClick(onOpenAchievements)}
          title="Achievements"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all hover:text-amber-300"
        >
          <Award className="w-3.5 h-3.5 text-purple-400" />
          <span className="hidden md:inline">Trophies</span>
        </button>

        {/* Run History */}
        <button
          onClick={() => handleClick(onOpenHistory)}
          title="Run History"
          className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-zinc-300 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-amber-500/30 transition-all hover:text-amber-300"
        >
          <History className="w-3.5 h-3.5 text-cyan-400" />
          <span className="hidden md:inline">Runs</span>
        </button>

        {/* Tutorial */}
        <button
          onClick={() => handleClick(onOpenTutorial)}
          title="Rules & How to Play"
          className="p-2 rounded-lg text-zinc-400 bg-white/5 hover:bg-white/10 border border-white/10 hover:text-zinc-200 transition-colors"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};
