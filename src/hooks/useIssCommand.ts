"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchIssCommandSnapshot, fetchIssPassPredictions } from "@/lib/api/iss-command-client";

const ISS_REFRESH_INTERVAL_MS = 5000;
const PASS_CACHE_TIME_MS = 300000;

export function useIssCommand() {
  return useQuery({ queryKey: ["iss-command"], queryFn: fetchIssCommandSnapshot, refetchInterval: ISS_REFRESH_INTERVAL_MS, refetchIntervalInBackground: false, staleTime: ISS_REFRESH_INTERVAL_MS, retry: 2, retryDelay: (attempt) => ISS_REFRESH_INTERVAL_MS * attempt });
}

export function useIssPassPredictions(location: string) {
  const normalizedLocation = location.trim();
  return useQuery({ queryKey: ["iss-passes", normalizedLocation], queryFn: () => fetchIssPassPredictions(normalizedLocation), enabled: normalizedLocation.length >= 2, staleTime: PASS_CACHE_TIME_MS, gcTime: PASS_CACHE_TIME_MS, retry: 1 });
}
