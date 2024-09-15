"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useRef, useState } from "react";

const WORK_TIME = 5; // 5 seconds for testing
const SHORT_BREAK = 5; // 5 seconds for testing
const LONG_BREAK = 5; // 5 seconds for testing

const wellnessActivities = [
  "🧘 Quick stretch! Touch your toes 🦶",
  "👁️ 20-20-20 rule: Look 20ft away for 20s",
  "💧 Hydrate! Drink some water 🚰",
  "😊 Smile at yourself in the mirror",
  "🌬️ Take 3 deep breaths",
  "🙌 Give yourself a quick hand massage",
  "🕺 Do a silly dance for 5 seconds",
  "🌿 Look at a plant or out the window",
];

interface TimerProps {
  imageUrl: string;
}

const Timer: React.FC<TimerProps> = ({ imageUrl }) => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short_break" | "long_break">("work");
  const [cycles, setCycles] = useState(0);
  const [activity, setActivity] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  const handleTimerComplete = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => console.error("Error playing audio:", error));
    }

    if (mode === "work") {
      const newCycles = cycles + 1;
      setCycles(newCycles);
      if (newCycles % 4 === 0) {
        setMode("long_break");
        setTimeLeft(LONG_BREAK);
      } else {
        setMode("short_break");
        setTimeLeft(SHORT_BREAK);
      }
      setActivity(wellnessActivities[Math.floor(Math.random() * wellnessActivities.length)]);
      setShowDialog(true);
    } else {
      setMode("work");
      setTimeLeft(WORK_TIME);
      setActivity("");
      setShowDialog(false);
    }
    setIsActive(false);
  }, [cycles, mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleTimerComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, handleTimerComplete]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="text-center bg-black p-4 rounded-lg border-4 border-white shadow-lg font-mono relative">
      <div className="bg-green-300 p-4 rounded mb-4">
        <Image
          src={imageUrl}
          alt="Pomodoro Wellness"
          width={150}
          height={150}
          className="mx-auto mb-4 rounded pixelated"
        />
        <h2 className="text-2xl font-bold mb-2 text-black uppercase">
          {mode === "work" ? "Work Time" : "Break Time"}
        </h2>
        <div className="text-6xl font-bold text-black bg-green-100 p-2 rounded">
          {formatTime(timeLeft)}
        </div>
      </div>
      <button
        onClick={toggleTimer}
        className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded mb-4 border-b-4 border-red-700 active:border-b-2 active:translate-y-0.5 transition-all"
      >
        {isActive ? "PAUSE" : "START"}
      </button>
      {showDialog && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-blue-900 border-4 border-white p-4 rounded-lg max-w-sm w-full">
            <p className="text-white text-lg mb-2">Wellness Quest:</p>
            <p className="text-yellow-300 text-xl mb-4">{activity}</p>
            <button
              onClick={() => setShowDialog(false)}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-bold py-2 px-4 rounded flex items-center justify-center mx-auto"
            >
              <span className="mr-2">DONE</span>
              <span className="w-4 h-4 border-2 border-black flex items-center justify-center">
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
