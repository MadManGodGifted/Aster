import { ScreenContainer } from "@/components/ui/ScreenContainer";
import { HUDPanel } from "@/components/ui/HUDPanel";
import { PlaceholderState } from "@/components/ui/PlaceholderState";
import { StatusChip } from "@/components/ui/StatusChip";

export default function ISSPage() { return <ScreenContainer><div className="space-y-[var(--space-4)]"><div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end"><div><p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">03 / Orbital Asset</p><h1 className="m-0 mt-2 font-[var(--font-display)] text-3xl uppercase tracking-[0.08em]">ISS Tracker</h1></div><StatusChip tone="warning">Signal unavailable</StatusChip></div><HUDPanel title="Orbital position" eyebrow="Tracking window"><div className="grid min-h-52 place-items-center border border-dashed border-[var(--color-line)] text-xs uppercase tracking-[0.15em] text-[var(--color-muted)]">No position lock</div></HUDPanel><PlaceholderState title="Tracking module ready" description="The station tracking surface is provisioned for a future telemetry connection." /></div></ScreenContainer>; }
