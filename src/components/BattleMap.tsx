type BattleBiome = 'temperate' | 'snow' | 'desert' | 'forest' | 'volcanic';

function biomePalette(biome: BattleBiome) {
  if (biome === 'snow') return { top: '#dbeafe', side: '#94a3b8', water: '#67e8f9', wood: '#7c5a3a' };
  if (biome === 'desert') return { top: '#fcd34d', side: '#b45309', water: '#38bdf8', wood: '#8b5e34' };
  if (biome === 'forest') return { top: '#86efac', side: '#3f6212', water: '#22d3ee', wood: '#6b4f35' };
  if (biome === 'volcanic') return { top: '#a1a1aa', side: '#3f3f46', water: '#fb7185', wood: '#7f1d1d' };
  return { top: '#bbf7d0', side: '#475569', water: '#38bdf8', wood: '#7c5a3a' };
}

export function BattleMap({ onGroundClick, biome = 'temperate', obstacleSeed = 1, heightSeed = 1 }: { onGroundClick?: (x: number, y: number, z: number) => void; biome?: BattleBiome; obstacleSeed?: number; heightSeed?: number }) {
  const palette = biomePalette(biome);

  const tiles = Array.from({ length: 9 * 9 }).map((_, i) => {
    const gx = (i % 9) - 4;
    const gz = Math.floor(i / 9) - 4;
    const n = Math.sin((gx * 13 + gz * 17 + heightSeed) * 0.21);
    const h = Math.max(0, Math.floor((n + 1.2) * 1.5));
    return { gx, gz, h };
  });

  const props = Array.from({ length: 18 }).map((_, i) => {
    const nx = Math.sin((i + obstacleSeed) * 1.37);
    const nz = Math.cos((i + obstacleSeed) * 1.11);
    const x = Math.round(nx * 13);
    const z = Math.round(nz * 13);
    return { x, z, h: 0.5 + Math.abs(Math.sin((i + heightSeed) * 0.7)) * 1.4 };
  });

  return (
    <group>
      {/* water basin */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.65, 0]} receiveShadow>
        <planeGeometry args={[44, 44, 1, 1]} />
        <meshStandardMaterial color={palette.water} transparent opacity={0.8} />
      </mesh>

      {tiles.map((t, i) => {
        const x = t.gx * 4.5;
        const z = t.gz * 4.5;
        const y = t.h * 1.3;
        return (
          <group key={i}>
            <mesh
              position={[x, y, z]}
              castShadow
              receiveShadow
              onClick={(e) => onGroundClick?.(e.point.x, e.point.y, e.point.z)}
            >
              <boxGeometry args={[4.3, 1.2, 4.3]} />
              <meshStandardMaterial color={palette.top} />
            </mesh>
            {/* cliff body */}
            {t.h > 0 && (
              <mesh position={[x, y - (t.h * 0.65) - 0.1, z]} castShadow receiveShadow>
                <boxGeometry args={[4.3, t.h * 1.3, 4.3]} />
                <meshStandardMaterial color={palette.side} />
              </mesh>
            )}
          </group>
        );
      })}

      {props.map((p, i) => (
        <mesh key={i} position={[p.x, p.h, p.z]} castShadow receiveShadow>
          <boxGeometry args={[1.4, p.h, 1.4]} />
          <meshStandardMaterial color={i % 2 ? palette.wood : palette.side} />
        </mesh>
      ))}

      {/* terrain decals */}
      {tiles.filter((_, i) => i % 3 === 0).map((t, i) => (
        <mesh key={`decal-${i}`} position={[t.gx * 4.5 + 0.7, t.h * 1.3 + 0.62, t.gz * 4.5 - 0.6]} rotation={[-Math.PI/2, 0, Math.PI/8]}>
          <planeGeometry args={[1.2, 0.6]} />
          <meshBasicMaterial color={i % 2 ? '#3f3f46' : '#6b7280'} transparent opacity={0.22} />
        </mesh>
      ))}

      {/* torches */}
      {[-1,1].map((sx)=>[-1,1].map((sz)=> (
        <group key={`torch-${sx}-${sz}`} position={[sx * 17, 0.6, sz * 17]}>
          <mesh castShadow><cylinderGeometry args={[0.15,0.18,1.4,6]} /><meshStandardMaterial color='#5b4636' /></mesh>
          <pointLight color='#f59e0b' intensity={1.2} distance={8} />
          <mesh position={[0,0.9,0]}><sphereGeometry args={[0.16,8,8]} /><meshStandardMaterial color='#fb923c' emissive='#fb923c' emissiveIntensity={1.4} /></mesh>
        </group>
      )))}

      {/* simple bridges */}
      <mesh position={[0, 0.2, -16]} castShadow receiveShadow>
        <boxGeometry args={[10, 0.6, 2]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
      <mesh position={[-16, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.6, 10]} />
        <meshStandardMaterial color={palette.wood} />
      </mesh>
    </group>
  );
}
