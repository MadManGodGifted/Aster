"use client";

import { useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import { AdditiveBlending, Group, SRGBColorSpace, Texture } from "three";
import { Atmosphere } from "@/components/3d/Earth/Atmosphere";
import { getSceneAssetPath } from "@/lib/three/assets";

const EARTH_ROTATION_SPEED = 0.018;
const CLOUD_ROTATION_SPEED = 0.023;

function configureColorTexture(texture: Texture): Texture { texture.colorSpace = SRGBColorSpace; return texture; }

export const EarthScene = memo(function EarthScene() {
  const group = useRef<Group>(null);
  const clouds = useRef<Group>(null);
  const [day, normal, specular, night, cloud] = useTexture([getSceneAssetPath("earthDay"), getSceneAssetPath("earthNormal"), getSceneAssetPath("earthSpecular"), getSceneAssetPath("earthNight"), getSceneAssetPath("earthClouds")]);
  useMemo(() => { configureColorTexture(day); configureColorTexture(night); configureColorTexture(cloud); }, [cloud, day, night]);
  useFrame((_, delta) => {
    if (group.current) group.current.rotation.y += delta * EARTH_ROTATION_SPEED;
    if (clouds.current) clouds.current.rotation.y += delta * CLOUD_ROTATION_SPEED;
  });
  return <group ref={group} rotation={[0.15, -0.6, 0]}><mesh><sphereGeometry args={[1, 96, 96]} /><meshPhysicalMaterial map={day} normalMap={normal} roughnessMap={specular} roughness={0.68} metalness={0} clearcoat={0.04} /></mesh><mesh scale={1.002}><sphereGeometry args={[1, 96, 96]} /><meshBasicMaterial map={night} transparent opacity={0.2} blending={AdditiveBlending} depthWrite={false} /></mesh><group ref={clouds}><mesh scale={1.009}><sphereGeometry args={[1, 72, 72]} /><meshStandardMaterial map={cloud} transparent opacity={0.32} depthWrite={false} roughness={0.95} /></mesh></group><Atmosphere /></group>;
});
