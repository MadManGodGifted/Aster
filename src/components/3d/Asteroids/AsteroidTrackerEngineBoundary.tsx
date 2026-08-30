"use client";

import dynamic from "next/dynamic";
import type { AsteroidContact } from "@/components/3d/Asteroids/AsteroidTrackerScene";

const AsteroidTrackerEngine = dynamic(() => import("@/components/3d/Asteroids/AsteroidTrackerEngine").then((module) => module.AsteroidTrackerEngine), { ssr: false, loading: () => <div className="h-[22rem] bg-[var(--color-void)] sm:h-[27rem]" /> });

export function AsteroidTrackerEngineBoundary({ contacts, status }: { contacts: AsteroidContact[]; status: string }) { return <AsteroidTrackerEngine contacts={contacts} status={status} />; }
