import { useRef, useMemo, forwardRef, useImperativeHandle, useLayoutEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

interface PlayerProps {
  position: [number, number, number];
  targetPosition: [number, number, number] | null;
  yOffset?: number;
}

export const Player = forwardRef<THREE.Group, PlayerProps>(({ position, targetPosition, yOffset = 0.5 }, ref) => {
  const meshRef = useRef<THREE.Group>(null);
  useImperativeHandle(ref, () => meshRef.current as THREE.Group);
  
  const pos = useMemo(() => new THREE.Vector3(...position), [position]);
  const target = useMemo(() => new THREE.Vector3(...position), [position]);
  const lookAt = useMemo(() => new THREE.Vector3(...position), [position]);
  
  // Track visual position for bobbing/animations
  const visualY = useRef(position[1]);
  
  // Reset when position prop changes
  useLayoutEffect(() => {
    console.log('Player mounted or position changed:', position);
    visualY.current = position[1];
    if (meshRef.current) {
        meshRef.current.position.set(position[0], position[1], position[2]);
    }
  }, [position]);

  useFrame((state, delta) => {
    if (!meshRef.current) return;
    // Cap delta to avoid large leaps during lag spikes
    const safeDelta = Math.min(delta, 0.04);

    if (targetPosition && !isNaN(targetPosition[0]) && isFinite(targetPosition[0])) {
      target.set(targetPosition[0], targetPosition[1] + yOffset, targetPosition[2]);
      
      const dist = pos.distanceTo(target);
      if (dist > 0.05 && dist < 200) { // Safety bound for movement
        // High-speed smooth follow with damping (physically based interpolation)
        const lambda = 12; 
        const alpha = 1 - Math.exp(-lambda * safeDelta);
        pos.lerp(target, alpha);
        
        // Face movement direction smoothly using shortest path
        const direction = target.clone().sub(pos).normalize();
        const targetRotation = Math.atan2(direction.x, direction.z);
        
        // Shortest path interpolation for rotation
        let diff = targetRotation - meshRef.current.rotation.y;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;
        meshRef.current.rotation.y += diff * (1 - Math.exp(-15 * safeDelta));
        
        // Physical bobbing (bounces on movement)
        visualY.current = pos.y + Math.abs(Math.sin(state.clock.elapsedTime * 14)) * 0.12;
      } else if (dist >= 200) {
        // Snap if too far (prevents disappearing on teleport)
        pos.copy(target);
        visualY.current = target.y;
      } else {
        // Return to resting height smoothly
        visualY.current = THREE.MathUtils.lerp(visualY.current, pos.y, 1 - Math.exp(-8 * safeDelta));
      }
    }

    if (!isNaN(pos.x) && isFinite(pos.x) && !isNaN(visualY.current)) {
      meshRef.current.position.set(pos.x, visualY.current, pos.z);
      meshRef.current.visible = true; // Ensure visibility
    } else {
      // Fallback to avoid complete disappearance
      meshRef.current.position.set(target.x, target.y, target.z);
    }
  });

  return (
    <group ref={meshRef}>
      {/* Body */}
      <mesh castShadow frustumCulled={false} position={[0, 0.6, 0]}>
        <boxGeometry args={[0.6, 0.8, 0.4]} />
        <meshStandardMaterial color="#3b82f6" roughness={0.7} />
      </mesh>
      
      {/* Head */}
      <mesh castShadow frustumCulled={false} position={[0, 1.2, 0]}>
        <boxGeometry args={[0.5, 0.5, 0.5]} />
        <meshStandardMaterial color="#fcd34d" roughness={0.7} />
      </mesh>
      
      {/* Eyes */}
      <mesh frustumCulled={false} position={[0.15, 1.25, 0.26]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>
      <mesh frustumCulled={false} position={[-0.15, 1.25, 0.26]}>
        <boxGeometry args={[0.1, 0.1, 0.05]} />
        <meshStandardMaterial color="black" />
      </mesh>

      {/* Backpack */}
      <mesh frustumCulled={false} position={[0, 0.6, -0.25]}>
        <boxGeometry args={[0.4, 0.5, 0.2]} />
        <meshStandardMaterial color="#1d4ed8" />
      </mesh>
    </group>
  );
});
