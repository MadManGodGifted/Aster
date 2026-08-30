"use client";

import { OrbitControls, PerspectiveCamera } from "@react-three/drei";
import { memo } from "react";

export const EarthCameraRig = memo(function EarthCameraRig() {
  return <><PerspectiveCamera makeDefault position={[0, 0.2, 3.15]} fov={34} /><OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.15} maxDistance={5} minPolarAngle={0.45} maxPolarAngle={2.7} /></>;
});
