import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function GiantHand({ active, onGrab }: { active: boolean, onGrab: () => void }) {
  const groupRef = useRef<THREE.Group>(null);
  const handRef = useRef<THREE.Group>(null);
  const startTime = useRef<number | null>(null);
  
  useFrame((state, delta) => {
    if (!active) {
      startTime.current = null;
      return;
    }
    if (!startTime.current) startTime.current = state.clock.getElapsedTime();
    
    if (!groupRef.current) return;
    const t = state.clock.getElapsedTime() - startTime.current;
    
    // Animation phases
    // 0-2s: Descent
    // 2-3s: Grab
    // 3-6s: Pull down and move away
    
    if (t < 2) {
      groupRef.current.position.y = 20 - t * 8;
    } else if (t < 3) {
      // Grabbing action: 1 second grab
      if (handRef.current) handRef.current.rotation.z = Math.sin((t - 2) * Math.PI) * -0.5;
      if (t > 2.8) onGrab();
    } else {
      // Pull and break animation: use delta for smooth movement
      const moveSpeed = delta * 5;
      groupRef.current.position.y -= moveSpeed;
      groupRef.current.position.x -= moveSpeed * 0.5;
      groupRef.current.rotation.z += delta * 0.2;
    }
  });

  return (
    <group ref={groupRef} position={[15, 20, 15]} visible={active}>
      <group ref={handRef}>
        {/* Palm */}
        <mesh castShadow>
          <boxGeometry args={[4, 2, 4]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
        {/* Fingers */}
        <mesh position={[0, 2, 0]}>
          <boxGeometry args={[4, 4, 1]} />
          <meshStandardMaterial color="#1a1a1a" />
        </mesh>
      </group>
    </group>
  );
}
