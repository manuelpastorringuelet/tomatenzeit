"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

const WORK_TIME = 25 * 60; // 25 minutes
const SHORT_BREAK = 5 * 60; // 5 minutes
const LONG_BREAK = 15 * 60; // 15 minutes
const POMODOROS_BEFORE_LONG_BREAK = 3;

const wellnessActivities = [
  "🌞 Get some sunlight exposure for 2-10 minutes",
  "🧘 Practice 1 minute of box breathing (4s inhale, 4s hold, 4s exhale, 4s hold)",
  "👁️ Focus on a distant object for 30-60 seconds to reduce eye strain",
  "💧 Hydrate with 8-16 oz of water",
  "🏃 Do 1 minute of jumping jacks or high knees for a cortisol spike",
  "🙌 Perform 20 seconds of self-massage on your neck and shoulders",
  "🌬️ Take 5 physiological sighs (double inhale through nose, long exhale through mouth)",
  "🧊 Splash cold water on your face for 15-30 seconds to increase alertness",
  "🌿 Look at nature or greenery for 40 seconds to reduce stress",
  "🦵 Do 10 air squats to increase blood flow and energy",
  "👂 Listen to binaural beats at 40Hz for 1 minute to enhance focus",
  "✊ Practice progressive muscle relaxation for 1 minute",
  "🧠 Do 30 seconds of alternate nostril breathing for cognitive balance",
  "👐 Stretch your wrists and fingers to prevent repetitive strain",
  "🌈 Focus on a specific color in your environment for 30 seconds to reset attention",
];

const LAST_CHANCE_TIME = 60; // 1 minute

interface TimerProps {
  imageUrl: string;
}

const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

const Timer: React.FC<TimerProps> = ({ imageUrl }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short_break" | "long_break">(
    "work"
  );
  const [, setCycles] = useState(0);
  const [activity, setActivity] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [, setTaskCompleted] = useState(false);
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
      setActivity(
        wellnessActivities[
          Math.floor(Math.random() * wellnessActivities.length)
        ]
      );
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
    setTaskCompleted(false);
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
    setTaskCompleted(false);
    setCompletedPomodoros(0);
  };

  return (
    <div className="text-center bg-black p-6 rounded-lg border-4 border-white shadow-lg font-mono relative max-h-[95dvh] w-[90vw] max-w-xl overflow-auto">
      <div className="bg-green-300 p-6 rounded mb-6">
        <Image
          src={imageUrl}
          alt="Pomodoro Wellness"
          width={200}
          height={200}
          className="mx-auto mb-6 rounded pixelated"
        />
        <h2 className="text-3xl font-bold mb-4 text-black uppercase">
          {mode === "work" ? "Focus Time" : "Recharge Time"}
        </h2>
        <div className="text-7xl font-bold text-black bg-green-100 p-4 rounded">
          {formatTime(timeLeft)}
        </div>
        <div className="mt-4 text-xl font-bold text-black">
          Pomodoros: {completedPomodoros}
        </div>
      </div>
      <div className="flex justify-center space-x-4 mb-4">
        <button
          onClick={toggleTimer}
          className={`${
            isActive
              ? "bg-yellow-500 hover:bg-yellow-600 border-yellow-700"
              : "bg-green-500 hover:bg-green-600 border-green-700"
          } text-white font-bold py-2 px-4 rounded border-b-4 active:border-b-2 active:translate-y-0.5 transition-all`}
        >
          {isActive ? "PAUSE" : "START"}
        </button>
        <button
          onClick={resetTimer}
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded border-b-4 border-blue-700 active:border-b-2 active:translate-y-0.5 transition-all"
        >
          RESET
        </button>
      </div>
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
              Did you complete the task?
            </p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={startWork}
                className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
              >
                <span className="mr-2">YES, START WORK</span>
                <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
                  ✓
                </span>
              </button>
              <button
                onClick={startLastChance}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
              >
                <span className="mr-2">I&apos;LL DO IT RIGHT NOW</span>
                <span className="w-4 h-4 border-2 border-white flex items-center justify-center">
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
              Time to complete the task:
            </p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <div className="text-6xl font-bold text-white mb-4">
              {formatTime(timeLeft)}
            </div>
            <button
              onClick={completeLastChance}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
            >
              <span className="mr-2">TASK COMPLETED</span>
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
