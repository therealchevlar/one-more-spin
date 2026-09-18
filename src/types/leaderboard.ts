export interface RunRecord {
  id: string;
  runNumber: number;
  playerName: string;
  startingWealth: number;
  finalWealth: number;
  peakWealth: number;
  decisionsCount: number;
  outcome: 'CASHOUT' | 'BUST';
  date: string;
  summary: string;
  fatalEvent?: string;
  seed: number;
  isLocalPlayer?: boolean;
}

export interface HallOfFameEntry {
  rank: number;
  playerName: string;
  peakWealth: number;
  decisionsCount: number;
  title: string;
  outcome: 'CASHOUT' | 'BUST';
  avatar: string;
  quote: string;
  isPlayer?: boolean;
}
