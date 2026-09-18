import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { RunState, WealthTier, ChoiceOutcomeResult } from './types/game';
import { GameEvent, Choice } from './types/event';
import { Achievement } from './types/achievement';
import { SeededRNG } from './engine/rng';
import { sound } from './engine/soundEngine';
import { StorageManager } from './engine/storage';
import {
  determineWealthTier,
  calculateRiskScore,
  selectNextEvent,
  resolveChoice,
  checkAchievements,
} from './engine/gameEngine';
import { generateRunObituary } from './data/obituaries';

// Components
import { CasinoBackground } from './components/background/CasinoBackground';
import { TopNavBar } from './components/hud/TopNavBar';
import { WealthCounter } from './components/hud/WealthCounter';
import { RiskMeter } from './components/hud/RiskMeter';
import { StreakTracker } from './components/hud/StreakTracker';
import { EventCard } from './components/card/EventCard';
import { OutcomeModal } from './components/card/OutcomeModal';
import { StartScreen } from './components/screens/StartScreen';
import { CashOutScreen } from './components/screens/CashOutScreen';
import { GameOverScreen } from './components/screens/GameOverScreen';
import { RunHistoryModal } from './components/screens/RunHistoryModal';
import { LeaderboardModal } from './components/screens/LeaderboardModal';
import { AchievementsModal } from './components/screens/AchievementsModal';
import { TutorialModal } from './components/screens/TutorialModal';
import { ScreenShake } from './components/common/ScreenShake';
import { ToastContainer } from './components/common/ToastContainer';

export const App: React.FC = () => {
  // Audio state
  const [audioSettings, setAudioSettings] = useState(() => StorageManager.getAudioSettings());

  // App / Modal visibility
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isLeaderboardOpen, setIsLeaderboardOpen] = useState(false);
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  // Active toast alerts
  const [toasts, setToasts] = useState<Achievement[]>([]);

  // Persistent runs & high scores
  const [historyRuns, setHistoryRuns] = useState(() => StorageManager.getRunHistory());
  const [leaderboard, setLeaderboard] = useState(() => StorageManager.getLeaderboard());
  const [achievements, setAchievements] = useState(() => StorageManager.getAchievements());

  // Screen shake key
  const [shakeKey, setShakeKey] = useState<number>(0);
  const [shakeIntensity, setShakeIntensity] = useState<'small' | 'large' | 'catastrophic'>('small');

  // RNG & Event tracking
  const rngRef = useRef<SeededRNG>(new SeededRNG());
  const seenEventIdsRef = useRef<Set<string>>(new Set());

  // Current active event
  const [currentEvent, setCurrentEvent] = useState<GameEvent | null>(null);

  // Run State
  const [runState, setRunState] = useState<RunState>(() => ({
    runNumber: historyRuns.length + 1,
    seed: Date.now(),
    wealth: 100,
    peakWealth: 100,
    streak: 0,
    decisionsCount: 0,
    multiplier: 1.0,
    riskScore: 20,
    tier: 'BROKE',
    history: [],
    biggestWin: 0,
    biggestMistake: 0,
    status: 'START',
    isDesperate: false,
  }));

  // Sync sound settings with engine on mount
  useEffect(() => {
    sound.setSoundEnabled(audioSettings.soundEnabled);
    sound.setMusicEnabled(audioSettings.musicEnabled);
  }, []);

  const handleToggleSound = () => {
    const next = !audioSettings.soundEnabled;
    const updated = { ...audioSettings, soundEnabled: next };
    setAudioSettings(updated);
    StorageManager.saveAudioSettings(updated);
    sound.setSoundEnabled(next);
  };

  const handleToggleMusic = () => {
    const next = !audioSettings.musicEnabled;
    const updated = { ...audioSettings, musicEnabled: next };
    setAudioSettings(updated);
    StorageManager.saveAudioSettings(updated);
    sound.setMusicEnabled(next);
  };

  const addAchievementToast = (unlockedList: Achievement[]) => {
    if (unlockedList.length === 0) return;
    sound.playJackpot();
    setToasts((prev) => [...prev, ...unlockedList]);
    setAchievements(StorageManager.getAchievements());
  };

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Escape closes modals
      if (e.key === 'Escape') {
        setIsHistoryOpen(false);
        setIsLeaderboardOpen(false);
        setIsAchievementsOpen(false);
        setIsTutorialOpen(false);
        return;
      }

      // If any modal is open, prevent background game interactions
      if (isHistoryOpen || isLeaderboardOpen || isAchievementsOpen || isTutorialOpen) return;

      if (runState.status === 'START') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleStartRun();
        }
      } else if (runState.status === 'DECIDING' && currentEvent) {
        if (e.key === '1' && currentEvent.choices[0]) {
          e.preventDefault();
          handleSelectChoice(currentEvent.choices[0]);
        } else if (e.key === '2' && currentEvent.choices[1]) {
          e.preventDefault();
          handleSelectChoice(currentEvent.choices[1]);
        } else if (e.key === '3' && currentEvent.choices[2]) {
          e.preventDefault();
          handleSelectChoice(currentEvent.choices[2]);
        } else if (e.key === '4' && currentEvent.choices[3]) {
          e.preventDefault();
          handleSelectChoice(currentEvent.choices[3]);
        }
      } else if (runState.status === 'OUTCOME') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleKeepGoing();
        } else if (e.key === 'c' || e.key === 'C') {
          e.preventDefault();
          handleCashOut();
        }
      } else if (runState.status === 'GAME_OVER' || runState.status === 'CASHOUT_SUCCESS') {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          handleStartRun();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    runState.status,
    currentEvent,
    isHistoryOpen,
    isLeaderboardOpen,
    isAchievementsOpen,
    isTutorialOpen,
  ]);

  // --- START A NEW RUN ---
  const handleStartRun = () => {
    const newSeed = Date.now();
    const newRng = new SeededRNG(newSeed);
    rngRef.current = newRng;
    seenEventIdsRef.current.clear();

    const initialTier: WealthTier = 'BROKE';
    const firstEvent = selectNextEvent(100, initialTier, newRng, false, seenEventIdsRef.current);
    seenEventIdsRef.current.add(firstEvent.id);
    setCurrentEvent(firstEvent);

    const initialRisk = calculateRiskScore(100, 0, 0);

    setRunState({
      runNumber: historyRuns.length + 1,
      seed: newSeed,
      wealth: 100,
      peakWealth: 100,
      streak: 0,
      decisionsCount: 0,
      multiplier: 1.0,
      riskScore: initialRisk,
      tier: initialTier,
      history: [],
      biggestWin: 0,
      biggestMistake: 0,
      status: 'DECIDING',
      isDesperate: false,
    });

    sound.playCardFlip();
  };

  // --- SELECT A CHOICE ---
  const handleSelectChoice = (choice: Choice) => {
    if (!currentEvent || runState.status !== 'DECIDING') return;

    sound.playTensionRoll();

    // Small suspense timeout to simulate roll & build tension
    setTimeout(() => {
      const outcome = resolveChoice(choice, runState.wealth, currentEvent, rngRef.current);
      const isWin = outcome.success;

      // Update wealth metrics
      const newWealth = outcome.wealthAfter;
      const newPeak = Math.max(runState.peakWealth, newWealth);
      const newStreak = isWin ? runState.streak + 1 : 0;
      const newDecisions = runState.decisionsCount + 1;
      const newTier = determineWealthTier(newWealth);
      const newRisk = calculateRiskScore(newWealth, newStreak, newDecisions);

      // Track records
      const biggestWin = outcome.delta > 0 ? Math.max(runState.biggestWin, outcome.delta) : runState.biggestWin;
      const biggestMistake = outcome.delta < 0 ? Math.max(runState.biggestMistake, Math.abs(outcome.delta)) : runState.biggestMistake;

      // Haptic Screen Shake & Sound reaction
      if (outcome.isJackpot) {
        sound.playJackpot();
        setShakeIntensity('large');
        setShakeKey(Date.now());
      } else if (isWin) {
        sound.playWin();
        setShakeIntensity('small');
        setShakeKey(Date.now());
      } else if (newWealth === 0) {
        sound.playBust();
        setShakeIntensity('catastrophic');
        setShakeKey(Date.now());
      } else {
        sound.playLoss();
        setShakeIntensity('large');
        setShakeKey(Date.now());
      }

      // Record decision history entry
      const historyEntry = {
        step: newDecisions,
        eventId: currentEvent.id,
        eventTitle: currentEvent.title,
        choiceLabel: choice.label,
        delta: outcome.delta,
        wealthBefore: runState.wealth,
        wealthAfter: newWealth,
        success: isWin,
        narrative: outcome.message,
        oddsDisplay: choice.oddsDisplay || `${Math.round(choice.winProbability * 100)}%`,
      };

      const updatedState: RunState = {
        ...runState,
        wealth: newWealth,
        peakWealth: newPeak,
        streak: newStreak,
        decisionsCount: newDecisions,
        multiplier: 1.0 + Math.min(newStreak * 0.2, 3.0),
        riskScore: newRisk,
        tier: newTier,
        biggestWin,
        biggestMistake,
        history: [historyEntry, ...runState.history],
        lastOutcome: outcome,
        fatalEventTitle: newWealth === 0 ? currentEvent.title : undefined,
        status: newWealth === 0 ? 'GAME_OVER' : 'OUTCOME',
        isDesperate: newWealth > 0 && newWealth <= 40,
      };

      setRunState(updatedState);

      // Check achievements
      const unlocked = checkAchievements(updatedState);
      if (unlocked.length > 0) {
        addAchievementToast(unlocked);
      }

      // If BUST (Game Over): Persist run immediately
      if (newWealth === 0) {
        const obituary = generateRunObituary(
          newPeak,
          newDecisions,
          biggestWin,
          biggestMistake,
          currentEvent.title,
          rngRef.current
        );

        const record = {
          id: `run_${Date.now()}`,
          runNumber: runState.runNumber,
          playerName: 'You (High Roller)',
          startingWealth: 100,
          finalWealth: 0,
          peakWealth: newPeak,
          decisionsCount: newDecisions,
          outcome: 'BUST' as const,
          date: new Date().toISOString(),
          summary: obituary,
          fatalEvent: currentEvent.title,
          seed: runState.seed,
          isLocalPlayer: true,
        };

        StorageManager.saveRun(record);
        setHistoryRuns(StorageManager.getRunHistory());
        setLeaderboard(StorageManager.getLeaderboard());
      }
    }, 250);
  };

  // --- KEEP GOING (DRAW NEXT EVENT) ---
  const handleKeepGoing = () => {
    if (!rngRef.current) return;

    const nextEvent = selectNextEvent(
      runState.wealth,
      runState.tier,
      rngRef.current,
      runState.isDesperate,
      seenEventIdsRef.current
    );

    seenEventIdsRef.current.add(nextEvent.id);
    setCurrentEvent(nextEvent);

    setRunState((prev) => ({
      ...prev,
      status: 'DECIDING',
      lastOutcome: undefined,
    }));

    sound.playCardFlip();
  };

  // --- CASH OUT ---
  const handleCashOut = () => {
    sound.playCashOut();

    const record = {
      id: `run_${Date.now()}`,
      runNumber: runState.runNumber,
      playerName: 'You (High Roller)',
      startingWealth: 100,
      finalWealth: runState.wealth,
      peakWealth: runState.peakWealth,
      decisionsCount: runState.decisionsCount,
      outcome: 'CASHOUT' as const,
      date: new Date().toISOString(),
      summary: `Walked away with $${runState.wealth.toLocaleString()} after surviving ${runState.decisionsCount} decisions and a ${runState.streak} win streak.`,
      seed: runState.seed,
      isLocalPlayer: true,
    };

    StorageManager.saveRun(record);
    setHistoryRuns(StorageManager.getRunHistory());
    setLeaderboard(StorageManager.getLeaderboard());

    // Check Walk Away achievement ($10M+)
    if (runState.wealth >= 10_000_000) {
      const a = StorageManager.unlockAchievement('the_walk_away');
      if (a) addAchievementToast([a]);
    }

    setRunState((prev) => ({
      ...prev,
      status: 'CASHOUT_SUCCESS',
      lastOutcome: undefined,
    }));
  };

  return (
    <div className="relative min-h-screen flex flex-col text-slate-100 overflow-x-hidden">
      {/* Dynamic Evolving Casino Background */}
      <CasinoBackground tier={runState.tier} riskScore={runState.riskScore} />

      {/* Screen Shake Wrapper */}
      <ScreenShake triggerKey={shakeKey} intensity={shakeIntensity}>
        {/* Top Navigation */}
        <TopNavBar
          soundEnabled={audioSettings.soundEnabled}
          musicEnabled={audioSettings.musicEnabled}
          onToggleSound={handleToggleSound}
          onToggleMusic={handleToggleMusic}
          onOpenHistory={() => setIsHistoryOpen(true)}
          onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
          onOpenAchievements={() => setIsAchievementsOpen(true)}
          onOpenTutorial={() => setIsTutorialOpen(true)}
        />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col items-center justify-between px-4 py-3 sm:py-6 max-w-5xl mx-auto w-full z-10">
          <AnimatePresence mode="wait">
            {runState.status === 'START' && (
              <StartScreen
                key="start"
                onStartRun={handleStartRun}
                onOpenTutorial={() => setIsTutorialOpen(true)}
                runCount={historyRuns.length}
                bestPeakWealth={historyRuns.length > 0 ? Math.max(...historyRuns.map((r) => r.peakWealth)) : undefined}
              />
            )}

            {(runState.status === 'DECIDING' || runState.status === 'OUTCOME') && currentEvent && (
              <div key="gameplay" className="w-full flex flex-col items-center space-y-4 my-auto">
                {/* Status Telemetry Header */}
                <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-3 px-2">
                  <StreakTracker
                    streak={runState.streak}
                    decisionsCount={runState.decisionsCount}
                    runNumber={runState.runNumber}
                    multiplier={runState.multiplier}
                  />

                  <RiskMeter riskScore={runState.riskScore} />
                </div>

                {/* Animated Wealth Counter */}
                <WealthCounter
                  wealth={runState.wealth}
                  tier={runState.tier}
                  lastDelta={runState.lastOutcome?.delta}
                />

                {/* 3D Balatro-Style Event Card */}
                <EventCard
                  event={currentEvent}
                  onSelectChoice={handleSelectChoice}
                  disabled={runState.status !== 'DECIDING'}
                />
              </div>
            )}

            {runState.status === 'CASHOUT_SUCCESS' && (
              <CashOutScreen
                key="cashout"
                run={runState}
                onPlayAgain={handleStartRun}
                onOpenLeaderboard={() => setIsLeaderboardOpen(true)}
              />
            )}

            {runState.status === 'GAME_OVER' && (
              <GameOverScreen
                key="gameover"
                run={runState}
                onPlayAgain={handleStartRun}
                onViewRun={() => setIsHistoryOpen(true)}
              />
            )}
          </AnimatePresence>
        </main>
      </ScreenShake>

      {/* Outcome Modal (After choosing: Keep Going vs Cash Out) */}
      <AnimatePresence>
        {runState.status === 'OUTCOME' && runState.lastOutcome && (
          <OutcomeModal
            outcome={runState.lastOutcome}
            riskScore={runState.riskScore}
            onKeepGoing={handleKeepGoing}
            onCashOut={handleCashOut}
          />
        )}
      </AnimatePresence>

      {/* Modals */}
      <AnimatePresence>
        {isHistoryOpen && (
          <RunHistoryModal runs={historyRuns} onClose={() => setIsHistoryOpen(false)} />
        )}
        {isLeaderboardOpen && (
          <LeaderboardModal entries={leaderboard} onClose={() => setIsLeaderboardOpen(false)} />
        )}
        {isAchievementsOpen && (
          <AchievementsModal
            achievements={achievements}
            onClose={() => setIsAchievementsOpen(false)}
          />
        )}
        {isTutorialOpen && <TutorialModal onClose={() => setIsTutorialOpen(false)} />}
      </AnimatePresence>

      {/* Achievement Unlocked Toast Banners */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};
export default App;
