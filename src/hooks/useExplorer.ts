"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchExplorerObject, fetchExplorerSearch } from "@/lib/api/explorer-client";

const SEARCH_STALE_TIME_MS = 900000;
const DETAIL_STALE_TIME_MS = 900000;

export function useExplorerSearch(query: string) {
  const normalizedQuery = query.trim();
  return useQuery({ queryKey: ["neo-search", normalizedQuery], queryFn: () => fetchExplorerSearch(normalizedQuery), enabled: normalizedQuery.length >= 2, staleTime: SEARCH_STALE_TIME_MS, gcTime: SEARCH_STALE_TIME_MS, retry: 1 });
}

export function useExplorerObject(id: string | null) {
  return useQuery({ queryKey: ["neo-object", id], queryFn: () => fetchExplorerObject(id ?? ""), enabled: Boolean(id), staleTime: DETAIL_STALE_TIME_MS, gcTime: DETAIL_STALE_TIME_MS, retry: 1 });
}
