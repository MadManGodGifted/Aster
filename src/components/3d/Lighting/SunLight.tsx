"use client";

import { memo } from "react";

export const SunLight = memo(function SunLight() {
  return <><ambientLight intensity={0.08} /><hemisphereLight args={["#9fc7ff", "#02030a", 0.3]} /><directionalLight position={[5, 3, 5]} intensity={2.3} color="#fff6df" /></>;
});
