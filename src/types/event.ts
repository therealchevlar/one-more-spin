import { WealthTier } from './game';

export type EventRarity =
  | 'COMMON'
  | 'UNCOMMON'
  | 'RARE'
  | 'EPIC'
  | 'LEGENDARY'
  | 'ABSURD'
  | 'LAST_CHANCE';

export type ChoiceRiskLevel = 'SAFE' | 'RISKY' | 'INSANE' | 'WILDCARD' | 'WALK_AWAY';

export interface ChoiceReward {
  multiplier?: number;
  fixed?: number;
  percentageOfWealth?: number;
  minReward?: number;
}

export interface ChoicePenalty {
  fixedLoss?: number;
  percentageLoss?: number;
  totalBust?: boolean;
}

export interface Choice {
  id: string;
  label: string;
  sublabel?: string;
  riskLevel: ChoiceRiskLevel;
  winProbability: number; // 0.0 to 1.0 (e.g. 0.85 = 85%)
  reward: ChoiceReward;
  penalty: ChoicePenalty;
  winMessage: string;
  loseMessage: string;
  oddsDisplay?: string;
}

export interface GameEvent {
  id: string;
  title: string;
  subtitle?: string;
  description: string;
  rarity: EventRarity;
  minTier: WealthTier;
  maxTier?: WealthTier;
  theme: 'gold' | 'neon' | 'crimson' | 'cyber' | 'emerald' | 'violet';
  soundType?: 'cash' | 'gamble' | 'danger' | 'tech' | 'luxury';
  choices: Choice[];
  isDesperation?: boolean;
}
