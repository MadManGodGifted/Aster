"use client";

import dynamic from "next/dynamic";
import { memo, useCallback, useMemo, useState } from "react";
import { LazyScene } from "@/components/3d/SceneBoundary";
import type { OrbitalContact } from "@/components/3d/Orbital/RetroOrbitalScene";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { getPreferredSceneQuality } from "@/lib/three/quality";

const SceneFallback = () => null;
const RetroOrbitalScene = dynamic(() => import("@/components/3d/Orbital/RetroOrbitalScene").then((module) => module.RetroOrbitalScene), { ssr: false, loading: SceneFallback });

export const RetroOrbitalEngine = memo(function RetroOrbitalEngine({ contacts, status }: { contacts: OrbitalContact[]; status: string }) {
  const { elementRef, isVisible } = useSceneVisibility();
  const quality = useMemo(getPreferredSceneQuality, []);
  const [selectedContact, setSelectedContact] = useState<string | null>(null);
  const selected = contacts.find((contact) => contact.id === selectedContact);
  const selectContact = useCallback((id: string) => setSelectedContact(id), []);
  return <div ref={elementRef} className="relative h-[22rem] overflow-hidden sm:h-[27rem]" aria-label="Interactive tactical orbital model"><LazyScene quality={quality} paused={!isVisible} ariaLabel="Interactive three-dimensional tactical orbital model" className="h-full w-full"><RetroOrbitalScene contacts={contacts} selectedContact={selectedContact} onSelect={selectContact} /></LazyScene><div className="pointer-events-none absolute inset-x-[var(--space-2)] top-[var(--space-2)] flex items-start justify-between gap-[var(--space-2)] text-[0.5625rem] uppercase tracking-[0.14em]"><span className="border border-[var(--color-accent)]/65 bg-[var(--color-void)]/80 px-1 py-0.5 text-[var(--color-accent)]">Geocentric tactical map</span><span className="border border-[var(--color-primary)]/50 bg-[var(--color-void)]/80 px-1 py-0.5 text-[var(--color-primary)]">{status}</span></div>{selected ? <div className="pointer-events-none absolute bottom-[var(--space-2)] left-[var(--space-2)] border border-[var(--color-line)] bg-[var(--color-void)]/90 px-[var(--space-1)] py-1 text-[0.5625rem] uppercase tracking-[0.1em]"><p className="m-0 text-[var(--color-primary)]">Target lock / {selected.label}</p><p className="m-0 mt-1 text-[var(--color-muted)]">{selected.risk} orbital contact</p></div> : <p className="pointer-events-none absolute bottom-[var(--space-2)] left-[var(--space-2)] m-0 text-[0.5625rem] uppercase tracking-[0.12em] text-[var(--color-muted)]">Drag to rotate / scroll to zoom / select a contact</p>}</div>;
});
