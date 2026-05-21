import { useFrame } from '@react-three/fiber';
import { useMemo, useState } from 'react';

export interface HitFxEvent {
  id: string;
  position: [number, number, number];
  color?: string;
}

export function CombatVFX({ events }: { events: HitFxEvent[] }) {
  return (
    <group>
      {events.map((e) => (
        <HitBurst key={e.id} position={e.position} color={e.color ?? '#f97316'} />
      ))}
    </group>
  );
}

function HitBurst({ position, color }: { position: [number, number, number]; color: string }) {
  const [life, setLife] = useState(1);
  const particles = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => ({
      angle: (Math.PI * 2 * i) / 7,
      speed: 0.5 + (i % 3) * 0.25,
    })),
    [],
  );

  useFrame((_, delta) => {
    setLife((v) => Math.max(0, v - delta * 2.2));
  });

  if (life <= 0) return null;

  return (
    <group position={[position[0], position[1] + 0.8, position[2]]}>
      {particles.map((p, i) => {
        const r = (1 - life) * p.speed;
        return (
          <mesh key={i} position={[Math.cos(p.angle) * r, (1 - life) * 0.6, Math.sin(p.angle) * r]}>
            <sphereGeometry args={[0.08 * life + 0.03, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={life} />
          </mesh>
        );
      })}
    </group>
  );
}
