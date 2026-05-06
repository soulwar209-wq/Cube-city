import { useRef, useLayoutEffect, useMemo } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';

export function getVoxelHeight(x: number, z: number) {
  // Flatten foundation for structures
  if (Math.abs(x) < 4 && Math.abs(z) < 3) return 2;
  if (Math.abs(x - 15) < 3 && Math.abs(z - 15) < 3) return 2;

  const distToLake = Math.sqrt(Math.pow(x + 10, 2) + Math.pow(z - 10, 2));
  const distFromCenter = Math.sqrt(x * x + z * z);
  
  const nx = x * 0.08;
  const nz = z * 0.08;
  let noise = (Math.sin(nx) + Math.sin(nz) + Math.cos(nx * 0.5 + nz * 0.3)) * 1.8;
  
  // Taper height towards edges but keep it an island
  const falloff = Math.max(0, 1 - Math.pow(distFromCenter / 50, 3));
  let h = (noise + 1.5) * falloff - 1.2;

  // Apply lake depression
  if (distToLake < 5.5) {
    h = -3; // Lake depth
  } else if (distToLake < 7.8) {
    h = -1; // Lake shore / shelf
  }

  return Math.floor(h);
}

function Tree({ position }: { position: [number, number, number] }) {
  const type = useMemo(() => Math.random(), []);
  return (
    <group position={position}>
      {/* Trunk */}
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.4, 2, 0.4]} />
        <meshStandardMaterial color="#3e2723" roughness={0.9} />
      </mesh>
      {/* Leaves - Voxel Style */}
      {type > 0.5 ? (
        <group position={[0, 2.5, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.8, 1.8, 1.8]} />
            <meshStandardMaterial color="#1b5e20" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1.2, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.2, 1.2, 1.2]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.8} />
          </mesh>
        </group>
      ) : (
        <group position={[0, 2.5, 0]}>
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[1.5, 1.5, 1.5]} />
            <meshStandardMaterial color="#2e7d32" roughness={0.8} />
          </mesh>
          <mesh position={[0, 1, 0]} castShadow receiveShadow>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#388e3c" roughness={0.8} />
          </mesh>
        </group>
      )}
    </group>
  );
}

function Rock({ position, scale }: { position: [number, number, number], scale: [number, number, number] }) {
  return (
    <mesh position={position} scale={scale} castShadow receiveShadow>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#757575" roughness={0.8} metalness={0.1} />
    </mesh>
  );
}

function Flower({ position, color }: { position: [number, number, number], color: string }) {
  const petals = useMemo(() => [
    { pos: [0.12, 0, 0] as [number, number, number], rot: 0 },
    { pos: [-0.12, 0, 0] as [number, number, number], rot: 0 },
    { pos: [0, 0, 0.12] as [number, number, number], rot: Math.PI / 2 },
    { pos: [0, 0, -0.12] as [number, number, number], rot: Math.PI / 2 },
  ], []);

  return (
    <group position={position}>
      {/* Stem */}
      <mesh position={[0, 0.15, 0]}>
        <boxGeometry args={[0.05, 0.3, 0.05]} />
        <meshStandardMaterial color="#2e7d32" />
      </mesh>
      {/* Flower Head */}
      <group position={[0, 0.35, 0]}>
        {/* Center */}
        <mesh>
          <boxGeometry args={[0.12, 0.12, 0.12]} />
          <meshStandardMaterial color="#ffca28" emissive="#ffca28" emissiveIntensity={1} />
        </mesh>
        {/* Petals */}
        {petals.map((p, i) => (
          <mesh key={i} position={p.pos} rotation={[0, p.rot, 0]}>
            <boxGeometry args={[0.2, 0.08, 0.2]} />
            <meshStandardMaterial color={color} emissive={color} emissiveIntensity={2} />
          </mesh>
        ))}
      </group>
      <Sparkles count={2} scale={0.4} size={0.6} speed={0.3} color={color} />
    </group>
  );
}

export function Island({ onGroundClick }: { onGroundClick?: (x: number, y: number, z: number) => void }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const grassRef = useRef<THREE.InstancedMesh>(null);
  
  const size = 100;
  const offset = size / 2;
  const waterLevel = 0; // Surface level

  useFrame((state) => {
    if (!grassRef.current) return;
    const time = state.clock.getElapsedTime();
    const dummy = new THREE.Object3D();
    
    features.grass.forEach((g, i) => {
      const timeOffset = g.pos[0] * 0.5 + g.pos[2] * 0.5;
      const sway = Math.sin(time * 1.2 + timeOffset) * 0.05; // Subtle sway
      
      for (let j = 0; j < 3; j++) {
        const idx = i * 3 + j;
        const offset = [[0.08, 0, 0], [-0.05, 0, 0.06], [-0.03, 0, -0.05]][j];
        const hScale = g.scale * (0.7 + j * 0.15);
        
        dummy.position.set(
          g.pos[0] + offset[0],
          g.pos[1] + hScale / 2,
          g.pos[2] + offset[2]
        );
        
        // Purely vertical or slightly swayed
        dummy.rotation.set(sway, g.rot + j, 0);
        dummy.scale.set(0.04, hScale, 0.04); // Even thinner vertical lines
        dummy.updateMatrix();
        grassRef.current!.setMatrixAt(idx, dummy.matrix);
      }
    });
    grassRef.current.instanceMatrix.needsUpdate = true;
  });

  const { grid, totalCount, features } = useMemo(() => {
    const grid: number[][] = [];
    for (let x = 0; x < size; x++) {
      grid[x] = [];
      for (let z = 0; z < size; z++) {
        grid[x][z] = getVoxelHeight(x - offset, z - offset);
      }
    }

    let groundCount = 0;
    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const h = grid[x][z];
        // Ground voxels
        for (let y = -4; y <= h; y++) {
          const isAtBound = x === 0 || x === size - 1 || z === 0 || z === size - 1 || y === -4 || y === h;
          if (isAtBound) {
            groundCount++;
          } else {
            const neighborsClosed = grid[x+1][z] >= y && grid[x-1][z] >= y && 
                                    grid[x][z+1] >= y && grid[x][z-1] >= y &&
                                    y < grid[x][z];
            if (!neighborsClosed) groundCount++;
          }
        }
      }
    }

    const trees: [number, number, number][] = [];
    const rocks: { pos: [number, number, number], scale: [number, number, number] }[] = [];
    const flowers: { pos: [number, number, number], color: string }[] = [];
    const grass: { pos: [number, number, number], scale: number, rot: number }[] = [];
    
    const flowerColors = ['#ff5252', '#ff4081', '#e040fb', '#7c4dff', '#ffff00'];

    for (let x = 5; x < size - 5; x++) {
      for (let z = 5; z < size - 5; z++) {
        const h = grid[x][z];
        const posX = x - offset;
        const posZ = z - offset;

        const dist = Math.sqrt(posX * posX + posZ * posZ);
        if (dist > 48) continue;

        const rf = Math.random();
        const jX = (Math.random() - 0.5) * 0.7;
        const jZ = (Math.random() - 0.5) * 0.7;

        // Tree/Rock/Flower exclusions (on high land and not in central spots)
        const isHighLand = h >= 2;
        const isExcludedZone = (Math.abs(posX) < 8 && Math.abs(posZ) < 8) || (Math.abs(posX - 15) < 8 && Math.abs(posZ - 15) < 8);

        if (isHighLand && !isExcludedZone) {
          if (rf < 0.005) {
            trees.push([posX + jX, h + 0.5, posZ + jZ]);
          } else if (rf < 0.008) {
            const s = 0.5 + Math.random() * 0.9;
            rocks.push({ pos: [posX + jX, h + 0.5 * s + 0.5, posZ + jZ], scale: [s, s, s] });
          }
        }

        // Flowers spread across the island where h >= 0
        if (h >= 0 && rf >= 0.008 && rf < 0.04) {
          flowers.push({ 
            pos: [posX + jX, h + 0.5, posZ + jZ], 
            color: flowerColors[Math.floor(Math.random() * flowerColors.length)] 
          });
        }

        // Grass everywhere on the island surface (h >= 0)
        if (h >= 0) {
          const density = 3; // Reduced density
          for (let d = 0; d < density; d++) {
            if (Math.random() > 0.3) {
              grass.push({ 
                pos: [posX + (Math.random() - 0.5) * 0.9, h + 0.5, posZ + (Math.random() - 0.5) * 0.9],
                scale: 0.3 + Math.random() * 0.4, // Slightly larger
                rot: Math.random() * Math.PI
              });
            }
          }
        }
      }
    }

    return { grid, totalCount: groundCount, features: { trees, rocks, flowers, grass } };
  }, [size, offset]);

  useLayoutEffect(() => {
    if (!meshRef.current || !grassRef.current) return;

    const dummy = new THREE.Object3D();
    const color = new THREE.Color();
    let idx = 0;

    for (let x = 0; x < size; x++) {
      for (let z = 0; z < size; z++) {
        const h = grid[x][z];
        const posX = x - offset;
        const posZ = z - offset;
        const dist = Math.sqrt(posX * posX + posZ * posZ);
        const distL = Math.sqrt((posX + 10) ** 2 + (posZ - 10) ** 2);

        // Ground voxels
        for (let y = -4; y <= h; y++) {
          const isAtBound = x === 0 || x === size - 1 || z === 0 || z === size - 1 || y === -4 || y === h;
          let visible = isAtBound;
          if (!visible) {
            visible = !(grid[x+1][z] >= y && grid[x-1][z] >= y && grid[x][z+1] >= y && grid[x][z-1] >= y && y < grid[x][z]);
          }

          if (visible) {
            dummy.position.set(posX, y, posZ);
            dummy.scale.set(1, 1, 1);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(idx++, dummy.matrix);

            const isBeach = (dist > 40 || (distL > 5.5 && distL < 8.8)) && y === h;
            const isRockBottom = h < 0 && y === h;
            const isTop = y === h && !isBeach && !isRockBottom;
            const noise = (Math.random() - 0.5) * 0.06;

            if (isRockBottom) {
              const g = 0.35 + noise;
              color.setRGB(g, g, g + 0.05);
            } else if (isBeach) {
              color.setRGB(1.0, 0.9 + noise, 0.4);
            } else if (isTop) {
              const intensity = 0.1 + y * 0.05 + noise;
              color.setRGB(0.12 + intensity, 0.55 + intensity, 0.1);
            } else {
              color.setRGB(0.4 + noise, 0.3 + noise, 0.2 + noise);
            }

            if (y < h) {
              const depthFactor = (y + 4) / (h + 4.1);
              color.multiplyScalar(0.55 + depthFactor * 0.4);
            }
            
            meshRef.current.setColorAt(idx - 1, color);
          }
        }
      }
    }

    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;

    features.grass.forEach((g, i) => {
      for (let j = 0; j < 3; j++) {
        const idx = i * 3 + j;
        const offset = [[0.08, 0, 0], [-0.05, 0, 0.06], [-0.03, 0, -0.05]][j];
        const hScale = g.scale * (0.7 + j * 0.15);
        
        dummy.position.set(
          g.pos[0] + offset[0],
          g.pos[1] + hScale / 2,
          g.pos[2] + offset[2]
        );
        
        dummy.rotation.set(0, g.rot + j, 0);
        dummy.scale.set(0.04, hScale, 0.04);
        dummy.updateMatrix();
        grassRef.current!.setMatrixAt(idx, dummy.matrix);

        color.set(['#388e3c', '#43a047', '#2e7d32', '#689f38'][Math.floor(Math.random() * 4)]);
        grassRef.current!.setColorAt(idx, color);
      }
    });
    grassRef.current.instanceMatrix.needsUpdate = true;
    if (grassRef.current.instanceColor) grassRef.current.instanceColor.needsUpdate = true;

  }, [grid, size, offset, features.grass]);

  return (
    <group>
      {/* Seamless Clean Water Plane Surface */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
        <planeGeometry args={[2000, 2000]} />
        <meshPhysicalMaterial 
          color="#003366" 
          transparent 
          opacity={0.8} 
          transmission={0.2}
          thickness={1.5}
          roughness={0.1}
          metalness={0.2}
          reflectivity={0.8}
        />
      </mesh>

      <instancedMesh 
        ref={meshRef} 
        args={[undefined, undefined, totalCount]} 
        castShadow 
        receiveShadow 
        onPointerDown={(e) => { 
          e.stopPropagation(); 
          if (onGroundClick && e.point) onGroundClick(e.point.x, e.point.y, e.point.z); 
        }} 
        onPointerOver={() => (document.body.style.cursor = 'pointer')} 
        onPointerOut={() => (document.body.style.cursor = 'auto')}
      >
        <boxGeometry args={[0.98, 1, 0.98]} />
        <meshStandardMaterial roughness={0.7} metalness={0.1} />
      </instancedMesh>

      <instancedMesh ref={grassRef} args={[undefined, undefined, features.grass.length * 3]} castShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial roughness={0.8} metalness={0.0} />
      </instancedMesh>

      <Sparkles count={80} scale={offset * 1.8} size={2} speed={0.4} opacity={0.15} color="#e3f2fd" position={[0, 8, 0]} />

      {features.trees.map((p, i) => <Tree key={`t-${i}`} position={p} />)}
      {features.rocks.map((r, i) => <Rock key={`r-${i}`} position={r.pos} scale={r.scale} />)}
      {features.flowers.map((f, i) => <Flower key={`f-${i}`} position={f.pos} color={f.color} />)}
    </group>
  );
}

