import { RunRecord, HallOfFameEntry } from '../types/leaderboard';
import { Achievement } from '../types/achievement';
import { AudioSettings } from '../types/game';
import { INITIAL_ACHIEVEMENTS } from '../data/achievements';
import { INITIAL_HALL_OF_FAME } from '../data/mockLeaderboard';

const RUN_HISTORY_KEY = 'oms_run_history_v1';
const ACHIEVEMENTS_KEY = 'oms_achievements_v1';
const LEADERBOARD_KEY = 'oms_leaderboard_v1';
const AUDIO_SETTINGS_KEY = 'oms_audio_settings_v1';

export class StorageManager {
  // --- RUN HISTORY ---
  static getRunHistory(): RunRecord[] {
    try {
      const data = localStorage.getItem(RUN_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  static saveRun(record: RunRecord): void {
    try {
      const history = this.getRunHistory();
      history.unshift(record); // newest first
      // Keep up to 50 recent runs
      if (history.length > 50) history.pop();
      localStorage.setItem(RUN_HISTORY_KEY, JSON.stringify(history));

      // Also update leaderboard if player peaked high
      this.updateLeaderboardWithRun(record);
    } catch (e) {
      console.error('Failed to save run history', e);
    }
  }

  // --- LEADERBOARD ---
  static getLeaderboard(): HallOfFameEntry[] {
    try {
      const data = localStorage.getItem(LEADERBOARD_KEY);
      if (data) {
        return JSON.parse(data);
      }
      return INITIAL_HALL_OF_FAME;
    } catch {
      return INITIAL_HALL_OF_FAME;
    }
  }

  static updateLeaderboardWithRun(run: RunRecord): void {
    const list = this.getLeaderboard();

    // Check if player already exists in leaderboard, or create new entry
    const playerEntry: HallOfFameEntry = {
      rank: 0,
      playerName: run.playerName || 'You (High Roller)',
      peakWealth: run.peakWealth,
      decisionsCount: run.decisionsCount,
      title: run.outcome === 'CASHOUT' ? 'Sovereign Retiree' : 'Glorious Fallen Tycoon',
      outcome: run.outcome,
      avatar: run.peakWealth > 100_000_000 ? '👑' : run.peakWealth > 1_000_000 ? '🥂' : '🧢',
      quote: run.summary.split('\n')[0] || 'I took the gamble.',
      isPlayer: true,
    };

    // Remove previous player entry if this run is higher peak wealth
    const filtered = list.filter(item => !item.isPlayer || item.peakWealth > run.peakWealth);

    // If new run is greater than player's previous entry, push it
    if (!filtered.some(item => item.isPlayer)) {
      filtered.push(playerEntry);
    }

    // Sort descending by peakWealth
    filtered.sort((a, b) => b.peakWealth - a.peakWealth);

    // Re-assign ranks 1..N
    const ranked = filtered.slice(0, 15).map((entry, idx) => ({
      ...entry,
      rank: idx + 1,
    }));

    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(ranked));
    } catch {}
  }

  // --- ACHIEVEMENTS ---
  static getAchievements(): Achievement[] {
    try {
      const data = localStorage.getItem(ACHIEVEMENTS_KEY);
      if (!data) return INITIAL_ACHIEVEMENTS;

      const savedMap: Record<string, { unlocked: boolean; unlockedAt?: string }> = JSON.parse(data);
      return INITIAL_ACHIEVEMENTS.map(ach => ({
        ...ach,
        unlocked: savedMap[ach.id]?.unlocked ?? false,
        unlockedAt: savedMap[ach.id]?.unlockedAt,
      }));
    } catch {
      return INITIAL_ACHIEVEMENTS;
    }
  }

  static unlockAchievement(id: string): Achievement | null {
    const achievements = this.getAchievements();
    const target = achievements.find(a => a.id === id);
    if (!target || target.unlocked) return null;

    target.unlocked = true;
    target.unlockedAt = new Date().toISOString();

    const saveMap: Record<string, { unlocked: boolean; unlockedAt?: string }> = {};
    achievements.forEach(a => {
      if (a.unlocked) {
        saveMap[a.id] = { unlocked: true, unlockedAt: a.unlockedAt };
      }
    });

    try {
      localStorage.setItem(ACHIEVEMENTS_KEY, JSON.stringify(saveMap));
    } catch {}

    return target;
  }

  // --- AUDIO SETTINGS ---
  static getAudioSettings(): AudioSettings {
    try {
      const data = localStorage.getItem(AUDIO_SETTINGS_KEY);
      return data
        ? JSON.parse(data)
        : { soundEnabled: true, musicEnabled: true, volume: 0.8 };
    } catch {
      return { soundEnabled: true, musicEnabled: true, volume: 0.8 };
    }
  }

  static saveAudioSettings(settings: AudioSettings): void {
    try {
      localStorage.setItem(AUDIO_SETTINGS_KEY, JSON.stringify(settings));
    } catch {}
  }
}
