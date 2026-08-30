"use client";

import dynamic from "next/dynamic";
import type { SceneProps } from "@/components/3d/Scene";

export const LazyScene = dynamic<SceneProps>(() => import("@/components/3d/Scene").then((module) => module.Scene), { ssr: false, loading: () => null });
