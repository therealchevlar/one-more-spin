export type AchievementTier = 'BRONZE' | 'SILVER' | 'GOLD' | 'PLATINUM' | 'DIAMOND';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  tier: AchievementTier;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  hidden?: boolean;
}
