"use client";

import dynamic from "next/dynamic";

const EarthEngine = dynamic(() => import("@/components/3d/Earth/EarthEngine").then((module) => module.EarthEngine), { ssr: false, loading: () => null });

export function EarthEngineBoundary({ className }: { className?: string }) { return <EarthEngine className={className} />; }
