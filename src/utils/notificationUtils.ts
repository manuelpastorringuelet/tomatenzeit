export const sendNotification = (title: string, body: string) => {
  if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: "PLAY_NOTIFICATION",
      title: title,
      body: body,
    });
  } else {
    // Fallback for when service worker is not available
    if ("Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(title, {
          body: body,
          icon: "/icon-192x192.png",
        });
      } else if (Notification.permission !== "denied") {
        Notification.requestPermission().then((permission) => {
          if (permission === "granted") {
            new Notification(title, {
              body: body,
              icon: "/icon-192x192.png",
            });
          }
        });
      }
    } else {
      // Fallback for browsers that don't support notifications
      alert(`${title}: ${body}`);
    }
  }
};