"use client";

import { Edges, OrbitControls, PerspectiveCamera } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useFrame } from "@react-three/fiber";
import { memo, useMemo, useRef } from "react";
import type { Group } from "three";
import { StarBackground } from "@/components/3d/Stars/StarBackground";

export interface OrbitalContact { id: string; label: string; risk: "nominal" | "elevated" | "critical"; }

interface RetroOrbitalSceneProps { contacts: OrbitalContact[]; selectedContact: string | null; onSelect: (id: string) => void; }

const contactPositions: Array<[number, number, number]> = [[1.8, 0.1, 0.15], [-1.25, 0.48, 0.85], [0.28, -0.3, -1.9], [-0.55, 1.05, -0.95], [1.2, -0.75, 1.1], [-1.85, -0.4, -0.4]];
const ringRotations: Array<[number, number, number]> = [[0.22, 0.08, 0], [-0.48, 0.3, 0.18], [0.78, 0.08, -0.48], [-0.16, 0.62, 0.38], [1.1, 0.28, 0.14]];

function riskColor(risk: OrbitalContact["risk"]): string { return risk === "critical" ? "#FF3B30" : risk === "elevated" ? "#FF6A00" : "#62FFD7"; }

const RetroEarth = memo(function RetroEarth() {
  const earthRef = useRef<Group>(null);
  useFrame((_, delta) => { if (earthRef.current) earthRef.current.rotation.y += delta * 0.08; });
  return <group ref={earthRef}><mesh><sphereGeometry args={[0.62, 24, 16]} /><meshStandardMaterial color="#071512" metalness={0.5} roughness={0.68} emissive="#0A3D31" emissiveIntensity={0.85} /><Edges threshold={12} color="#62FFD7" /></mesh><mesh scale={1.018}><sphereGeometry args={[0.62, 18, 12]} /><meshBasicMaterial color="#E4C15A" wireframe transparent opacity={0.14} /></mesh><mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.76, 0.008, 5, 72]} /><meshBasicMaterial color="#FF6A00" transparent opacity={0.76} /></mesh><mesh rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[0.72, 0.005, 5, 72]} /><meshBasicMaterial color="#62FFD7" transparent opacity={0.4} /></mesh></group>;
});

const OrbitRings = memo(function OrbitRings() {
  return <group>{ringRotations.map((rotation, index) => <mesh key={rotation.join("-")} rotation={rotation} scale={[1 + index * 0.28, 0.53 + index * 0.1, 1]}><torusGeometry args={[1.18, 0.008, 4, 112]} /><meshBasicMaterial color={index % 3 === 0 ? "#FF6A00" : index % 3 === 1 ? "#E4C15A" : "#FF3B30"} transparent opacity={index % 3 === 2 ? 0.44 : 0.6} /></mesh>)}</group>;
});

function ObjectContact({ contact, index, selected, onSelect }: { contact: OrbitalContact; index: number; selected: boolean; onSelect: (id: string) => void }) {
  const orbitRef = useRef<Group>(null);
  const color = riskColor(contact.risk);
  const position = contactPositions[index % contactPositions.length];
  useFrame((_, delta) => { if (orbitRef.current) orbitRef.current.rotation.y += delta * (0.055 + index * 0.006); });
  const handleClick = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(contact.id); };
  return <group ref={orbitRef} rotation={[index * 0.32, index * 0.17, 0]}><group position={position}><mesh onClick={handleClick} scale={selected ? 0.13 : 0.09}><icosahedronGeometry args={[1, 1]} /><meshBasicMaterial color={color} wireframe /></mesh><mesh scale={selected ? 0.04 : 0.026}><sphereGeometry args={[1, 10, 10]} /><meshBasicMaterial color={color} /></mesh>{selected && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[0.19, 0.007, 4, 40]} /><meshBasicMaterial color="#62FFD7" /></mesh>}</group></group>;
}

export const RetroOrbitalScene = memo(function RetroOrbitalScene({ contacts, selectedContact, onSelect }: RetroOrbitalSceneProps) {
  const mappedContacts = useMemo(() => contacts.slice(0, contactPositions.length), [contacts]);
  return <><color attach="background" args={["#030509"]} /><fog attach="fog" args={["#030509", 4, 10]} /><StarBackground /><ambientLight intensity={0.55} color="#62FFD7" /><pointLight position={[2.4, 2.6, 3]} intensity={13} color="#FF6A00" distance={6} /><pointLight position={[-2.5, -1.4, 2]} intensity={6} color="#62FFD7" distance={5} /><OrbitRings /><RetroEarth />{mappedContacts.map((contact, index) => <ObjectContact key={contact.id} contact={contact} index={index} selected={selectedContact === contact.id} onSelect={onSelect} />)}<PerspectiveCamera makeDefault position={[0, 1.75, 4.3]} fov={38} /><OrbitControls enablePan={false} enableDamping dampingFactor={0.08} minDistance={2.6} maxDistance={7} minPolarAngle={0.35} maxPolarAngle={2.65} /></>;
});
