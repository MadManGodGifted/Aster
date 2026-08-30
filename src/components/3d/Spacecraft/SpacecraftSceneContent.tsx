"use client";

import { memo } from "react";
import { SpacecraftCameraRig } from "@/components/3d/Camera/SpacecraftCameraRig";
import { spacecraftPalette } from "@/components/3d/Spacecraft/palette";
import { SpacecraftModel } from "@/components/3d/Spacecraft/SpacecraftModel";
import { TechnicalReferences } from "@/components/3d/Spacecraft/TechnicalReferences";
import type { SpacecraftCameraPreset, SpacecraftComponentId } from "@/components/3d/Spacecraft/types";
import { StarBackground } from "@/components/3d/Stars/StarBackground";

interface SpacecraftSceneContentProps { preset: SpacecraftCameraPreset; commandId: number; hoveredComponent: SpacecraftComponentId | null; selectedComponent: SpacecraftComponentId | null; onHover: (component: SpacecraftComponentId | null) => void; onSelect: (component: SpacecraftComponentId) => void; onTransitionComplete: () => void; }

export const SpacecraftSceneContent = memo(function SpacecraftSceneContent(props: SpacecraftSceneContentProps) {
  return <><color attach="background" args={[spacecraftPalette.void]} /><fog attach="fog" args={[spacecraftPalette.void, 7, 14]} /><StarBackground /><ambientLight intensity={0.42} color={spacecraftPalette.secondary} /><hemisphereLight args={[spacecraftPalette.primary, spacecraftPalette.void, 0.65]} /><directionalLight position={[3, 5, 4]} intensity={2.2} color="#e9fff7" /><pointLight position={[-3, 1.5, 2]} intensity={12} color={spacecraftPalette.secondary} distance={7} /><TechnicalReferences /><SpacecraftModel hoveredComponent={props.hoveredComponent} selectedComponent={props.selectedComponent} onHover={props.onHover} onSelect={props.onSelect} /><SpacecraftCameraRig preset={props.preset} commandId={props.commandId} onTransitionComplete={props.onTransitionComplete} /></>;
});
