"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";

const MISSION_REFRESH_INTERVAL_MS = 60000;

function MissionRefreshScheduler() {
  const queryClient = useQueryClient();
  useEffect(() => {
    const refresh = () => {
      if (document.visibilityState === "visible") void queryClient.invalidateQueries({ queryKey: ["mission-snapshot"], refetchType: "active" });
    };
    const interval = window.setInterval(refresh, MISSION_REFRESH_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [queryClient]);
  return null;
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({ defaultOptions: { queries: { retry: 2, refetchOnWindowFocus: true, staleTime: 15000 } } }));
  return <QueryClientProvider client={client}><MissionRefreshScheduler />{children}</QueryClientProvider>;
}
