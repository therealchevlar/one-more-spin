import { WealthTier, ChoiceOutcomeResult, RunState } from '../types/game';
import { GameEvent, Choice } from '../types/event';
import { ALL_EVENTS } from '../data/allEvents';
import { SeededRNG } from './rng';
import { StorageManager } from './storage';
import { Achievement } from '../types/achievement';

const TIER_ORDER: WealthTier[] = [
  'BROKE',
  'DOING_WELL',
  'RICH',
  'MILLIONAIRE',
  'TYCOON',
  'BILLIONAIRE',
  'ABSURD',
];

export function getTierOrderIndex(tier: WealthTier): number {
  return TIER_ORDER.indexOf(tier);
}

export function determineWealthTier(wealth: number): WealthTier {
  if (wealth >= 1_000_000_000) return 'ABSURD';
  if (wealth >= 100_000_000) return 'BILLIONAIRE';
  if (wealth >= 10_000_000) return 'TYCOON';
  if (wealth >= 1_000_000) return 'MILLIONAIRE';
  if (wealth >= 100_000) return 'RICH';
  if (wealth >= 1_000) return 'DOING_WELL';
  return 'BROKE';
}

export function calculateRiskScore(wealth: number, streak: number, decisionsCount: number): number {
  // Base risk starts at 20%
  let score = 20;

  // Wealth factor: larger fortunes bring higher environmental danger
  if (wealth >= 1_000_000_000) score += 45;
  else if (wealth >= 100_000_000) score += 38;
  else if (wealth >= 10_000_000) score += 30;
  else if (wealth >= 1_000_000) score += 24;
  else if (wealth >= 100_000) score += 18;
  else if (wealth >= 10_000) score += 12;
  else if (wealth >= 1_000) score += 6;

  // Streak factor: push-your-luck heat increases with consecutive wins
  score += Math.min(streak * 2.5, 25);

  // Fatigue / deep run pressure
  score += Math.min(decisionsCount * 0.5, 10);

  return Math.min(Math.round(score), 95);
}

export function selectNextEvent(
  wealth: number,
  tier: WealthTier,
  rng: SeededRNG,
  isDesperate: boolean,
  seenEventIds: Set<string>
): GameEvent {
  // Desperation check: If money is down to <= $40, or user lost 90% of a massive peak
  if (isDesperate || wealth <= 40) {
    const desperationEvents = ALL_EVENTS.filter(e => e.isDesperation);
    if (desperationEvents.length > 0) {
      const unseen = desperationEvents.filter(e => !seenEventIds.has(e.id));
      return unseen.length > 0 ? rng.pick(unseen) : rng.pick(desperationEvents);
    }
  }

  const currentTierIdx = getTierOrderIndex(tier);

  // Filter events matching the tier range
  let eligible = ALL_EVENTS.filter(e => {
    if (e.isDesperation) return false;
    const minIdx = getTierOrderIndex(e.minTier);
    const maxIdx = e.maxTier ? getTierOrderIndex(e.maxTier) : Infinity;
    return currentTierIdx >= minIdx && currentTierIdx <= maxIdx;
  });

  if (eligible.length === 0) {
    // Fallback to any non-desperation event
    eligible = ALL_EVENTS.filter(e => !e.isDesperation);
  }

  // Filter for unseen in this run
  const unseen = eligible.filter(e => !seenEventIds.has(e.id));
  if (unseen.length > 0) {
    return rng.pick(unseen);
  }

  // If all seen, pick from eligible pool
  return rng.pick(eligible);
}

export function resolveChoice(
  choice: Choice,
  currentWealth: number,
  event: GameEvent,
  rng: SeededRNG
): ChoiceOutcomeResult {
  if (choice.riskLevel === 'WALK_AWAY') {
    return {
      success: true,
      delta: 0,
      wealthBefore: currentWealth,
      wealthAfter: currentWealth,
      message: 'You took a step back and kept your chips safe.',
      eventTitle: event.title,
      choiceLabel: choice.label,
    };
  }

  const roll = rng.next(); // [0, 1)
  const isSuccess = roll < choice.winProbability;

  let delta = 0;

  if (isSuccess) {
    // Calculate Win Reward
    if (choice.reward.multiplier !== undefined) {
      delta += currentWealth * (choice.reward.multiplier - 1);
    }
    if (choice.reward.percentageOfWealth !== undefined) {
      delta += currentWealth * choice.reward.percentageOfWealth;
    }
    if (choice.reward.fixed !== undefined) {
      delta += choice.reward.fixed;
    }
    if (choice.reward.minReward !== undefined && delta < choice.reward.minReward) {
      delta = choice.reward.minReward;
    }

    // Round clean numbers
    delta = Math.max(10, Math.round(delta));
  } else {
    // Calculate Loss Penalty
    if (choice.penalty.totalBust) {
      delta = -currentWealth;
    } else {
      if (choice.penalty.percentageLoss !== undefined) {
        delta -= currentWealth * choice.penalty.percentageLoss;
      }
      if (choice.penalty.fixedLoss !== undefined) {
        delta -= choice.penalty.fixedLoss;
      }
      // Never lose more than current wealth
      if (Math.abs(delta) > currentWealth) {
        delta = -currentWealth;
      }
      delta = Math.round(delta);
    }
  }

  const wealthAfter = Math.max(0, currentWealth + delta);
  const isJackpot = isSuccess && (delta >= 100_000 || (delta >= 1_000 && delta >= currentWealth * 2));
  const isCatastrophic = !isSuccess && (wealthAfter === 0 || Math.abs(delta) >= currentWealth * 0.7);

  return {
    success: isSuccess,
    delta,
    wealthBefore: currentWealth,
    wealthAfter,
    message: isSuccess ? choice.winMessage : choice.loseMessage,
    eventTitle: event.title,
    choiceLabel: choice.label,
    isJackpot,
    isCatastrophic,
  };
}

export function checkAchievements(run: RunState): Achievement[] {
  const unlocked: Achievement[] = [];

  // FIRST MILLION
  if (run.wealth >= 1_000_000) {
    const a = StorageManager.unlockAchievement('first_million');
    if (a) unlocked.push(a);
  }

  // GREED (continued with over $1M)
  if (run.wealth >= 1_000_000 && run.decisionsCount > 1) {
    const a = StorageManager.unlockAchievement('greed');
    if (a) unlocked.push(a);
  }

  // IDIOT (lost 95%+ of peak)
  if (run.peakWealth >= 100_000 && run.wealth <= run.peakWealth * 0.05) {
    const a = StorageManager.unlockAchievement('idiot');
    if (a) unlocked.push(a);
  }

  // ABSURD OPULENCE
  if (run.wealth >= 1_000_000_000) {
    const a = StorageManager.unlockAchievement('absurd_fortune');
    if (a) unlocked.push(a);
  }

  // JUST ONE MORE (50 decisions)
  if (run.decisionsCount >= 50) {
    const a = StorageManager.unlockAchievement('one_more_spin');
    if (a) unlocked.push(a);
  }

  // FROM NOTHING ($100M from $100)
  if (run.wealth >= 100_000_000) {
    const a = StorageManager.unlockAchievement('from_nothing');
    if (a) unlocked.push(a);
  }

  // PHOENIX (survived comeback back to $50k)
  if (run.isDesperate && run.wealth >= 50_000) {
    const a = StorageManager.unlockAchievement('phoenix_resurrection');
    if (a) unlocked.push(a);
  }

  // HOT HAND (10 streak)
  if (run.streak >= 10) {
    const a = StorageManager.unlockAchievement('hot_hand');
    if (a) unlocked.push(a);
  }

  // SPECTACULAR RUIN (lost $20M+ down to 0)
  if (run.peakWealth >= 20_000_000 && run.wealth === 0) {
    const a = StorageManager.unlockAchievement('spectacular_ruin');
    if (a) unlocked.push(a);
  }

  return unlocked;
}
