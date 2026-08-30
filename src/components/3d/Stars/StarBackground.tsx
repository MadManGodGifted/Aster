"use client";

import { Stars } from "@react-three/drei";
import { memo } from "react";

export const StarBackground = memo(function StarBackground() {
  return <Stars radius={80} depth={30} count={900} factor={1.5} saturation={0} fade speed={0} />;
});
