import * as THREE from 'three';
import { memo } from 'react';

const VoxelBlock = memo(({ position, color = "#555", onClick }: { position: [number, number, number], color?: string, onClick?: () => void }) => {
  return (
    <mesh position={position} castShadow receiveShadow onClick={(e) => { e.stopPropagation(); onClick?.(); }}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={color} roughness={0.8} />
    </mesh>
  );
});

function Chair({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 0.5, 0]} castShadow><boxGeometry args={[0.8, 0.2, 0.8]} /><meshStandardMaterial color="#654321" /></mesh>
      <mesh position={[0, 1.1, -0.3]} castShadow><boxGeometry args={[0.8, 1, 0.2]} /><meshStandardMaterial color="#654321" /></mesh>
    </group>
  );
}

function Table({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 1.1, 0]} castShadow><boxGeometry args={[2, 0.2, 1.5]} /><meshStandardMaterial color="#8b4513" /></mesh>
      <mesh position={[0.7, 0.5, 0.5]} castShadow><boxGeometry args={[0.2, 1, 0.2]} /><meshStandardMaterial color="#444" /></mesh>
      <mesh position={[-0.7, 0.5, 0.5]} castShadow><boxGeometry args={[0.2, 1, 0.2]} /><meshStandardMaterial color="#444" /></mesh>
      <mesh position={[0.7, 0.5, -0.5]} castShadow><boxGeometry args={[0.2, 1, 0.2]} /><meshStandardMaterial color="#444" /></mesh>
      <mesh position={[-0.7, 0.5, -0.5]} castShadow><boxGeometry args={[0.2, 1, 0.2]} /><meshStandardMaterial color="#444" /></mesh>
    </group>
  );
}

export function HouseInterior({ onGroundClick }: { onGroundClick: (x: number, y: number, z: number) => void }) {
  const floors = [0, 5, 10]; // Y-levels
  
  return (
    <group position={[0, 0, 0]}>
      <ambientLight intensity={0.4} />
      <pointLight position={[0, 4, 0]} intensity={2} color="#ffeaa7" distance={10} />
      <pointLight position={[0, 9, 0]} intensity={2} color="#ffeaa7" distance={10} />
      <pointLight position={[0, 14, 0]} intensity={2} color="#ffeaa7" distance={10} />
      
      {/* Floors */}
      {floors.map((y, floorIdx) => (
        <group key={y}>
          {Array.from({ length: 10 * 10 }).map((_, i) => {
            const x = (i % 10) - 4.5;
            const z = Math.floor(i / 10) - 4.5;
            return <VoxelBlock key={i} position={[x, y, z]} onClick={() => onGroundClick(x, y, z)} color={floorIdx === 0 ? "#444" : floorIdx === 1 ? "#666" : "#888"} />;
          })}
          
          {/* Furniture per floor */}
          <Table position={[0, y, 0]} />
          <Chair position={[2, y, 0]} />
          <Chair position={[-2, y, 0]} />
        </group>
      ))}

      {/* Staircase (simple steps) */}
      {[0, 1, 2, 3, 4].map((step) => (
        <VoxelBlock key={`stair1-${step}`} position={[4.5, step + 0.5, 4.5 - step]} onClick={() => onGroundClick(4.5, step + 0.5, 4.5 - step)} color="#777" />
      ))}
      {[5, 6, 7, 8, 9].map((step) => (
        <VoxelBlock key={`stair2-${step}`} position={[4.5, step + 0.5, 4.5 - (step - 5)]} onClick={() => onGroundClick(4.5, step + 0.5, 4.5 - (step - 5))} color="#777" />
      ))}
    </group>
  );
}
