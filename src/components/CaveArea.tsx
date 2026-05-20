import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';

export function CaveArea({ onGroundClick }: { onGroundClick?: (x: number, y: number, z: number) => void }) {
  const width = 50;
  const depth = 59;
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const { voxels, totalCount } = useMemo(() => {
    const voxels: { pos: [number, number, number], type: 'rock' | 'floor' }[] = [];
    
    // Create a rocky room
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const posX = x - width / 2;
        const posZ = z - depth / 2;
        
        // Floor
        voxels.push({ pos: [posX, 0, posZ], type: 'floor' });
        
        // Walls - Random heights for rocky look
        const isWall = x === 0 || x === width - 1 || z === 0 || z === depth - 1;
        if (isWall) {
          const wallHeight = 5 + Math.floor(Math.random() * 5);
          for (let y = 1; y < wallHeight; y++) {
            voxels.push({ pos: [posX, y, posZ], type: 'rock' });
          }
        } else {
          // Pillars / random rocks inside
          const noise = Math.sin(x * 0.3) * Math.cos(z * 0.3);
          if (noise > 0.7) {
            const h = 2 + Math.floor(Math.random() * 4);
            for (let y = 1; y < h; y++) {
              voxels.push({ pos: [posX, y, posZ], type: 'rock' });
            }
          }
        }
      }
    }
    
    return { voxels, totalCount: voxels.length };
  }, []);

  useLayoutEffect(() => {
    if (!meshRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    
    voxels.forEach((v, i) => {
      dummy.position.set(v.pos[0], v.pos[1], v.pos[2]);
      dummy.updateMatrix();
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      
      const noise = (Math.random() - 0.5) * 0.1;
      if (v.type === 'floor') {
        color.setRGB(0.3 + noise, 0.25 + noise, 0.2 + noise);
      } else {
        const grey = 0.4 + noise;
        color.setRGB(grey, grey, grey);
      }
      meshRef.current!.setColorAt(i, color);
    });

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  }, [voxels]);

  return (
    <group>
      <ambientLight intensity={0.2} />
      <pointLight position={[0, 10, 0]} intensity={200} color="#ffccaa" distance={50} decay={2} />
      <pointLight position={[15, 5, 10]} intensity={150} color="#88ccff" distance={30} decay={2} />
      <pointLight position={[-15, 5, -15]} intensity={150} color="#cc88ff" distance={30} decay={2} />

      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, totalCount]} 
        castShadow 
        receiveShadow
        onPointerDown={(e) => {
          e.stopPropagation();
          if (onGroundClick && e.point) onGroundClick(e.point.x, e.point.y, e.point.z);
        }}
      >
        <boxGeometry args={[0.98, 1, 0.98]} />
        <meshStandardMaterial roughness={0.9} metalness={0.1} />
      </instancedMesh>
    </group>
  );
}
