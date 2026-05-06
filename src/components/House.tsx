import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface BlockProps {
  position: [number, number, number];
  color: string;
  scale?: [number, number, number];
  emissive?: string;
  emissiveIntensity?: number;
  roughness?: number;
}

function Block({ position, color, scale = [1, 1, 1], emissive, emissiveIntensity, roughness = 0.7 }: BlockProps) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={scale} />
      <meshStandardMaterial 
        color={color} 
        emissive={emissive || color} 
        emissiveIntensity={emissiveIntensity || 0} 
        roughness={roughness}
      />
    </mesh>
  );
}

export function House({ position }: { position: [number, number, number] }) {
  const [x, y, z] = position;
  const light1 = useRef<THREE.PointLight>(null);
  const light2 = useRef<THREE.PointLight>(null);
  const light3 = useRef<THREE.PointLight>(null);
  
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (light1.current) light1.current.intensity = 2 + Math.sin(t * 3) * 0.5 + (Math.random() - 0.5) * 0.2;
    if (light2.current) light2.current.intensity = 1 + Math.sin(t * 2) * 0.3 + (Math.random() - 0.5) * 0.2;
    if (light3.current) light3.current.intensity = 1 + Math.sin(t * 4) * 0.3 + (Math.random() - 0.5) * 0.2;
  });

  return (
    <group position={[x, y, z]}>
      {/* Foundation/Porch */}
      <Block position={[0, -0.4, 0]} color="#4e342e" scale={[6, 0.2, 5]} roughness={0.9} />
      
      {/* Main Body */}
      <Block position={[0, 0.5, 0]} color="#3e2723" scale={[4, 2, 3]} roughness={0.8} />
      
      {/* Upper Level / Attic */}
      <Block position={[0, 1.5, 0]} color="#3e2723" scale={[3, 1, 2]} roughness={0.8} />
      
      {/* Detailed Roof Shingles */}
      <Block position={[0, 2.2, 0]} color="#1a1a1a" scale={[5.2, 0.2, 4.2]} />
      <Block position={[1.5, 2.3, 1]} color="#2c2c2c" scale={[0.4, 0.1, 0.4]} />
      <Block position={[-1.5, 2.3, -1]} color="#2c2c2c" scale={[0.4, 0.1, 0.4]} />
      <Block position={[0.5, 2.3, 1.5]} color="#2c2c2c" scale={[0.4, 0.1, 0.4]} />
      <Block position={[-0.5, 2.3, -1.5]} color="#2c2c2c" scale={[0.4, 0.1, 0.4]} />
      
      <Block position={[0, 2.6, 0]} color="#1a1a1a" scale={[3.2, 0.2, 2.2]} />
      <Block position={[0.8, 2.7, 0.5]} color="#2c2c2c" scale={[0.3, 0.1, 0.3]} />
      <Block position={[-0.8, 2.7, -0.5]} color="#2c2c2c" scale={[0.3, 0.1, 0.3]} />
      
      <Block position={[0, 3, 0]} color="#1a1a1a" scale={[1.2, 0.2, 1.2]} />
      
      {/* Structural Corner Beams */}
      <Block position={[1.9, 0.5, 1.4]} color="#212121" scale={[0.2, 2.1, 0.2]} />
      <Block position={[-1.9, 0.5, 1.4]} color="#212121" scale={[0.2, 2.1, 0.2]} />
      <Block position={[1.9, 0.5, -1.4]} color="#212121" scale={[0.2, 2.1, 0.2]} />
      <Block position={[-1.9, 0.5, -1.4]} color="#212121" scale={[0.2, 2.1, 0.2]} />
      
      {/* Window Sills */}
      <Block position={[1.5, 0.3, 1.55]} color="#212121" scale={[1, 0.1, 0.2]} />
      <Block position={[-1.5, 0.3, 1.55]} color="#212121" scale={[1, 0.1, 0.2]} />
      
      {/* Door */}
      <Block position={[0, 0.25, 1.55]} color="#1b1b1b" scale={[1, 1.5, 0.1]} />
      <Block position={[0.3, 0.25, 1.6]} color="#ffc107" scale={[0.1, 0.1, 0.1]} emissive="#ffc107" emissiveIntensity={1} />
      
      {/* Windows with interior light */}
      <Block position={[1.5, 0.75, 1.55]} color="#ffecb3" scale={[0.8, 0.8, 0.1]} emissive="#ffecb3" emissiveIntensity={1} />
      <Block position={[-1.5, 0.75, 1.55]} color="#ffecb3" scale={[0.8, 0.8, 0.1]} emissive="#ffecb3" emissiveIntensity={1} />
      <Block position={[0, 1.5, 1.05]} color="#ffecb3" scale={[0.6, 0.6, 0.1]} emissive="#ffecb3" emissiveIntensity={1} />
      
      {/* Light Sources for the house */}
      <pointLight ref={light1} position={[0, 1, 2.5]} intensity={2} distance={8} color="#ffecb3" castShadow />
      <pointLight ref={light2} position={[1.5, 0.75, 2]} intensity={1} distance={4} color="#ffecb3" />
      <pointLight ref={light3} position={[-1.5, 0.75, 2]} intensity={1} distance={4} color="#ffecb3" />
      
      {/* Chimney */}
      <Block position={[1.2, 2, -0.5]} color="#424242" scale={[0.6, 2, 0.6]} />
      <Block position={[1.2, 3.1, -0.5]} color="#212121" scale={[0.8, 0.2, 0.8]} />
      
      {/* Fence around the porch */}
      <Block position={[2.9, 0, 0]} color="#4e342e" scale={[0.2, 1, 5]} />
      <Block position={[-2.9, 0, 0]} color="#4e342e" scale={[0.2, 1, 5]} />
      <Block position={[0, 0, -2.4]} color="#4e342e" scale={[6, 1, 0.2]} />
      
      {/* Porch Detail */}
      <Block position={[0, -0.2, 3]} color="#5d4037" scale={[2.5, 0.1, 1.2]} />
      <Block position={[1.2, 0.2, 3]} color="#3e2723" scale={[0.1, 0.8, 0.1]} />
      <Block position={[-1.2, 0.2, 3]} color="#3e2723" scale={[0.1, 0.8, 0.1]} />
      
      {/* Window Frames */}
      <Block position={[1.5, 0.75, 1.57]} color="#212121" scale={[0.9, 0.9, 0.05]} />
      <Block position={[-1.5, 0.75, 1.57]} color="#212121" scale={[0.9, 0.9, 0.05]} />
      
      {/* Structural beams decoration */}
      <Block position={[2, 0.5, 1.5]} color="#212121" scale={[0.1, 2, 0.1]} />
      <Block position={[-2, 0.5, 1.5]} color="#212121" scale={[0.1, 2, 0.1]} />
      <Block position={[2, 0.5, -1.5]} color="#212121" scale={[0.1, 2, 0.1]} />
      <Block position={[-2, 0.5, -1.5]} color="#212121" scale={[0.1, 2, 0.1]} />
      
      {/* Steps with more detail */}
      <Block position={[0, -0.6, 3.5]} color="#5d4037" scale={[2, 0.2, 1]} />
      <Block position={[0, -0.4, 4.2]} color="#5d4037" scale={[1.5, 0.2, 0.8]} />
    </group>
  );
}
