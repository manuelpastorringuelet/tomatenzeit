import { useCallback, useEffect, useRef } from "react";

export const useWakeLock = () => {
  const wakeLock = useRef<WakeLockSentinel | null>(null);

  const requestWakeLock = useCallback(async () => {
    try {
      if ("wakeLock" in navigator) {
        wakeLock.current = await navigator.wakeLock.request("screen");
        console.log("Wake Lock is active");
      }
    } catch (err) {
      console.error(`Failed to request Wake Lock: ${err}`);
    }
  }, []);

  const releaseWakeLock = useCallback(() => {
    if (wakeLock.current) {
      wakeLock.current
        .release()
        .then(() => {
          wakeLock.current = null;
          console.log("Wake Lock released");
        })
        .catch((err) => {
          console.error(`Failed to release Wake Lock: ${err}`);
        });
    }
  }, []);

  useEffect(() => {
    return () => {
      releaseWakeLock();
    };
  }, [releaseWakeLock]);

  return { requestWakeLock, releaseWakeLock };
};
