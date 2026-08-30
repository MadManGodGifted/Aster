"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchMissionSnapshot } from "@/lib/api/mission";

export function useMissionSnapshot() {
  const query = useQuery({ queryKey: ["mission-snapshot"], queryFn: fetchMissionSnapshot, refetchInterval: 30000, refetchIntervalInBackground: false, retry: 1 });
  return { loading: query.isLoading, error: query.error, data: query.data, refresh: query.refetch, isFetching: query.isFetching };
}
