import { GridOverlay } from "@/components/effects/GlobalEffects";
import { CloseApproaches } from "@/components/mission/CloseApproaches/CloseApproaches";
import { MissionFeed } from "@/components/mission/MissionFeed/MissionFeed";
import { OrbitalDisplay } from "@/components/mission/OrbitalDisplay/OrbitalDisplay";
import { StatusIndicator } from "@/components/mission/StatusIndicator/StatusIndicator";
import { TelemetryCards } from "@/components/mission/TelemetryCards/TelemetryCards";
import { HUDPanel } from "@/components/ui/HUDPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ScreenContainer } from "@/components/ui/ScreenContainer";

const commandDeckLabel = "01 / Command Deck";

export default function MissionControlPage() { return <ScreenContainer><div className="space-y-[var(--space-4)]"><div className="flex flex-col justify-between gap-[var(--space-2)] sm:flex-row sm:items-end"><div><p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">{commandDeckLabel}</p><h1 className="m-0 mt-2 font-[var(--font-display)] text-3xl font-medium uppercase tracking-[0.08em] text-[var(--color-information)] sm:text-4xl">Mission Control</h1></div><StatusIndicator /></div><HUDPanel className="relative min-h-72 overflow-hidden"><GridOverlay /><OrbitalDisplay /></HUDPanel><div><SectionHeader index="02" title="Telemetry" detail="Live channels" /><TelemetryCards /></div><div className="grid gap-[var(--space-2)] md:grid-cols-2"><MissionFeed /><CloseApproaches /></div></div></ScreenContainer>; }
