export type TurnSide = 'player' | 'enemy';

export interface Unit {
  id: string;
  side: TurnSide;
  name: string;
  hp: number;
  maxHp: number;
  ap: number;
  maxAp: number;
  atk: number;
  moveRange: number;
  attackRange: number;
  position: [number, number, number];
  alive: boolean;
  hasActed?: boolean;
}

export const distance2D = (a: [number, number, number], b: [number, number, number]) =>
  Math.hypot(a[0] - b[0], a[2] - b[2]);

export function canAttack(attacker: Unit, target: Unit) {
  return attacker.alive && target.alive && distance2D(attacker.position, target.position) <= attacker.attackRange;
}

export function calcDamage(attacker: Unit, target: Unit) {
  const variance = 0.85 + Math.random() * 0.3;
  return Math.max(1, Math.floor(attacker.atk * variance));
}
