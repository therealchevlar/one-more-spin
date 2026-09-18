import React, { useEffect, useRef } from 'react';
import { WealthTier } from '../../types/game';

interface ParticleCanvasProps {
  tier: WealthTier;
  riskScore: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  pulseSpeed: number;
}

export const ParticleCanvas: React.FC<ParticleCanvasProps> = ({ tier, riskScore }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Particle color palettes depending on wealth tier
    const getColors = (): string[] => {
      switch (tier) {
        case 'BROKE':
          return ['#64748b', '#94a3b8', '#38bdf8', '#0ea5e9'];
        case 'DOING_WELL':
          return ['#38bdf8', '#818cf8', '#fbbf24', '#f59e0b'];
        case 'RICH':
          return ['#c084fc', '#a855f7', '#fcd34d', '#ffd700'];
        case 'MILLIONAIRE':
          return ['#ffd700', '#fbbf24', '#f59e0b', '#fef08a'];
        case 'TYCOON':
          return ['#34d399', '#10b981', '#fbbf24', '#ffd700'];
        case 'BILLIONAIRE':
          return ['#f43f5e', '#fb7185', '#ffd700', '#e0e7ff'];
        case 'ABSURD':
          return ['#e879f9', '#c084fc', '#67e8f9', '#ffd700'];
        default:
          return ['#ffd700', '#fbbf24', '#f8fafc'];
      }
    };

    const colors = getColors();
    const particleCount = Math.min(65, Math.floor(width / 25));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (0.3 + (riskScore > 70 ? 0.4 : 0.1)),
        vy: -0.2 - Math.random() * 0.5, // gentle upward float
        size: Math.random() * 2.5 + 1.2,
        baseAlpha: Math.random() * 0.4 + 0.1,
        alpha: Math.random() * 0.4 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
        pulseSpeed: 0.02 + Math.random() * 0.03,
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around
        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        // Pulse alpha
        p.alpha = p.baseAlpha + Math.sin(time * p.pulseSpeed * 10) * 0.15;
        p.alpha = Math.max(0.05, Math.min(0.7, p.alpha));

        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = p.size * 3;
        ctx.fill();
        ctx.restore();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
    };
  }, [tier, riskScore]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none z-0 opacity-65"
    />
  );
};
