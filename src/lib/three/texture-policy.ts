import type { SceneQuality } from "@/types/three";

export interface TextureLoadPolicy { maxAnisotropy: number; mipmaps: boolean; preferredResolution: number; }

const texturePolicies: Record<SceneQuality, TextureLoadPolicy> = {
  low: { maxAnisotropy: 1, mipmaps: true, preferredResolution: 1024 },
  balanced: { maxAnisotropy: 4, mipmaps: true, preferredResolution: 2048 },
  high: { maxAnisotropy: 8, mipmaps: true, preferredResolution: 4096 },
};

export function getTextureLoadPolicy(quality: SceneQuality): TextureLoadPolicy { return texturePolicies[quality]; }
