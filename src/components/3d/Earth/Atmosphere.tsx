"use client";

import { AdditiveBlending, BackSide } from "three";
import { memo } from "react";

export const Atmosphere = memo(function Atmosphere() {
  return <mesh scale={1.06}><sphereGeometry args={[1, 64, 64]} /><meshBasicMaterial color="#64b8ff" transparent opacity={0.14} side={BackSide} blending={AdditiveBlending} depthWrite={false} /></mesh>;
});
