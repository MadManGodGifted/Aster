"use client";

import { Edges, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { memo, useRef } from "react";
import type { Group } from "three";
import { StarBackground } from "@/components/3d/Stars/StarBackground";

export interface AsteroidContact { id: string; label: string; risk: "low" | "elevated" | "high"; }

const orbitDefinitions: Array<{ rotation: [number, number, number]; position: [number, number, number]; radius: number; speed: number }> = [
  { rotation: [0.3, 0.1, 0.2], position: [1.35, 0.12, 0], radius: 1.5, speed: 0.12 },
  { rotation: [-0.46, 0.42, -0.15], position: [-1.44, 0.25, 0], radius: 1.83, speed: -0.09 },
  { rotation: [0.88, -0.15, 0.33], position: [0.3, -0.12, -2.02], radius: 2.12, speed: 0.07 },
  { rotation: [0.12, 0.74, -0.55], position: [-0.22, 1.2, 1.18], radius: 2.36, speed: -0.055 },
  { rotation: [-0.7, 0.15, 0.62], position: [2.28, -0.38, 0.72], radius: 2.68, speed: 0.045 },
  { rotation: [0.55, -0.55, -0.2], position: [-2.15, -0.5, -0.48], radius: 2.95, speed: -0.035 },
];

function riskColor(risk: AsteroidContact["risk"]): string { return risk === "high" ? "#FF3B30" : risk === "elevated" ? "#FF6A00" : "#62FFD7"; }

const TacticalEarth = memo(function TacticalEarth() {
  const earthRef = useRef<Group>(null);
  useFrame((_, delta) => { if (earthRef.current) earthRef.current.rotation.y += delta * 0.055; });
  return <group ref={earthRef}><mesh><sphereGeometry args={[0.46, 20, 14]} /><meshStandardMaterial color="#071512" metalness={0.45} roughness={0.7} emissive="#0A3D31" emissiveIntensity={0.72} /><Edges threshold={12} color="#62FFD7" /></mesh><mesh scale={1.04}><sphereGeometry args={[0.46, 16, 10]} /><meshBasicMaterial color="#E4C15A" wireframe transparent opacity={0.1} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.63, 0.006, 4, 64]} /><meshBasicMaterial color="#FF6A00" transparent opacity={0.64} /></mesh></group>;
});

function TrackedAsteroid({ contact, index, selectedContact, onSelect }: { contact: AsteroidContact; index: number; selectedContact: string | null; onSelect: (id: string) => void }) {
  const definition = orbitDefinitions[index % orbitDefinitions.length];
  const orbitRef = useRef<Group>(null);
  const asteroidRef = useRef<Group>(null);
  const selected = selectedContact === contact.id;
  const color = riskColor(contact.risk);
  useFrame((_, delta) => { if (orbitRef.current) orbitRef.current.rotation.y += delta * definition.speed; if (asteroidRef.current) asteroidRef.current.rotation.x += delta * 0.42; });
  const handleClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(contact.id); };
  return <group rotation={definition.rotation}><mesh scale={[1, 0.52, 1]}><torusGeometry args={[definition.radius, 0.007, 4, 128]} /><meshBasicMaterial color={color} transparent opacity={selected ? 0.94 : 0.58} /></mesh><group ref={orbitRef}><group ref={asteroidRef} position={definition.position}><mesh onClick={handleClick} scale={selected ? 0.15 : 0.105}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial color={color} wireframe /></mesh><mesh scale={selected ? 0.04 : 0.026}><sphereGeometry args={[1, 10, 10]} /><meshBasicMaterial color={color} /></mesh>{selected && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.2, 0.007, 4, 42]} /><meshBasicMaterial color="#62FFD7" /></mesh>}</group></group></group>;
}

export const AsteroidTrackerScene = memo(function AsteroidTrackerScene({ contacts, selectedContact, onSelect }: { contacts: AsteroidContact[]; selectedContact: string | null; onSelect: (id: string) => void }) {
  return <><color attach="background" args={["#030509"]} /><fog attach="fog" args={["#030509", 5, 11]} /><StarBackground /><ambientLight intensity={0.5} color="#62FFD7" /><pointLight position={[2.5, 2.4, 3]} intensity={12} color="#FF6A00" distance={7} /><pointLight position={[-2.6, -1.5, 2]} intensity={6} color="#62FFD7" distance={5} /><TacticalEarth />{contacts.slice(0, orbitDefinitions.length).map((contact, index) => <TrackedAsteroid key={contact.id} contact={contact} index={index} selectedContact={selectedContact} onSelect={onSelect} />)}<PerspectiveCamera makeDefault position={[0, 1.68, 4.55]} fov={37} /><OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.5} maxDistance={7.5} minPolarAngle={0.35} maxPolarAngle={2.65} /></>;
});
