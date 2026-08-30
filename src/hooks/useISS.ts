"use client";
import { useQuery } from "@tanstack/react-query";
import { fetchIssTelemetry } from "@/lib/api/iss-client";

export function useISS() {
  const query = useQuery({ queryKey: ["iss-telemetry"], queryFn: fetchIssTelemetry, refetchInterval: 10000, refetchIntervalInBackground: true, retry: 1, staleTime: 5000 });
  return { loading: query.isLoading, error: query.error, data: query.data ?? null, refresh: query.refetch, isFetching: query.isFetching };
}
