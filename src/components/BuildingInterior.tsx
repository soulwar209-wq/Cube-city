import { CityBuilding } from '../worldData';

function serviceColor(type: CityBuilding['type']) {
  if (type === 'church') return '#93c5fd';
  if (type === 'tavern') return '#f59e0b';
  if (type === 'blacksmith') return '#ef4444';
  if (type === 'magic_shop') return '#a78bfa';
  if (type === 'army_hall') return '#94a3b8';
  if (type === 'adventurers_guild') return '#34d399';
  if (type === 'traders_guild') return '#fbbf24';
  if (type === 'inn') return '#22d3ee';
  if (type === 'castle') return '#e5e7eb';
  return '#9ca3af';
}

function serviceProps(type: CityBuilding['type']) {
  if (type === 'church') return ['altar', 'candles', 'healing_shrine'];
  if (type === 'tavern') return ['bar_counter', 'tables', 'quest_board'];
  if (type === 'blacksmith') return ['anvil', 'forge', 'weapon_rack'];
  if (type === 'magic_shop') return ['runes', 'potion_shelf', 'arcane_orb'];
  if (type === 'army_hall') return ['training_dummy', 'barracks_beds', 'armory'];
  if (type === 'adventurers_guild') return ['mission_board', 'maps', 'recruitment_desk'];
  if (type === 'traders_guild') return ['market_stall', 'storage_crates', 'trade_ledger'];
  if (type === 'inn') return ['beds', 'reception', 'guest_tables'];
  if (type === 'castle') return ['throne', 'war_room', 'royal_guard'];
  return ['decor'];
}

export function BuildingInterior({ building, onGroundClick }: { building: CityBuilding; onGroundClick?: (x:number,y:number,z:number)=>void }) {
  const floorCount = Math.min(building.type === 'castle' ? 9 : 6, building.floors);
  const accent = serviceColor(building.type);
  const props = serviceProps(building.type);

  return (
    <group>
      {Array.from({ length: floorCount }).map((_, floor) => {
        const y = floor * 2;
        return (
          <group key={floor}>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow onClick={(e)=>onGroundClick?.(e.point.x,e.point.y,e.point.z)}>
              <planeGeometry args={building.type === 'castle' ? [28, 28] : [22, 22]} />
              <meshStandardMaterial color={floor % 2 ? '#374151' : '#4b5563'} />
            </mesh>
            <mesh position={[0, y + 1, -11]}><boxGeometry args={[22,2,0.6]} /><meshStandardMaterial color="#1f2937"/></mesh>
            <mesh position={[0, y + 1, 11]}><boxGeometry args={[22,2,0.6]} /><meshStandardMaterial color="#1f2937"/></mesh>
            <mesh position={[-11, y + 1, 0]}><boxGeometry args={[0.6,2,22]} /><meshStandardMaterial color="#1f2937"/></mesh>
            <mesh position={[11, y + 1, 0]}><boxGeometry args={[0.6,2,22]} /><meshStandardMaterial color="#1f2937"/></mesh>

            <mesh position={[0, y + 1.2, -8]}>
              <boxGeometry args={[5, 0.5, 1]} />
              <meshStandardMaterial color={accent} emissive={accent} emissiveIntensity={0.35} />
            </mesh>
          </group>
        );
      })}

      {Array.from({ length: 10 }).map((_, i) => (
        <mesh key={`npc-${i}`} position={[-9 + (i % 5) * 4.5, 0.8, -3 + Math.floor(i / 5) * 7]} castShadow>
          <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
          <meshStandardMaterial color={[accent, '#22c55e', '#f59e0b', '#60a5fa'][i % 4]} />
        </mesh>
      ))}

      {props.map((p, i) => (
        <mesh key={p} position={[-7 + i * 7, 0.7, 6]} castShadow>
          <boxGeometry args={[2.2, 1.4, 1.2]} />
          <meshStandardMaterial color={i % 2 ? '#d1d5db' : accent} />
        </mesh>
      ))}
    </group>
  );
}
