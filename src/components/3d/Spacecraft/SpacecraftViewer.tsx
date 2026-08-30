"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useState } from "react";
import { CommandButton } from "@/components/ui/CommandButton";
import { LazyScene } from "@/components/3d/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { getPreferredSceneQuality } from "@/lib/three/quality";
import { spacecraftComponents } from "@/components/3d/Spacecraft/types";
import type { SpacecraftCameraPreset, SpacecraftComponentId } from "@/components/3d/Spacecraft/types";

const SceneFallback = () => null;
const SpacecraftSceneContent = dynamic(() => import("@/components/3d/Spacecraft/SpacecraftSceneContent").then((module) => module.SpacecraftSceneContent), { ssr: false, loading: SceneFallback });
const presets: Array<{ id: SpacecraftCameraPreset; label: string }> = [{ id: "front", label: "Front" }, { id: "side", label: "Side" }, { id: "top", label: "Top" }, { id: "details", label: "Details" }];

export const SpacecraftViewer = memo(function SpacecraftViewer() {
  const { elementRef, isVisible } = useSceneVisibility();
  const quality = useMemo(getPreferredSceneQuality, []);
  const [preset, setPreset] = useState<SpacecraftCameraPreset>("front");
  const [commandId, setCommandId] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [hoveredComponent, setHoveredComponent] = useState<SpacecraftComponentId | null>(null);
  const [selectedComponent, setSelectedComponent] = useState<SpacecraftComponentId | null>(null);
  const activeComponent = selectedComponent ?? hoveredComponent;
  const activeSpec = activeComponent ? spacecraftComponents[activeComponent] : null;
  const setCameraPreset = useCallback((nextPreset: SpacecraftCameraPreset) => { setPreset(nextPreset); setCommandId((current) => current + 1); setIsTransitioning(true); }, []);
  const resetCamera = useCallback(() => { setCameraPreset("front"); setSelectedComponent(null); }, [setCameraPreset]);
  const updateHoveredComponent = useCallback((component: SpacecraftComponentId | null) => setHoveredComponent(component), []);
  const selectComponent = useCallback((component: SpacecraftComponentId) => setSelectedComponent(component), []);
  const completeTransition = useCallback(() => setIsTransitioning(false), []);
  return <div ref={elementRef} onDoubleClick={resetCamera} className="relative h-72 overflow-hidden border border-[var(--color-line)] bg-[var(--color-void)] sm:h-80" aria-label="Interactive spacecraft viewer">
    <LazyScene quality={quality} paused={!isVisible} renderMode="demand" className="h-full w-full"><SpacecraftSceneContent preset={preset} commandId={commandId} hoveredComponent={hoveredComponent} selectedComponent={selectedComponent} onHover={updateHoveredComponent} onSelect={selectComponent} onTransitionComplete={completeTransition} /></LazyScene>
    <div className="pointer-events-none absolute inset-x-[var(--space-1)] top-[var(--space-1)] flex items-start justify-between gap-[var(--space-1)] text-[0.5625rem] uppercase tracking-[0.12em] text-[var(--color-primary)]"><span className="border border-[var(--color-primary)]/50 bg-[var(--color-void)]/85 px-1 py-0.5">Vehicle / WebGL online</span><span className="border border-[var(--color-accent)]/50 bg-[var(--color-void)]/85 px-1 py-0.5 text-[var(--color-accent)]">{isTransitioning ? "Camera slewing" : "Attitude stable"}</span></div>
    <div className="absolute right-[var(--space-1)] top-8 z-10 flex max-w-28 flex-wrap justify-end gap-1">{presets.map((item) => <CommandButton key={item.id} variant="quiet" onClick={() => setCameraPreset(item.id)} className="min-h-8 px-1 text-[0.5625rem]">{item.label}</CommandButton>)}<CommandButton variant="quiet" onClick={resetCamera} className="min-h-8 px-1 text-[0.5625rem]">Reset</CommandButton></div>
    {activeSpec && <div className="pointer-events-none absolute bottom-[var(--space-1)] left-[var(--space-1)] max-w-[calc(100%-var(--space-2))] border border-[var(--color-line)] bg-[var(--color-void)]/90 px-[var(--space-1)] py-1 text-[0.5625rem] uppercase tracking-[0.1em]"><p className="m-0 text-[var(--color-primary)]">{activeSpec.id} / {activeSpec.status}</p><p className="m-0 mt-1 text-[var(--color-information)]">{activeSpec.function}</p><p className="m-0 mt-1 text-[var(--color-muted)]">{activeSpec.orientation} · {activeSpec.signal}</p></div>}
    {!activeSpec && <p className="pointer-events-none absolute bottom-[var(--space-1)] left-[var(--space-1)] m-0 text-[0.5625rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Select a vehicle subsystem / Double-click to reset</p>}
  </div>;
});
