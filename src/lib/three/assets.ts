export type SceneAssetKind = "texture" | "model" | "hdr";

export interface SceneAsset { key: string; kind: SceneAssetKind; path: string; }

export const sceneAssets = {
  earthDay: { key: "earth-day", kind: "texture", path: "/assets/3d/textures/earth-day.jpg" },
  earthClouds: { key: "earth-clouds", kind: "texture", path: "/assets/3d/textures/earth-clouds.png" },
  earthNight: { key: "earth-night", kind: "texture", path: "/assets/3d/textures/earth-night.png" },
  earthNormal: { key: "earth-normal", kind: "texture", path: "/assets/3d/textures/earth-normal.jpg" },
  earthSpecular: { key: "earth-specular", kind: "texture", path: "/assets/3d/textures/earth-specular.jpg" },
  studioHdr: { key: "studio-hdr", kind: "hdr", path: "/assets/3d/hdr/studio.hdr" },
  issModel: { key: "iss-model", kind: "model", path: "/assets/3d/models/iss.glb" },
} as const satisfies Record<string, SceneAsset>;

export function getSceneAssetPath(key: keyof typeof sceneAssets): string { return sceneAssets[key].path; }
