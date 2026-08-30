"use client";
import { StatusChip } from "@/components/ui/StatusChip";
import { useMissionSnapshot } from "@/hooks/useMissionSnapshot";
import { ConnectionState } from "@/types/mission";

const statusCopy: Record<ConnectionState, { label: string; tone: "operational" | "warning" | "critical" }> = {
  connecting: { label: "Connecting...", tone: "warning" }, syncing: { label: "Syncing telemetry...", tone: "warning" }, live: { label: "Live", tone: "operational" }, delayed: { label: "Data delayed", tone: "warning" }, degraded: { label: "Degraded", tone: "warning" }, offline: { label: "Offline", tone: "critical" },
};

export function StatusIndicator() {
  const { loading, error, data, isFetching } = useMissionSnapshot();
  const state: ConnectionState = error ? "offline" : loading ? "connecting" : isFetching ? "syncing" : data?.connection ?? "offline";
  const status = statusCopy[state];
  const healthTitle = data ? Object.entries(data.services).map(([service, health]) => `${service.toUpperCase()}: ${health}`).join(" | ") : undefined;
  return <StatusChip tone={status.tone} title={healthTitle}>{status.label}</StatusChip>;
}
