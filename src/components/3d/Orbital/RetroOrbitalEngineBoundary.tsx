"use client";

import dynamic from "next/dynamic";
import type { OrbitalContact } from "@/components/3d/Orbital/RetroOrbitalScene";

const RetroOrbitalEngine = dynamic(() => import("@/components/3d/Orbital/RetroOrbitalEngine").then((module) => module.RetroOrbitalEngine), { ssr: false, loading: () => <div className="h-[22rem] bg-[var(--color-void)] sm:h-[27rem]" /> });

export function RetroOrbitalEngineBoundary({ contacts, status }: { contacts: OrbitalContact[]; status: string }) { return <RetroOrbitalEngine contacts={contacts} status={status} />; }
