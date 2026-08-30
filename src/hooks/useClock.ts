"use client";

import { useCallback, useEffect, useState } from "react";

function utcTime(): string { return new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false, timeZone: "UTC" }).format(new Date()); }

export function useClock() {
  const [data, setData] = useState("00:00:00");
  useEffect(() => { setData(utcTime()); const timer = window.setInterval(() => setData(utcTime()), 1000); return () => window.clearInterval(timer); }, []);
  return { loading: false, error: null, data, refresh: useCallback(() => setData(utcTime()), []) };
}
