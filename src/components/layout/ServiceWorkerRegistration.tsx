"use client";

import { useEffect } from "react";

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) {
      return;
    }

    if (process.env.NODE_ENV !== "production") {
      const recoveryKey = "void-development-cache-recovered-v1";
      void Promise.all([
        navigator.serviceWorker
          .getRegistrations()
          .then((registrations) => Promise.all(registrations.map((registration) => registration.unregister()))),
        caches.keys().then((keys) => Promise.all(
          keys.filter((key) => key.startsWith("void-")).map((key) => caches.delete(key)),
        )),
      ]).then(() => {
        if (!sessionStorage.getItem(recoveryKey)) {
          sessionStorage.setItem(recoveryKey, "true");
          const recoveryUrl = new URL(window.location.href);
          recoveryUrl.searchParams.set("__void_cache_recovered", "1");
          window.location.replace(recoveryUrl.toString());
        }
      });
      return;
    }

    void navigator.serviceWorker.register("/sw.js");
  }, []);

  return null;
}
