"use client";

import {
  LAST_CHANCE_TIME,
  LONG_BREAK,
  POMODOROS_BEFORE_LONG_BREAK,
  SHORT_BREAK,
  wellnessActivities,
  WORK_TIME,
} from "@/constants/timerConstants";
import { formatTime, getRandomActivity } from "@/utils/timerUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import TimerControls from "./TimerControls";
import TimerDisplay from "./TimerDisplay";

type TimerProps = {
  imageUrl: string;
};

const Timer = ({ imageUrl }: TimerProps) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short_break" | "long_break">(
    "work"
  );
  const [, setCycles] = useState(0);
  const [activity, setActivity] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [lastChanceActive, setLastChanceActive] = useState(false);
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  const startWork = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setMode("work");
    setTimeLeft(WORK_TIME);
    setActivity("");
    setShowCompletionDialog(false);
    setIsActive(true);
  }, []);

  const completeLastChance = useCallback(() => {
    setLastChanceActive(false);
    startWork();
  }, [startWork]);

  const handleTimerComplete = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = true;
      audioRef.current
        .play()
        .catch((error) => console.error("Error playing audio:", error));
    }

    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("TomZeit", {
        body: mode === "work" ? "Time to recharge!" : "Time to focus!",
        icon: "/icon-192x192.png",
      });
    }

    if (mode === "work") {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);

      if (newCompletedPomodoros % POMODOROS_BEFORE_LONG_BREAK === 0) {
        setMode("long_break");
        setTimeLeft(LONG_BREAK);
      } else {
        setMode("short_break");
        setTimeLeft(SHORT_BREAK);
      }
      setActivity(getRandomActivity(wellnessActivities));
      setShowDialog(true);
      setIsActive(false);
    } else {
      if (lastChanceActive) {
        completeLastChance();
      } else {
        setShowCompletionDialog(true);
        setIsActive(false);
      }
    }
  }, [mode, completedPomodoros, lastChanceActive, completeLastChance]);

  const startLastChance = () => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setLastChanceActive(true);
    setTimeLeft(LAST_CHANCE_TIME);
    setIsActive(true);
    setShowCompletionDialog(false);
  };

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const startBreak = () => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setShowDialog(false);
    setIsActive(true);
  };

  const resetTimer = () => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
    setCycles(0);
    setActivity("");
    setShowDialog(false);
    setShowCompletionDialog(false);
    setLastChanceActive(false);
    setCompletedPomodoros(0);
  };

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
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
            <p className="text-white text-lg mb-2">
              Science-Based Wellness Challenge:
            </p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <button
              onClick={startBreak}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
            >
              <span className="mr-2">I COMMIT TO THIS CHALLENGE</span>
              <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
                ✓
              </span>
            </button>
          </div>
        </div>
      )}
      {showCompletionDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
            <p className="text-white text-lg mb-2">
              Did you complete the challenge?
            </p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={startWork}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
              >
                <span className="mr-2">YES, START WORK</span>
                <span className="w-4 h-4 border-2 border-white flex items-center justify-center">
                  ✓
                </span>
              </button>
              <button
                onClick={startLastChance}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
              >
                <span className="mr-2">I&apos;LL DO IT RIGHT NOW</span>
                <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
                  ⏱️
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
      {lastChanceActive && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
            <p className="text-white text-lg mb-2">
              Time to complete the challenge:
            </p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <div className="text-6xl font-bold text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={completeLastChance}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
            >
              <span className="mr-2">CHALLENGE COMPLETED</span>
              <span className="w-4 h-4 border-2 border-white flex items-center justify-center">
                ✓
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Timer;
