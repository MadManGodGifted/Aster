"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const recoveryKey = "aster-development-cache-recovered";
      void Promise.all([
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister()))),
        caches.keys().then((keys) => Promise.all(
          keys.filter((key) => key.startsWith("aster-")).map((key) => caches.delete(key)),
        )),
      ]).then(() => {
        if (!sessionStorage.getItem(recoveryKey)) {
          sessionStorage.setItem(recoveryKey, "true");
          window.location.reload();
        }
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}
