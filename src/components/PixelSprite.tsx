import { useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

interface PixelSpriteProps {
  pulse?: boolean;
  state?: 'idle' | 'walk' | 'attack';
  animated?: boolean;

  position: [number, number, number];
  palette?: {
    primary: string;
    secondary: string;
    accent: string;
  };
  scale?: number;
}

function makePixelTexture(primary: string, secondary: string, accent: string, frame: number, state: 'idle' | 'walk' | 'attack') {
  const size = 32;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;

  ctx.clearRect(0, 0, size, size);
  ctx.fillStyle = 'rgba(0,0,0,0)';
  ctx.fillRect(0, 0, size, size);

  const bob = state === 'walk' ? (frame % 4 <= 1 ? 0 : 1) : state === 'attack' ? (frame % 2) : 0;
  const armShift = state === 'attack' ? 2 : (frame % 4 === 1 ? 1 : frame % 4 === 3 ? -1 : 0);

  ctx.fillStyle = primary;
  ctx.fillRect(10, 12 - bob, 12, 14);
  ctx.fillStyle = secondary;
  ctx.fillRect(8 + armShift, 14 - bob, 16, 5);
  ctx.fillStyle = '#f2c48d';
  ctx.fillRect(11, 6 - bob, 10, 7);
  ctx.fillStyle = '#111827';
  ctx.fillRect(12, 8 - bob, 8, 2);
  ctx.fillStyle = accent;
  ctx.fillRect(22 + armShift, 12 - bob, 3, 12);

  const texture = new THREE.CanvasTexture(canvas);
  texture.magFilter = THREE.NearestFilter;
  texture.minFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function PixelSprite({ position, palette = { primary: '#1d4ed8', secondary: '#1e3a8a', accent: '#facc15' }, scale = 1.8, pulse = false, animated = true, state = 'idle' }: PixelSpriteProps) {
  const frameRef = useRef(0);
  const matRef = useRef<THREE.SpriteMaterial>(null);
  const map = useMemo(() => makePixelTexture(palette.primary, palette.secondary, palette.accent, 0, state), [palette.primary, palette.secondary, palette.accent, state]);

  useFrame((state) => {
    if (!animated || !matRef.current) return;
    const frame = Math.floor(state.clock.elapsedTime * 8) % 4;
    if (frame !== frameRef.current) {
      frameRef.current = frame;
      const next = makePixelTexture(palette.primary, palette.secondary, palette.accent, frame, state);
      matRef.current.map = next;
      matRef.current.needsUpdate = true;
    }
  });

  return (
    <sprite position={[position[0], position[1] + 1.0, position[2]]} scale={[pulse ? scale * 1.08 : scale, pulse ? scale * 1.08 : scale, 1]}>
      <spriteMaterial ref={matRef} map={map} transparent alphaTest={0.1} depthWrite={false} />
    </sprite>
  );
}
