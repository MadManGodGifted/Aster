"use client";

import { motion } from "framer-motion";
import { memo, useCallback, useMemo, useRef, useState } from "react";
import { HUDPanel } from "@/components/ui/HUDPanel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StatusChip } from "@/components/ui/StatusChip";
import { TelemetryCard } from "@/components/ui/TelemetryCard";
import { useIssCommand, useIssPassPredictions } from "@/hooks/useIssCommand";
import type { IssCommandSnapshot, IssMissionEvent, IssPass, IssTrailPoint } from "@/types/iss";

const MAP_WIDTH = 360;
const MAP_HEIGHT = 180;
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 1;
const utcFormatter = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "UTC", hour12: false });
const numberFormatter = new Intl.NumberFormat("en", { maximumFractionDigits: 2 });
const compactFormatter = new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 2 });

function formatNumber(value: number | null | undefined, unit = ""): string { return value === null || value === undefined ? "--" : `${numberFormatter.format(value)}${unit}`; }
function formatCompact(value: number | null | undefined, unit = ""): string { return value === null || value === undefined ? "--" : `${compactFormatter.format(value)}${unit}`; }
function formatUtc(timestamp: string): string { return `${utcFormatter.format(new Date(timestamp))} UTC`; }
function mercatorY(latitude: number): number { const boundedLatitude = Math.max(-85, Math.min(85, latitude)); const radians = boundedLatitude * Math.PI / 180; return (1 - Math.log(Math.tan(Math.PI / 4 + radians / 2)) / Math.PI) * MAP_HEIGHT / 2; }
function projectPoint(latitude: number, longitude: number): { x: number; y: number } { return { x: (longitude + 180) * MAP_WIDTH / 360, y: mercatorY(latitude) }; }
function buildTrailPath(trail: IssTrailPoint[]): string { return trail.reduce((path, point, index) => { const projected = projectPoint(point.latitude, point.longitude); const previous = trail[index - 1]; const command = !previous || Math.abs(previous.longitude - point.longitude) > 180 ? "M" : "L"; return `${path}${command}${projected.x.toFixed(2)} ${projected.y.toFixed(2)} `; }, ""); }

const MapControls = memo(function MapControls({ onZoomIn, onZoomOut }: { onZoomIn: () => void; onZoomOut: () => void }) {
  return <div className="absolute right-[var(--space-1)] top-[var(--space-1)] z-10 flex gap-1"><button type="button" onClick={onZoomIn} aria-label="Zoom map in" className="min-h-11 min-w-11 border border-[var(--color-line)] bg-[var(--color-panel)] text-xs text-[var(--color-primary)]">+</button><button type="button" onClick={onZoomOut} aria-label="Zoom map out" className="min-h-11 min-w-11 border border-[var(--color-line)] bg-[var(--color-panel)] text-xs text-[var(--color-primary)]">−</button></div>;
});

const IssWorldMap = memo(function IssWorldMap({ snapshot }: { snapshot: IssCommandSnapshot }) {
  const [zoom, setZoom] = useState(MIN_ZOOM);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const dragStart = useRef<{ x: number; y: number; offsetX: number; offsetY: number } | null>(null);
  const mapWidth = MAP_WIDTH / zoom;
  const mapHeight = MAP_HEIGHT / zoom;
  const marker = snapshot.position ? projectPoint(snapshot.position.latitude, snapshot.position.longitude) : null;
  const trailPath = useMemo(() => buildTrailPath(snapshot.trail), [snapshot.trail]);
  const viewBox = `${offset.x} ${offset.y} ${mapWidth} ${mapHeight}`;
  const adjustZoom = useCallback((direction: number) => setZoom((current) => { const next = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, current + direction * ZOOM_STEP)); setOffset((currentOffset) => ({ x: Math.min(Math.max(0, currentOffset.x), MAP_WIDTH - MAP_WIDTH / next), y: Math.min(Math.max(0, currentOffset.y), MAP_HEIGHT - MAP_HEIGHT / next) })); return next; }), []);
  const startPan = useCallback((event: React.PointerEvent<SVGSVGElement>) => { dragStart.current = { x: event.clientX, y: event.clientY, offsetX: offset.x, offsetY: offset.y }; event.currentTarget.setPointerCapture(event.pointerId); }, [offset]);
  const pan = useCallback((event: React.PointerEvent<SVGSVGElement>) => { if (!dragStart.current) return; const bounds = event.currentTarget.getBoundingClientRect(); const nextX = dragStart.current.offsetX - (event.clientX - dragStart.current.x) * mapWidth / bounds.width; const nextY = dragStart.current.offsetY - (event.clientY - dragStart.current.y) * mapHeight / bounds.height; setOffset({ x: Math.min(Math.max(0, nextX), MAP_WIDTH - mapWidth), y: Math.min(Math.max(0, nextY), MAP_HEIGHT - mapHeight) }); }, [mapHeight, mapWidth]);
  const endPan = useCallback(() => { dragStart.current = null; }, []);
  const heading = snapshot.orbital?.directionDegrees;
  return <div className="relative min-h-64 overflow-hidden border border-[var(--color-line)] bg-[var(--color-void)]"><MapControls onZoomIn={() => adjustZoom(1)} onZoomOut={() => adjustZoom(-1)} /><svg viewBox={viewBox} onPointerDown={startPan} onPointerMove={pan} onPointerUp={endPan} onPointerCancel={endPan} className="h-72 w-full touch-none" role="img" aria-label="Interactive Mercator world map showing the International Space Station"><rect width={MAP_WIDTH} height={MAP_HEIGHT} fill="var(--color-void)" />{[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((x) => <line key={`longitude-${x}`} x1={x} x2={x} y1="0" y2={MAP_HEIGHT} stroke="var(--color-grid)" strokeWidth="0.5" />)}{[-60, -30, 0, 30, 60].map((latitude) => <line key={`latitude-${latitude}`} x1="0" x2={MAP_WIDTH} y1={mercatorY(latitude)} y2={mercatorY(latitude)} stroke="var(--color-grid)" strokeWidth="0.5" />)}<path d="M20 52 L45 32 L76 36 L95 57 L83 75 L58 69 L43 80 L24 70 Z M101 86 L124 81 L137 97 L128 139 L111 153 L102 124 Z M149 47 L171 35 L195 39 L205 58 L184 72 L168 66 Z M188 76 L220 74 L244 95 L231 122 L205 116 Z M245 44 L302 37 L336 57 L329 86 L298 91 L281 75 L257 72 Z M275 116 L311 120 L324 144 L299 158 L279 143 Z" fill="var(--color-panel-raised)" stroke="var(--color-line)" strokeWidth="0.7" /><path d={trailPath} fill="none" stroke="var(--color-accent)" strokeWidth="1.1" strokeOpacity="0.75" />{marker && <motion.circle cx={marker.x} cy={marker.y} r="3.2" fill="var(--color-primary)" animate={{ cx: marker.x, cy: marker.y }} transition={{ duration: 4.6, ease: "linear" }} />}{marker && <circle cx={marker.x} cy={marker.y} r="6" fill="none" stroke="var(--color-primary)" strokeWidth="0.7" opacity="0.65" />}</svg><div className="absolute bottom-[var(--space-1)] left-[var(--space-1)] text-[0.5625rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Mercator / {snapshot.trail.length} trail points / {heading === null || heading === undefined ? "heading resolving" : `heading ${Math.round(heading)}°`}</div></div>;
});

const TelemetryGrid = memo(function TelemetryGrid({ snapshot }: { snapshot: IssCommandSnapshot }) {
  const position = snapshot.position;
  const orbital = snapshot.orbital;
  return <div className="grid grid-cols-2 gap-[var(--space-1)] sm:grid-cols-3"><TelemetryCard label="Latitude">{formatNumber(position?.latitude, "°")}</TelemetryCard><TelemetryCard label="Longitude">{formatNumber(position?.longitude, "°")}</TelemetryCard><TelemetryCard label="Altitude" tone="accent">{formatNumber(position?.altitudeKm, " km")}</TelemetryCard><TelemetryCard label="Velocity">{formatCompact(position?.velocityKph, " km/h")}</TelemetryCard><TelemetryCard label="Visibility" tone={orbital?.daylight ? "primary" : "warning"}>{orbital?.visibility ?? "Synchronizing..."}</TelemetryCard><TelemetryCard label="Timestamp">{position ? formatUtc(position.timestamp) : "Synchronizing..."}</TelemetryCard></div>;
});

const OrbitalInformation = memo(function OrbitalInformation({ snapshot }: { snapshot: IssCommandSnapshot }) {
  const orbital = snapshot.orbital;
  return <HUDPanel title="Orbital information" eyebrow="Live calculations"><div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3"><Metric label="Orbital period" value={orbital ? formatNumber(orbital.orbitalPeriodMinutes, " min") : "Synchronizing..."} /><Metric label="Orbit number" value={orbital?.orbitNumber === null ? "TLE pending" : formatNumber(orbital?.orbitNumber)} /><Metric label="Distance today" value={orbital ? formatCompact(orbital.estimatedDistanceTravelledKm, " km") : "Synchronizing..."} /><Metric label="Day/night" value={orbital?.daylight ? "Daylight" : orbital ? "Night" : "Synchronizing..."} /><Metric label="Heading" value={orbital?.directionDegrees === null ? "Resolving" : formatNumber(orbital?.directionDegrees, "°")} /></div></HUDPanel>;
});

const Metric = memo(function Metric({ label, value }: { label: string; value: string }) { return <div className="border-l border-[var(--color-line)] pl-[var(--space-1)]"><p className="m-0 text-[0.5625rem] uppercase tracking-[0.14em] text-[var(--color-muted)]">{label}</p><p className="m-0 mt-1 text-xs uppercase tracking-[0.07em] text-[var(--color-information)]">{value}</p></div>; });

const MissionEvents = memo(function MissionEvents({ events }: { events: IssMissionEvent[] }) { return <HUDPanel title="Mission events" eyebrow="ISS activity"><div className="min-h-28 space-y-[var(--space-1)]">{events.length === 0 ? <p className="m-0 py-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Awaiting orbital events<span className="terminal-cursor">_</span></p> : events.map((event) => <p key={event.id} className="m-0 text-[0.625rem] uppercase tracking-[0.08em] text-[var(--color-muted)]"><span className="text-[var(--color-primary)]">[{formatUtc(event.timestamp)}]</span> {event.message}</p>)}</div></HUDPanel>; });

const PassPredictions = memo(function PassPredictions() {
  const [input, setInput] = useState("");
  const [query, setQuery] = useState("");
  const passes = useIssPassPredictions(query);
  const submit = useCallback((event: React.FormEvent<HTMLFormElement>) => { event.preventDefault(); setQuery(input); }, [input]);
  return <HUDPanel title="Next ISS passes" eyebrow="Observer search"><form onSubmit={submit} className="flex flex-col gap-[var(--space-1)] sm:flex-row"><input value={input} onChange={(event) => setInput(event.target.value)} aria-label="Search city or coordinates for ISS passes" placeholder="CITY OR LATITUDE, LONGITUDE" className="min-h-11 flex-1 border border-[var(--color-line)] bg-[var(--color-void)] px-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-information)] outline-none placeholder:text-[var(--color-muted)] focus:border-[var(--color-primary)]" /><button type="submit" className="min-h-11 border border-[var(--color-primary)] bg-[var(--color-primary)]/10 px-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-primary)]">Query passes</button></form><div className="mt-[var(--space-2)]">{passes.isFetching && <p className="m-0 py-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Calculating next passes<span className="terminal-cursor">_</span></p>}{passes.error && <p className="m-0 py-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-danger)]">{passes.error.message || "Pass predictions unavailable for this location"}</p>}{passes.data && <PassList passes={passes.data.passes} label={passes.data.location.label} />}{!query && <p className="m-0 py-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">Enter a city or latitude,longitude to calculate observation passes</p>}</div></HUDPanel>;
});

const PassList = memo(function PassList({ passes, label }: { passes: IssPass[]; label: string }) { return <><p className="m-0 mb-[var(--space-1)] text-[0.625rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Observer / {label}</p>{passes.length === 0 ? <p className="m-0 py-[var(--space-2)] text-xs uppercase tracking-[0.12em] text-[var(--color-muted)]">No supported passes in the current prediction window</p> : <div className="space-y-[var(--space-1)]">{passes.map((pass) => <div key={`${pass.startTime}-${pass.riseDirection}`} className="grid grid-cols-2 gap-[var(--space-1)] border-b border-[var(--color-line)] pb-[var(--space-1)] text-[0.625rem] uppercase tracking-[0.08em] sm:grid-cols-4"><span className="text-[var(--color-information)]">{formatUtc(pass.startTime)}</span><span className="text-[var(--color-muted)]">{Math.round(pass.durationSeconds)} sec</span><span className="text-[var(--color-accent)]">{formatNumber(pass.maxElevationDegrees, "°")}</span><span className="text-[var(--color-muted)]">{pass.riseDirection} → {pass.setDirection}</span></div>)}</div>}</>; });

export function IssCommandCenter() {
  const command = useIssCommand();
  const snapshot = command.data;
  const healthTone = snapshot?.health === "connected" ? "operational" : snapshot?.health === "degraded" ? "warning" : "critical";
  const healthLabel = snapshot?.health ?? "offline";
  return <div className="space-y-[var(--space-4)]"><div className="flex flex-col justify-between gap-[var(--space-2)] sm:flex-row sm:items-end"><div><p className="m-0 text-[0.625rem] uppercase tracking-[0.2em] text-[var(--color-accent)]">03 / Orbital Asset</p><h1 className="m-0 mt-2 font-[var(--font-display)] text-3xl uppercase tracking-[0.08em]">ISS Tracker</h1></div><StatusChip tone={healthTone} title={snapshot?.error ?? undefined}>ISS {healthLabel}</StatusChip></div>{snapshot?.error && <p className="m-0 text-[0.625rem] uppercase tracking-[0.1em] text-[var(--color-accent)]">{snapshot.error}</p>}<HUDPanel title="Orbital position" eyebrow="Tracking window"><IssWorldMap snapshot={snapshot ?? { position: null, trail: [], health: "offline", error: null, orbital: null, events: [], updatedAt: new Date(0).toISOString() }} /></HUDPanel><div><SectionHeader index="01" title="Live telemetry" detail="5 second update" /><div className="mt-[var(--space-2)]"><TelemetryGrid snapshot={snapshot ?? { position: null, trail: [], health: "offline", error: null, orbital: null, events: [], updatedAt: new Date(0).toISOString() }} /></div></div><div className="grid gap-[var(--space-2)] lg:grid-cols-2"><OrbitalInformation snapshot={snapshot ?? { position: null, trail: [], health: "offline", error: null, orbital: null, events: [], updatedAt: new Date(0).toISOString() }} /><MissionEvents events={snapshot?.events ?? []} /></div><PassPredictions /></div>;
}
