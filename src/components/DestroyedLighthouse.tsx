import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function DestroyedLighthouse({ position }: { position: [number, number, number] }) {
  const groupRef = useRef<THREE.Group>(null);
  
  useFrame((state, delta) => {
    if (!groupRef.current) return;
    // Sink and rotate smoothly using delta
    groupRef.current.position.y -= delta * 2;
    groupRef.current.rotation.z += delta * 0.5;
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Just a few broken pieces */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[4, 2, 4]} />
        <meshStandardMaterial color="#222" />
      </mesh>
      <mesh position={[1, 3, 1]} rotation={[0.4, 0.4, 0]}>
        <boxGeometry args={[2, 1, 2]} />
        <meshStandardMaterial color="#aaa" />
      </mesh>
    </group>
  );
}
