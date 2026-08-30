"use client";

import { Edges } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { memo } from "react";
import { spacecraftPalette } from "@/components/3d/Spacecraft/palette";
import type { SpacecraftComponentId } from "@/components/3d/Spacecraft/types";

interface SpacecraftModelProps {
  hoveredComponent: SpacecraftComponentId | null;
  selectedComponent: SpacecraftComponentId | null;
  onHover: (component: SpacecraftComponentId | null) => void;
  onSelect: (component: SpacecraftComponentId) => void;
}

interface SpacecraftPartProps {
  id: SpacecraftComponentId;
  hoveredComponent: SpacecraftComponentId | null;
  selectedComponent: SpacecraftComponentId | null;
  onHover: (component: SpacecraftComponentId | null) => void;
  onSelect: (component: SpacecraftComponentId) => void;
  children: React.ReactNode;
}

function SpacecraftPart({ id, hoveredComponent, selectedComponent, onHover, onSelect, children }: SpacecraftPartProps) {
  const isHighlighted = hoveredComponent === id || selectedComponent === id;
  const handlePointerOver = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHover(id); document.body.style.cursor = "pointer"; };
  const handlePointerOut = (event: ThreeEvent<PointerEvent>) => { event.stopPropagation(); onHover(null); document.body.style.cursor = ""; };
  const handleClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(id); };
  return <group name={id} onPointerOver={handlePointerOver} onPointerOut={handlePointerOut} onClick={handleClick} userData={{ id, highlighted: isHighlighted }}>{children}</group>;
}

function HullMaterial({ highlighted = false }: { highlighted?: boolean }) {
  return <meshStandardMaterial color={highlighted ? spacecraftPalette.hullRaised : spacecraftPalette.hull} metalness={0.76} roughness={0.34} emissive={highlighted ? spacecraftPalette.cyan : spacecraftPalette.secondary} emissiveIntensity={highlighted ? 0.48 : 0.1} />;
}

function EdgeMaterial({ highlighted = false }: { highlighted?: boolean }) {
  return <Edges threshold={15} color={highlighted ? spacecraftPalette.cyan : spacecraftPalette.primary} linewidth={highlighted ? 1.75 : 1} />;
}

function SolarArray({ id, side, highlighted, ...interaction }: Omit<SpacecraftPartProps, "children"> & { side: -1 | 1; highlighted: boolean }) {
  return <SpacecraftPart id={id} {...interaction}><group position={[side * 1.45, 0, 0]}><mesh scale={[1.12, 0.07, 0.42]}><boxGeometry /><HullMaterial highlighted={highlighted} /><EdgeMaterial highlighted={highlighted} /></mesh>{[-0.72, -0.36, 0, 0.36, 0.72].map((offset) => <mesh key={offset} position={[offset, 0.08, 0]} scale={[0.012, 0.012, 0.44]}><boxGeometry /><meshBasicMaterial color={spacecraftPalette.secondary} /></mesh>)}</group></SpacecraftPart>;
}

export const SpacecraftModel = memo(function SpacecraftModel({ hoveredComponent, selectedComponent, onHover, onSelect }: SpacecraftModelProps) {
  const interaction = { hoveredComponent, selectedComponent, onHover, onSelect };
  const highlighted = (id: SpacecraftComponentId) => hoveredComponent === id || selectedComponent === id;
  return <group rotation={[0.16, -0.68, 0.06]} scale={0.88}>
    <SpacecraftPart id="BODY" {...interaction}><mesh scale={[0.5, 0.42, 0.92]}><cylinderGeometry args={[0.54, 0.64, 1.7, 10]} /><HullMaterial highlighted={highlighted("BODY")} /><EdgeMaterial highlighted={highlighted("BODY")} /></mesh></SpacecraftPart>
    <SolarArray id="SOLAR_ARRAY_LEFT" side={-1} highlighted={highlighted("SOLAR_ARRAY_LEFT")} {...interaction} />
    <SolarArray id="SOLAR_ARRAY_RIGHT" side={1} highlighted={highlighted("SOLAR_ARRAY_RIGHT")} {...interaction} />
    <SpacecraftPart id="HIGH_GAIN_DISH" {...interaction}><group position={[0, 0.05, 1.06]} rotation={[Math.PI / 2, 0, 0]}><mesh scale={[0.48, 0.18, 0.48]}><sphereGeometry args={[1, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2]} /><HullMaterial highlighted={highlighted("HIGH_GAIN_DISH")} /><EdgeMaterial highlighted={highlighted("HIGH_GAIN_DISH")} /></mesh><mesh position={[0, 0.3, 0]} scale={0.07}><sphereGeometry args={[1, 8, 8]} /><meshBasicMaterial color={spacecraftPalette.primary} /></mesh></group></SpacecraftPart>
    <SpacecraftPart id="ANTENNA" {...interaction}><group position={[0, 0.85, 0.25]}><mesh scale={[0.045, 0.52, 0.045]}><cylinderGeometry args={[1, 1, 1, 8]} /><HullMaterial highlighted={highlighted("ANTENNA")} /><EdgeMaterial highlighted={highlighted("ANTENNA")} /></mesh><mesh position={[0, 0.58, 0]} scale={[0.14, 0.14, 0.14]}><octahedronGeometry args={[1]} /><meshBasicMaterial color={spacecraftPalette.primary} /></mesh></group></SpacecraftPart>
    <SpacecraftPart id="BOOM" {...interaction}><group position={[0.58, -0.52, -0.22]} rotation={[0, 0, -0.7]}><mesh scale={[0.04, 0.88, 0.04]}><cylinderGeometry args={[1, 1, 1, 8]} /><HullMaterial highlighted={highlighted("BOOM")} /><EdgeMaterial highlighted={highlighted("BOOM")} /></mesh></group></SpacecraftPart>
    <SpacecraftPart id="THRUSTER" {...interaction}><group position={[0, 0, -1.02]} rotation={[Math.PI / 2, 0, 0]}><mesh scale={[0.25, 0.3, 0.25]}><coneGeometry args={[1, 1, 8, 1, true]} /><HullMaterial highlighted={highlighted("THRUSTER")} /><EdgeMaterial highlighted={highlighted("THRUSTER")} /></mesh></group></SpacecraftPart>
    <SpacecraftPart id="SENSOR" {...interaction}><group position={[-0.38, 0.18, 0.74]}><mesh scale={[0.17, 0.17, 0.17]}><boxGeometry /><HullMaterial highlighted={highlighted("SENSOR")} /><EdgeMaterial highlighted={highlighted("SENSOR")} /></mesh><mesh position={[0, 0, 0.18]} scale={0.08}><sphereGeometry args={[1, 12, 12]} /><meshBasicMaterial color={spacecraftPalette.cyan} /></mesh></group></SpacecraftPart>
    <SpacecraftPart id="COMMUNICATION_MODULE" {...interaction}><group position={[0.42, 0.24, -0.22]}><mesh scale={[0.22, 0.28, 0.26]}><boxGeometry /><HullMaterial highlighted={highlighted("COMMUNICATION_MODULE")} /><EdgeMaterial highlighted={highlighted("COMMUNICATION_MODULE")} /></mesh></group></SpacecraftPart>
  </group>;
});
