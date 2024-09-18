import {
  LAST_CHANCE_TIME,
  LONG_BREAK,
  POMODOROS_BEFORE_LONG_BREAK,
  SHORT_BREAK,
  wellnessActivities,
  WORK_TIME,
} from "@/constants/timerConstants";
import { sendNotification } from "@/utils/notificationUtils";
import { getRandomActivity } from "@/utils/timerUtils";
import { useCallback, useEffect, useRef, useState } from "react";
import { useWakeLock } from "./useWakeLock";

export const useTimer = () => {
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<"work" | "short_break" | "long_break">(
    "work"
  );
  const [completedPomodoros, setCompletedPomodoros] = useState(0);
  const [activity, setActivity] = useState("");
  const [showDialog, setShowDialog] = useState(false);
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [lastChanceActive, setLastChanceActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const { requestWakeLock, releaseWakeLock } = useWakeLock();

  useEffect(() => {
    audioRef.current = new Audio("/notification.mp3");
  }, []);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log(
            "Service Worker registered with scope:",
            registration.scope
          );
        })
        .catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
    }
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

    if (mode === "work") {
      const newCompletedPomodoros = completedPomodoros + 1;
      setCompletedPomodoros(newCompletedPomodoros);

      sendNotification(
        "TomZeit: Time to recharge!",
        `You've completed ${newCompletedPomodoros} pomodoro${
          newCompletedPomodoros > 1 ? "s" : ""
        }. Take a break!`
      );

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
      sendNotification(
        "TomZeit: Break's over!",
        "Time to focus and start your next pomodoro."
      );
      setShowCompletionDialog(true);
      setIsActive(false);
    }
  }, [mode, completedPomodoros]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prevTime) => {
          if (prevTime <= 1) {
            clearInterval(intervalRef.current!);
            handleTimerComplete();
            return 0;
          }
          return prevTime - 1;
        });
      }, 1000);

      requestWakeLock();
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      releaseWakeLock();
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      releaseWakeLock();
    };
  }, [isActive, handleTimerComplete, requestWakeLock, releaseWakeLock]);

  const toggleTimer = useCallback(() => {
    setIsActive((prevIsActive) => !prevIsActive);
  }, []);

  const resetTimer = useCallback(() => {
    if (audioRef.current) {
      audioRef.current.loop = false;
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setIsActive(false);
    setMode("work");
    setTimeLeft(WORK_TIME);
    setActivity("");
    setShowDialog(false);
    setShowCompletionDialog(false);
    setLastChanceActive(false);
    setCompletedPomodoros(0);
    localStorage.removeItem("timeLeft");
    localStorage.removeItem("isActive");
    localStorage.removeItem("mode");
    localStorage.removeItem("completedPomodoros");
  }, []);

  const startBreak = useCallback(() => {
    setShowDialog(false);
    setIsActive(true);
  }, []);

  const startLastChance = useCallback(() => {
    setShowCompletionDialog(false);
    setLastChanceActive(true);
    setTimeLeft(LAST_CHANCE_TIME);
    setIsActive(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("timeLeft", timeLeft.toString());
    localStorage.setItem("isActive", isActive.toString());
    localStorage.setItem("mode", mode);
    localStorage.setItem("completedPomodoros", completedPomodoros.toString());

    if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: "UPDATE_TIMER_STATE",
        timeLeft,
        isActive,
        mode,
      });
    }
  }, [timeLeft, isActive, mode, completedPomodoros]);

  return {
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
  };
};
