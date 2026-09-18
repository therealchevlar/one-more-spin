export type WealthTier =
  | 'BROKE'
  | 'DOING_WELL'
  | 'RICH'
  | 'MILLIONAIRE'
  | 'TYCOON'
  | 'BILLIONAIRE'
  | 'ABSURD';

export interface TierConfig {
  name: string;
  minWealth: number;
  maxWealth: number;
  label: string;
  tagline: string;
  color: string;
  bgAtmosphere: string;
  avatar: string;
}

export const WEALTH_TIERS: Record<WealthTier, TierConfig> = {
  BROKE: {
    name: 'BROKE',
    minWealth: 0,
    maxWealth: 999,
    label: 'Back-Alley Hustler',
    tagline: 'Counting quarters under a buzzing neon sign.',
    color: '#94a3b8',
    bgAtmosphere: 'bg-gradient-to-b from-slate-950 via-zinc-950 to-black',
    avatar: '🧢',
  },
  DOING_WELL: {
    name: 'DOING_WELL',
    minWealth: 1000,
    maxWealth: 99999,
    label: 'Velvet Lounge Regular',
    tagline: 'Top-shelf whiskey and whispers in high-limit corners.',
    color: '#38bdf8',
    bgAtmosphere: 'bg-gradient-to-b from-cyan-950 via-slate-950 to-black',
    avatar: '👔',
  },
  RICH: {
    name: 'RICH',
    minWealth: 100000,
    maxWealth: 999999,
    label: 'High Roller VIP',
    tagline: 'Salon Privé keys, tailored silk, and unblinking floor managers.',
    color: '#a855f7',
    bgAtmosphere: 'bg-gradient-to-b from-purple-950 via-zinc-950 to-black',
    avatar: '💼',
  },
  MILLIONAIRE: {
    name: 'MILLIONAIRE',
    minWealth: 1000000,
    maxWealth: 9999999,
    label: 'Penthouse Oligarch',
    tagline: 'Midnight skyline views and offshore holdings.',
    color: '#ffd700',
    bgAtmosphere: 'bg-gradient-to-b from-amber-950 via-stone-950 to-black',
    avatar: '🥂',
  },
  TYCOON: {
    name: 'TYCOON',
    minWealth: 10000000,
    maxWealth: 99999999,
    label: 'Global Syndicate Titan',
    tagline: 'Helipads in Monaco, private bodyguards, sovereign assets.',
    color: '#10b981',
    bgAtmosphere: 'bg-gradient-to-b from-emerald-950 via-zinc-950 to-black',
    avatar: '🛥️',
  },
  BILLIONAIRE: {
    name: 'BILLIONAIRE',
    minWealth: 100000000,
    maxWealth: 999999999,
    label: 'Apex Plutocrat',
    tagline: 'Private space shuttles and sovereign central bank meetings.',
    color: '#f43f5e',
    bgAtmosphere: 'bg-gradient-to-b from-rose-950 via-zinc-950 to-black',
    avatar: '🚀',
  },
  ABSURD: {
    name: 'ABSURD',
    minWealth: 1000000000,
    maxWealth: Infinity,
    label: 'Cosmic God of Capital',
    tagline: 'Buying tectonic plates, controlling planetary tides.',
    color: '#e879f9',
    bgAtmosphere: 'bg-gradient-to-b from-fuchsia-950 via-neutral-950 to-black',
    avatar: '👑',
  },
};

export interface DecisionRecord {
  step: number;
  eventId: string;
  eventTitle: string;
  choiceLabel: string;
  delta: number;
  wealthBefore: number;
  wealthAfter: number;
  success: boolean;
  narrative: string;
  oddsDisplay: string;
}

export interface ChoiceOutcomeResult {
  success: boolean;
  delta: number;
  wealthBefore: number;
  wealthAfter: number;
  message: string;
  eventTitle: string;
  choiceLabel: string;
  isCatastrophic?: boolean;
  isJackpot?: boolean;
}

export type GameStatus =
  | 'START'
  | 'EVENT_APPEAR'
  | 'DECIDING'
  | 'RESOLVING'
  | 'OUTCOME'
  | 'CASHOUT_CONFIRM'
  | 'CASHOUT_SUCCESS'
  | 'GAME_OVER';

export interface RunState {
  runNumber: number;
  seed: number;
  wealth: number;
  peakWealth: number;
  streak: number;
  decisionsCount: number;
  multiplier: number;
  riskScore: number; // 0 to 100
  tier: WealthTier;
  history: DecisionRecord[];
  biggestWin: number;
  biggestMistake: number;
  status: GameStatus;
  lastOutcome?: ChoiceOutcomeResult;
  fatalEventTitle?: string;
  isDesperate: boolean;
}

export interface AudioSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  volume: number;
}
