"use client";

import { motion } from "framer-motion";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { CommandButton } from "@/components/ui/CommandButton";
import { HUDPanel } from "@/components/ui/HUDPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { useExplorerObject, useExplorerSearch } from "@/hooks/useExplorer";
import type { ExplorerApproach, ExplorerObjectDetails, ExplorerObjectSummary } from "@/types/explorer";

const SEARCH_DEBOUNCE_MS = 300;
const dateFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: "UTC" });
const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });

function formatValue(value: number | null, suffix = ""): string { return value === null ? "Data unavailable" : `${numberFormatter.format(value)}${suffix}`; }
function formatCompact(value: number | null, suffix = ""): string { return value === null ? "Data unavailable" : `${compactFormatter.format(value)}${suffix}`; }
function formatDate(value: string | null): string { return value ? dateFormatter.format(new Date(`${value}T00:00:00Z`)) : "Data unavailable"; }
function readableError(error: Error | null): string { return error?.message || "Registry telemetry is temporarily unavailable"; }

const Field = memo(function Field({ label, value }: { label: string; value: string }) {
  return <div className="border-t border-[var(--color-line)] pt-[var(--space-1)]"><p className="m-0 text-[0.5625rem] uppercase tracking-[0.15em] text-[var(--color-muted)]">{label}</p><p className="m-0 mt-1 break-words text-xs uppercase tracking-[0.06em] text-[var(--color-information)]">{value}</p></div>;
});

const ObjectDetailsPanel = memo(function ObjectDetailsPanel({ object, loading, error }: { object: ExplorerObjectDetails | undefined; loading: boolean; error: Error | null }) {
  if (loading) return <HUDPanel title="Object details" eyebrow="Detail / Synchronizing"><p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Receiving orbital record<span className="terminal-cursor">_</span></p></HUDPanel>;
  if (error) return <HUDPanel title="Object details" eyebrow="Detail / Delayed"><p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-danger)]">{readableError(error)}</p></HUDPanel>;
  if (!object) return <HUDPanel title="Object details" eyebrow="Detail / Standby"><p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Select a registry object to load its orbital record<span className="terminal-cursor">_</span></p></HUDPanel>;
  return <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, ease: "easeOut" }}><HUDPanel title={object.designation} eyebrow={`NASA ID / ${object.id}`}><div className="grid gap-[var(--space-2)] sm:grid-cols-2"><Field label="Orbital class" value={object.orbitalClass ?? "Data unavailable"} /><Field label="Estimated diameter" value={`${formatValue(object.estimatedDiameterMinKm, " km")} — ${formatValue(object.estimatedDiameterMaxKm, " km")}`} /><Field label="Hazard status" value={object.hazardous ? "Potentially hazardous" : "Nominal"} /><Field label="Discovery date" value={formatDate(object.discoveryDate)} /></div><div className="mt-[var(--space-3)]"><SectionHeader index="//" title="Approach timeline" detail={`${object.approaches.length} upcoming`} /><ApproachTimeline approaches={object.approaches} /></div></HUDPanel></motion.div>;
});

const ApproachTimeline = memo(function ApproachTimeline({ approaches }: { approaches: ExplorerApproach[] }) {
  if (!approaches.length) return <p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">No upcoming approach data in current NASA record</p>;
  return <div className="mt-[var(--space-2)] space-y-[var(--space-1)]">{approaches.map((approach) => <div key={`${approach.date}-${approach.orbitingBody ?? "unknown"}`} className="grid grid-cols-2 gap-x-[var(--space-2)] gap-y-1 border-b border-[var(--color-line)] pb-[var(--space-1)] text-[0.625rem] uppercase tracking-[0.08em] sm:grid-cols-4"><span className="text-[var(--color-information)]">{formatDate(approach.date)}</span><span className="text-[var(--color-muted)]">{formatCompact(approach.missDistanceKm, " km")}</span><span className="text-[var(--color-muted)]">{formatCompact(approach.relativeVelocityKph, " km/h")}</span><span className="text-[var(--color-primary)]">{approach.orbitingBody ?? "Unknown body"}</span></div>)}</div>;
});

const SearchResult = memo(function SearchResult({ object, selected, onSelect }: { object: ExplorerObjectSummary; selected: boolean; onSelect: (id: string) => void }) {
  return <button type="button" onClick={() => onSelect(object.id)} className={`w-full border px-[var(--space-2)] py-[var(--space-1)] text-left transition-colors duration-[var(--motion-slow)] ${selected ? "border-[var(--color-primary)] bg-[var(--color-primary)]/10" : "border-[var(--color-line)] bg-[var(--color-panel)] hover:border-[var(--color-primary)]"}`}><div className="flex items-start justify-between gap-[var(--space-2)]"><div><p className="m-0 text-xs uppercase tracking-[0.1em] text-[var(--color-information)]">{object.designation}</p><p className="m-0 mt-1 text-[0.625rem] uppercase tracking-[0.1em] text-[var(--color-muted)]">NASA ID / {object.id}</p></div><span className={object.hazardous ? "text-[0.625rem] uppercase tracking-[0.12em] text-[var(--color-danger)]" : "text-[0.625rem] uppercase tracking-[0.12em] text-[var(--color-primary)]"}>{object.hazardous ? "Hazard" : "Nominal"}</span></div><div className="mt-[var(--space-1)] grid grid-cols-2 gap-x-[var(--space-2)] text-[0.625rem] uppercase tracking-[0.08em] text-[var(--color-muted)] sm:grid-cols-4"><span>H {formatValue(object.absoluteMagnitude)}</span><span>{formatCompact(object.estimatedDiameterMaxKm, " km")}</span><span>{object.closeApproachCount} approaches</span><span>{formatDate(object.lastObservationDate)}</span></div></button>;
});

export function ExplorerConsole() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  useEffect(() => { const timeout = window.setTimeout(() => setQuery(input), SEARCH_DEBOUNCE_MS); return () => window.clearTimeout(timeout); }, [input]);
  const search = useExplorerSearch(query);
  const details = useExplorerObject(selectedId);
  const results = search.data ?? [];
  const registryDetail = useMemo(() => query.trim().length < 2 ? "Awaiting designation" : search.isFetching ? "Scanning registry" : `${results.length} matched`, [query, results.length, search.isFetching]);
  const handleSelect = useCallback((id: string) => setSelectedId(id), []);
  const submitSearch = useCallback((event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setQuery(input); }, [input]);
  return <div className="space-y-[var(--space-4)]"><div><p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">02 / Object Registry</p><h1 className="m-0 mt-2 font-[var(--font-display)] text-3xl uppercase tracking-[0.08em]">Explorer</h1></div><form onSubmit={submitSearch} className="flex flex-col gap-[var(--space-1)] sm:flex-row"><input value={input} onChange={(event) => setInput(event.target.value)} aria-label="Search asteroid registry" placeholder="SEARCH DESIGNATION OR NASA ID..." className="min-h-11 flex-1 border border-[var(--color-line)] bg-[var(--color-panel)] px-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-information)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]" /><CommandButton type="submit">Initialize search</CommandButton></form><div className="grid gap-[var(--space-2)] lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]"><div><SectionHeader index="//" title="Object registry" detail={registryDetail} /><div className="mt-[var(--space-2)] space-y-[var(--space-1)]" aria-live="polite">{query.trim().length < 2 && <p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Enter at least two characters to search NASA object records<span className="terminal-cursor">_</span></p>}{search.isFetching && <p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Scanning NASA object registry<span className="terminal-cursor">_</span></p>}{search.error && <p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-danger)]">{readableError(search.error)}</p>}{!search.isFetching && !search.error && query.trim().length >= 2 && results.length === 0 && <p className="m-0 py-[var(--space-3)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">No object found in current NASA registry cache</p>}{results.map((object) => <SearchResult key={object.id} object={object} selected={selectedId === object.id} onSelect={handleSelect} />)}</div></div><ObjectDetailsPanel object={details.data} loading={details.isFetching} error={details.error} /></div></div>;
}
