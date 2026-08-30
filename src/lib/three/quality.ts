import type { SceneQuality } from "@/types/three";

const LOW_DEVICE_MEMORY_GB = 4;
const HIGH_DEVICE_MEMORY_GB = 8;
const LOW_PIXEL_RATIO = 1;
const HIGH_PIXEL_RATIO = 2;

interface NavigatorWithMemory extends Navigator { deviceMemory?: number; }

export function resolveSceneQuality(deviceMemoryGb: number | undefined, pixelRatio: number): SceneQuality {
  const availableMemoryGb = deviceMemoryGb ?? 0;
  if (availableMemoryGb > 0 && availableMemoryGb < LOW_DEVICE_MEMORY_GB || pixelRatio <= LOW_PIXEL_RATIO) return "low";
  if (availableMemoryGb >= HIGH_DEVICE_MEMORY_GB && pixelRatio >= HIGH_PIXEL_RATIO) return "high";
  return "balanced";
}

export function getPreferredSceneQuality(): SceneQuality {
  if (typeof window === "undefined") return "balanced";
  const navigatorWithMemory = navigator as NavigatorWithMemory;
  return resolveSceneQuality(navigatorWithMemory.deviceMemory, window.devicePixelRatio);
}
