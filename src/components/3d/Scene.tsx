"use client";

import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import type { PropsWithChildren } from "react";
import type { SceneQuality } from "@/types/three";

export interface SceneProps extends PropsWithChildren { quality?: SceneQuality; className?: string; paused?: boolean; renderMode?: "always" | "demand"; ariaLabel?: string; }

export function Scene({ children, quality = "balanced", className, paused = false, renderMode = "always", ariaLabel = "Three-dimensional orbital scene" }: SceneProps) {
  const dpr = quality === "low" ? 1 : quality === "high" ? 2 : 1.5;
  return <Canvas className={className} dpr={dpr} frameloop={paused ? "never" : renderMode} gl={{ antialias: quality !== "low", powerPreference: "high-performance" }} aria-label={ariaLabel}><Suspense fallback={null}>{children}</Suspense></Canvas>;
}
