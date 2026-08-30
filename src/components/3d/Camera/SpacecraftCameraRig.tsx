"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { memo, useEffect, useRef } from "react";
import { MathUtils, MOUSE, Vector3 } from "three";
import type { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import type { SpacecraftCameraPreset } from "@/components/3d/Spacecraft/types";

const CAMERA_PRESETS: Record<SpacecraftCameraPreset, { position: [number, number, number]; target: [number, number, number] }> = {
  front: { position: [0, 0.45, 5.6], target: [0, 0, 0] },
  side: { position: [5.3, 0.4, 0.18], target: [0, 0, 0] },
  top: { position: [0.15, 5.7, 0.2], target: [0, 0, 0] },
  details: { position: [2.45, 1.15, 2.75], target: [0.15, 0.1, 0.35] },
};

interface SpacecraftCameraRigProps { preset: SpacecraftCameraPreset; commandId: number; onTransitionComplete: () => void; }

export const SpacecraftCameraRig = memo(function SpacecraftCameraRig({ preset, commandId, onTransitionComplete }: SpacecraftCameraRigProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const destinationPosition = useRef(new Vector3(...CAMERA_PRESETS.front.position));
  const destinationTarget = useRef(new Vector3(...CAMERA_PRESETS.front.target));
  const transitioning = useRef(false);
  const invalidate = useThree((state) => state.invalidate);
  useEffect(() => { const next = CAMERA_PRESETS[preset]; destinationPosition.current.set(...next.position); destinationTarget.current.set(...next.target); transitioning.current = true; invalidate(); }, [commandId, invalidate, preset]);
  useFrame((state, delta) => {
    if (!transitioning.current || !controlsRef.current) return;
    const progress = 1 - Math.exp(-5.4 * delta);
    state.camera.position.lerp(destinationPosition.current, progress);
    controlsRef.current.target.lerp(destinationTarget.current, progress);
    controlsRef.current.update();
    if (state.camera.position.distanceTo(destinationPosition.current) < 0.01 && controlsRef.current.target.distanceTo(destinationTarget.current) < 0.01) { state.camera.position.copy(destinationPosition.current); controlsRef.current.target.copy(destinationTarget.current); transitioning.current = false; onTransitionComplete(); return; }
    invalidate();
  });
  return <><PerspectiveCamera makeDefault position={CAMERA_PRESETS.front.position} fov={38} /><OrbitControls ref={controlsRef} enableDamping dampingFactor={0.08} enablePan minDistance={2.2} maxDistance={8.6} mouseButtons={{ LEFT: MOUSE.ROTATE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.PAN }} /></>;
});
