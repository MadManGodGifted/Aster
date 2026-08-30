"use client";

import { memo } from "react";
import { spacecraftPalette } from "@/components/3d/Spacecraft/palette";

export const TechnicalReferences = memo(function TechnicalReferences() {
  return <group>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[2.55, 0.012, 6, 96]} /><meshBasicMaterial color={spacecraftPalette.orange} transparent opacity={0.72} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[1.15, 0.01, 6, 72]} /><meshBasicMaterial color={spacecraftPalette.primary} transparent opacity={0.5} /></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.52, 0.008, 6, 48]} /><meshBasicMaterial color={spacecraftPalette.primary} transparent opacity={0.4} /></mesh>
    <axesHelper args={[2.85]} />
    <gridHelper args={[6, 12, spacecraftPalette.secondary, spacecraftPalette.hullRaised]} position={[0, -1.62, 0]} />
  </group>;
});
