"use client";

import dynamic from "next/dynamic";
import { memo, useMemo } from "react";
import { LazyScene } from "@/components/3d/SceneBoundary";
import { useSceneVisibility } from "@/hooks/useSceneVisibility";
import { getPreferredSceneQuality } from "@/lib/three/quality";

const SceneFallback = () => null;
const EarthSceneContent = dynamic(() => import("@/components/3d/Earth/EarthSceneContent").then((module) => module.EarthSceneContent), { ssr: false, loading: SceneFallback });

export const EarthEngine = memo(function EarthEngine({ className = "" }: { className?: string }) {
  const { elementRef, isVisible } = useSceneVisibility();
  const quality = useMemo(getPreferredSceneQuality, []);
  return <div ref={elementRef} className={className} aria-hidden="true"><LazyScene quality={quality} paused={!isVisible} className="pointer-events-none h-full w-full"><EarthSceneContent /></LazyScene></div>;
});
