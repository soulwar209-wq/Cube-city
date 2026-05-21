import { Unit, distance2D } from '../combat';

export function TacticalOverlay({
  activePlayer,
  enemies,
}: {
  activePlayer: Unit;
  enemies: Unit[];
}) {
  const cells = Array.from({ length: 11 * 11 }).map((_, i) => {
    const gx = (i % 11) - 5;
    const gz = Math.floor(i / 11) - 5;
    const x = activePlayer.position[0] + gx * 2;
    const z = activePlayer.position[2] + gz * 2;
    const d = Math.hypot(gx * 2, gz * 2);
    const inMove = d <= activePlayer.moveRange;
    const inAttack = d <= activePlayer.attackRange * 2;
    return { x, z, inMove, inAttack };
  });

  return (
    <group>
      {cells.map((c, i) => (
        <mesh key={i} position={[c.x, 0.06, c.z]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[1.8, 1.8]} />
          <meshBasicMaterial
            transparent
            opacity={c.inMove ? 0.18 : c.inAttack ? 0.1 : 0.02}
            color={c.inMove ? '#22d3ee' : c.inAttack ? '#f59e0b' : '#111827'}
          />
        </mesh>
      ))}

      {enemies.filter((e) => e.alive).map((e) => {
        const inThreat = distance2D(activePlayer.position, e.position) <= activePlayer.attackRange;
        return (
          <mesh key={e.id} position={[e.position[0], e.position[1] + 0.02, e.position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.9, 1.2, 24]} />
            <meshBasicMaterial color={inThreat ? '#ef4444' : '#facc15'} transparent opacity={0.7} />
          </mesh>
        );
      })}
    </group>
  );
}
