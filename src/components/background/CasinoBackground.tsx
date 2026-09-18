import React from 'react';
import { WealthTier, WEALTH_TIERS } from '../../types/game';
import { ParticleCanvas } from './ParticleCanvas';

interface CasinoBackgroundProps {
  tier: WealthTier;
  riskScore: number;
}

export const CasinoBackground: React.FC<CasinoBackgroundProps> = ({ tier, riskScore }) => {
  const currentTierConfig = WEALTH_TIERS[tier];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none -z-10 bg-[#050508] transition-colors duration-1000">
      {/* Dynamic Tier Gradient Base */}
      <div
        className={`absolute inset-0 opacity-40 transition-opacity duration-1000 ${currentTierConfig.bgAtmosphere}`}
      />

      {/* Atmospheric Radial Spotlights */}
      <div
        className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full blur-[140px] opacity-35 transition-all duration-1000"
        style={{ backgroundColor: currentTierConfig.color }}
      />

      {/* High Risk Ambient Warning Aura */}
      {riskScore > 65 && (
        <div
          className="absolute inset-0 bg-red-950/20 mix-blend-screen transition-opacity duration-700 pointer-events-none"
          style={{ opacity: (riskScore - 65) / 40 }}
        />
      )}

      {/* Ambient Vignette & Cinema Letterboxing Feel */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(5,5,8,0.85)_100%)]" />

      {/* Subtle Casino Carpet / Velvet Geometric Pattern */}
      <div
        className="absolute inset-0 opacity-[0.04] bg-[radial-gradient(#ffd700_1px,transparent_1px)] [background-size:28px_28px]"
      />

      {/* Moving Particles */}
      <ParticleCanvas tier={tier} riskScore={riskScore} />

      {/* Bottom Floor Reflection Sheen */}
      <div className="absolute bottom-0 inset-x-0 h-48 bg-gradient-to-t from-black via-black/60 to-transparent" />
    </div>
  );
};
