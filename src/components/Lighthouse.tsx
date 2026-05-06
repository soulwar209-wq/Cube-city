import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlockProps {
  position: [number, number, number];
  color: string;
  scale?: [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
}

function Block({ position, color, scale = [1, 1, 1], emissive, emissiveIntensity }: BlockProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial 
        color={color} 
        emissive={emissive || color} 
        emissiveIntensity={emissiveIntensity || 0} 
        roughness={0.6}
      />
    </mesh>
  );
}

export function Lighthouse({ position }: { position: [number, number, number] }) {
  const [lx, ly, lz] = position;
  const lightRef = useRef<THREE.PointLight>(null);
  const spotLightRef = useRef<THREE.SpotLight>(null);
  const spotTarget = useMemo(() => new THREE.Object3D(), []);
  const flareRef = useRef<THREE.Group>(null);
  const lanternRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (flareRef.current) {
      flareRef.current.rotation.y = t * 0.5; // Slower, smoother rotation
      
      // Keep spotlight target in sync with beacon rotation
      const distance = 40;
      spotTarget.position.set(
        Math.cos(flareRef.current.rotation.y) * distance,
        -5,
        -Math.sin(flareRef.current.rotation.y) * distance
      );
    }
    if (lightRef.current) {
      // Smoother pulsing intensity
      lightRef.current.intensity = 20 + Math.sin(t * 2) * 5;
    }
    if (lanternRef.current) {
      (lanternRef.current.material as THREE.MeshStandardMaterial).emissiveIntensity = 2 + Math.sin(t * 5) * 1 + (Math.random() * 0.5); // Add subtle flicker
    }
  });

  return (
    <group position={[lx, ly, lz]}>
      <primitive object={spotTarget} />
      {/* Base on rocks with integrated boulders */}
      <Block position={[0, -0.2, 0]} color="#424242" scale={[5, 1, 5]} />
      <Block position={[0.2, 0.2, 0.1]} color="#333333" scale={[4.2, 0.8, 4.2]} />
      
      {/* Foundation boulders */}
      <Block position={[2.5, -0.2, 2]} color="#555555" scale={[1.2, 1.2, 1.2]} />
      <Block position={[-2.8, -0.4, 1.5]} color="#444444" scale={[1, 0.8, 1.2]} />
      <Block position={[1.8, -0.3, -2.5]} color="#555555" scale={[0.8, 1.5, 1]} />
      <Block position={[-2.2, -0.5, -2.2]} color="#666666" scale={[1.5, 1, 1.5]} />
      <Block position={[0, -0.4, 3.2]} color="#444444" scale={[1.4, 0.6, 1]} />
      <Block position={[-3, -0.2, -1]} color="#555555" scale={[0.8, 0.8, 2]} />
      
      {/* Tower segments with window ports */}
      <Block position={[0, 1.5, 0]} color="#1a1a1a" scale={[3, 1, 3]} />
      <Block position={[1.4, 1.5, 0]} color="#111111" scale={[0.3, 0.4, 0.4]} />
      
      <Block position={[0, 2.5, 0]} color="#c0c0c0" scale={[2.8, 1, 2.8]} />
      
      <Block position={[0, 3.5, 0]} color="#1a1a1a" scale={[2.6, 1, 2.6]} />
      <Block position={[-1.2, 3.5, 0]} color="#111111" scale={[0.3, 0.4, 0.4]} />
      
      <Block position={[0, 4.5, 0]} color="#c0c0c0" scale={[2.4, 1, 2.4]} />
      
      <Block position={[0, 5.5, 0]} color="#1a1a1a" scale={[2.2, 1, 2.2]} />
      <Block position={[0, 5.5, 1]} color="#111111" scale={[0.4, 0.4, 0.3]} />
      
      <Block position={[0, 6.5, 0]} color="#c0c0c0" scale={[2.0, 1, 2.0]} />
      <Block position={[0, 7.5, 0]} color="#1a1a1a" scale={[1.8, 1, 1.8]} />
      
      {/* Walkway gallery and detailed railings */}
      <Block position={[0, 8.2, 0]} color="#1b1b1b" scale={[2.5, 0.1, 2.5]} />
      <Block position={[1.2, 8.35, 1.2]} color="#111111" scale={[0.05, 0.4, 0.05]} />
      <Block position={[-1.2, 8.35, 1.2]} color="#111111" scale={[0.05, 0.4, 0.05]} />
      <Block position={[1.2, 8.35, -1.2]} color="#111111" scale={[0.05, 0.4, 0.05]} />
      <Block position={[-1.2, 8.35, -1.2]} color="#111111" scale={[0.05, 0.4, 0.05]} />
      {/* Railing top bars */}
      <Block position={[0, 8.55, 1.2]} color="#111111" scale={[2.4, 0.05, 0.05]} />
      <Block position={[0, 8.55, -1.2]} color="#111111" scale={[2.4, 0.05, 0.05]} />
      <Block position={[1.2, 8.55, 0]} color="#111111" scale={[0.05, 0.05, 2.4]} />
      <Block position={[-1.2, 8.55, 0]} color="#111111" scale={[0.05, 0.05, 2.4]} />
      
      {/* Lantern room */}
      <Block position={[0, 8.5, 0]} color="#424242" scale={[2.2, 0.5, 2.2]} />
      <group position={[0, 9.5, 0]}>
        {/* Glass house */}
        <mesh castShadow>
          <boxGeometry args={[1.6, 1.6, 1.6]} />
          <meshStandardMaterial color="#81d4fa" transparent opacity={0.3} roughness={0.1} metalness={1} />
        </mesh>
        {/* Support pillars */}
        <Block position={[0.7, 0, 0.7]} color="#212121" scale={[0.2, 1.6, 0.2]} />
        <Block position={[-0.7, 0, 0.7]} color="#212121" scale={[0.2, 1.6, 0.2]} />
        <Block position={[0.7, 0, -0.7]} color="#212121" scale={[0.2, 1.6, 0.2]} />
        <Block position={[-0.7, 0, -0.7]} color="#212121" scale={[0.2, 1.6, 0.2]} />
      </group>
      
      {/* Top Cap */}
      <Block position={[0, 10.5, 0]} color="#1b1b1b" scale={[2.2, 0.4, 2.2]} />
      <Block position={[0, 11, 0]} color="#1b1b1b" scale={[0.2, 1.2, 0.2]} />

      {/* Actual Light Source */}
      <group position={[0, 9.5, 0]}>
        <pointLight ref={lightRef} intensity={25} distance={60} color="#ffab00" castShadow shadow-mapSize={[512, 512]} />
        <spotLight
          ref={spotLightRef}
          target={spotTarget}
          intensity={500}
          distance={120}
          angle={0.15}
          penumbra={0.5}
          color="#fff8e1"
          castShadow
          shadow-mapSize={[1024, 1024]}
        />
        <mesh ref={lanternRef}>
          <boxGeometry args={[0.8, 1, 0.8]} />
          <meshStandardMaterial color="#ffeb3b" emissive="#ffab00" emissiveIntensity={2} />
        </mesh>
        
        {/* Volumetric Beam Effect */}
        <group ref={flareRef}>
          {/* Main Beam */}
          <mesh position={[15, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.2, 5, 30, 4]} />
            <meshBasicMaterial color="#ffeb3b" transparent opacity={0.15} side={THREE.DoubleSide} />
          </mesh>
          {/* Secondary beam (glow) */}
          <mesh position={[20, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
            <cylinderGeometry args={[0.5, 8, 40, 4]} />
            <meshBasicMaterial color="#ffab00" transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
