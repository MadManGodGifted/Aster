"use client";

import { useEffect } from "react";

type LongTaskEntry = PerformanceEntry & { duration: number; name: string };

export function PerformanceInstrumentation() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "development" || typeof PerformanceObserver === "undefined") return;
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as LongTaskEntry[]) {
        if (entry.duration >= 50) console.warn(`[aster:performance] long task ${Math.round(entry.duration)}ms (${entry.name})`);
      }
    });
    try { observer.observe({ type: "longtask", buffered: true }); } catch { /* Long Task API is not supported by every browser. */ }
    return () => observer.disconnect();
  }, []);
  return null;
}
