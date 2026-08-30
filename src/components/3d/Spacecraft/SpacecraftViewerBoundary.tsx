"use client";

import dynamic from "next/dynamic";

const SpacecraftViewer = dynamic(() => import("@/components/3d/Spacecraft/SpacecraftViewer").then((module) => module.SpacecraftViewer), { ssr: false, loading: () => <div className="h-72 border border-[var(--color-line)] bg-[var(--color-void)] sm:h-80" /> });

export function SpacecraftViewerBoundary() { return <SpacecraftViewer />; }
