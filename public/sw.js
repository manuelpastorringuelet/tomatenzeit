const CACHE_NAME = "pomodoro-wellness-v2";
const urlsToCache = [
  "/",
  "/index.html",
  "/manifest.json",
  "/icon-72x72.png",
  "/icon-96x96.png",
  "/icon-128x128.png",
  "/icon-144x144.png",
  "/icon-152x152.png",
  "/icon-192x192.png",
  "/icon-384x384.png",
  "/icon-512x512.png",
  "/notification.mp3",
  "/pomodoro-wellness-image.png",
  "https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "INIT_TIMER") {
    currentMode = event.data.mode;
    if (event.data.isActive) {
      startTimer(event.data.timeLeft);
    }
  } else if (event.data && event.data.type === "START_TIMER") {
    currentMode = event.data.mode;
    startTimer(event.data.duration);
    if ("wakeLock" in navigator) {
      wakeLockController = new AbortController();
      navigator.wakeLock
        .request("screen", { signal: wakeLockController.signal })
        .then(() => console.log("Wake Lock acquired in service worker"))
        .catch((err) =>
          console.error("Failed to acquire Wake Lock in service worker:", err)
        );
    }
  } else if (event.data && event.data.type === "STOP_TIMER") {
    stopTimer();
    if (wakeLockController) {
      wakeLockController.abort();
      wakeLockController = null;
    }
  } else if (event.data && event.data.type === "UPDATE_TIMER_STATE") {
    currentMode = event.data.mode;
    if (event.data.isActive) {
      startTimer(event.data.timeLeft);
    } else {
      stopTimer();
    }
  } else if (event.data && event.data.type === "PLAY_NOTIFICATION") {
    self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/icon-192x192.png",
      vibrate: [200, 100, 200],
    });
  }
});

function startTimer(duration) {
  stopTimer();
  timerEndTime = Date.now() + duration * 1000;
  timerInterval = setInterval(updateTimer, 1000);
}

function stopTimer() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}

function updateTimer() {
  const now = Date.now();
  const timeLeft = Math.max(0, Math.floor((timerEndTime - now) / 1000));

  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
      client.postMessage({
        type: "TIMER_UPDATE",
        timeLeft: timeLeft,
      });
    });
  });

  if (timeLeft === 0) {
    stopTimer();
    const title =
      currentMode === "work" ? "Time to take a break!" : "Time to focus!";
    const body =
      currentMode === "work"
        ? "Great job! Time for a well-deserved break."
        : "Break's over. Let's get back to work!";
    self.registration.showNotification(title, {
      body: body,
      icon: "/icon-192x192.png",
      vibrate: [200, 100, 200],
    });
  }
}

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
