"use client";

import { EarthCameraRig } from "@/components/3d/Camera/EarthCameraRig";
import { EarthScene } from "@/components/3d/Earth/EarthScene";
import { SunLight } from "@/components/3d/Lighting/SunLight";
import { StarBackground } from "@/components/3d/Stars/StarBackground";

export function EarthSceneContent() {
  return <><color attach="background" args={["#02030a"]} /><StarBackground /><SunLight /><EarthScene /><EarthCameraRig /></>;
}
