"use client";

import { useTimer } from "@/hooks/useTimer";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";
import BreakDialog from "./dialogs/BreakDialog";
import CompletionDialog from "./dialogs/CompletionDialog";
import LastChanceDialog from "./dialogs/LastChanceDialog";

type TimerProps = {
  imageUrl: string;
};

const Timer = ({ imageUrl }: TimerProps) => {
  const {
    timeLeft,
    isActive,
    mode,
    completedPomodoros,
    activity,
    showDialog,
    showCompletionDialog,
    lastChanceActive,
    toggleTimer,
    resetTimer,
    startBreak,
    startWork,
    startLastChance,
    completeLastChance,
  } = useTimer();

  return (
    <div className="text-center bg-black p-6 rounded-lg border-4 border-white shadow-lg font-mono relative max-h-[95dvh] w-[90vw] max-w-xl overflow-auto">
      <TimerDisplay
        imageUrl={imageUrl}
        mode={mode}
        timeLeft={timeLeft}
        completedPomodoros={completedPomodoros}
      />
      <TimerControls
        isActive={isActive}
        toggleTimer={toggleTimer}
        resetTimer={resetTimer}
      />
      {showDialog && (
        <BreakDialog activity={activity} startBreak={startBreak} />
      )}
      {showCompletionDialog && (
        <CompletionDialog
          activity={activity}
          startWork={startWork}
          startLastChance={startLastChance}
        />
      )}
      {lastChanceActive && (
        <LastChanceDialog
          activity={activity}
          timeLeft={timeLeft}
          completeLastChance={completeLastChance}
        />
      )}
    </div>
  );
};

export default Timer;
