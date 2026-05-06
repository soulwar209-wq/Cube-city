import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useState, useCallback, useMemo } from 'react';
import { Island, getVoxelHeight } from './components/Island';
import { House } from './components/House';
import { Lighthouse } from './components/Lighthouse';
import { HouseInterior } from './components/HouseInterior';
import { Player } from './components/Player';
import { EffectComposer, Bloom, SSAO, SMAA, Vignette, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import * as THREE from 'three';

export default function App() {
  const controlsRef = useRef<any>(null);
  const [targetPos, setTargetPos] = useState<[number, number, number] | null>(null);
  const [inHouse, setInHouse] = useState(false);

  const handleIslandClick = useCallback((x: number, y: number, z: number) => {
    if (inHouse) {
      setTargetPos([x, y, z]);
    } else {
      const h = getVoxelHeight(x, z);
      setTargetPos([x, h, z]);
    }
  }, [inHouse]);
  const playerRef = useRef<THREE.Group>(null);
  const [canInteract, setCanInteract] = useState(false);
  const housePos = useMemo(() => [0, 0.5, 0] as [number, number, number], []);
  const islandPos = useMemo(() => [0, 3, 4] as [number, number, number], []);

  return (
    <div className="w-full h-screen bg-[#020202] overflow-hidden">
      {canInteract && (
        <button 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all font-mono"
          onClick={() => { setInHouse(!inHouse); setTargetPos(null); }}
        >
          {inHouse ? "EXIT HOUSE" : "ENTER HOUSE"}
        </button>
      )}
      <div className="w-full h-full relative">
        {/* UI Overlay */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none select-none">
          <h1 className="text-white text-3xl font-light tracking-[0.2em] opacity-80 mb-1 uppercase">Lumina Island</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-blue-400 text-[10px] font-mono tracking-widest opacity-60 uppercase">Click terrain to explore</p>
          </div>
        </div>
        <main className="w-full h-full relative flex items-center justify-center overflow-hidden z-0">
          <Canvas
            shadows
            dpr={2}
            gl={{ 
              antialias: false, 
              stencil: false, 
              depth: true,
              toneMapping: THREE.ACESFilmicToneMapping,
              toneMappingExposure: 1.0
            }}
            camera={{ position: [60, 45, 60], fov: 25 }}
            className="w-full h-full"
          >
            <Suspense fallback={null}>
                <GameController 
                  playerRef={playerRef} 
                  housePos={new THREE.Vector3(0, 3, 0)} 
                  inHouse={inHouse}
                  setCanInteract={setCanInteract} 
                />
                
                {inHouse ? (
                  <HouseInterior onGroundClick={handleIslandClick} />
                ) : (
                  <>
                    <Sky distance={450000} sunPosition={[100, 20, 100]} inclination={0.3} azimuth={0.25} turbidity={5} rayleigh={0.5} />
                    <Stars radius={150} depth={50} count={2000} factor={2} saturation={0} fade speed={1} />
                    
                    <ambientLight intensity={0.5} />
                    
                    <directionalLight
                      position={[100, 100, 100]}
                      intensity={1.5}
                      color="#ffffff" 
                      castShadow
                      shadow-mapSize={[2048, 2048]}
                    />
                    
                    <Island onGroundClick={handleIslandClick} />
                    <House position={[0, 3, 0]} />
                    <Lighthouse position={[15, 3, 15]} />
                    
                    {targetPos && (
                      <group position={[targetPos[0], targetPos[1] + 0.55, targetPos[2]]}>
                        <mesh rotation={[-Math.PI / 2, 0, 0]}>
                          <ringGeometry args={[0.4, 0.5, 32]} />
                          <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={5} transparent opacity={0.6} />
                        </mesh>
                        <pointLight color="#3b82f6" intensity={2} distance={3} />
                      </group>
                    )}
                    
                    <Environment preset="sunset" environmentIntensity={1.0} />
                  </>
                )}
                
                <Player key={inHouse ? 'house' : 'island'} ref={playerRef} position={inHouse ? housePos : islandPos} targetPosition={targetPos} yOffset={inHouse ? 0.3 : 0.5} />

              <EffectComposer multisampling={0} enableNormalPass={false}>
                <Bloom 
                  luminanceThreshold={0.8} 
                  intensity={0.3} 
                  radius={0.5} 
                />
                <BrightnessContrast brightness={0} contrast={0.05} />
                <Vignette darkness={0.2} offset={0.1} />
              </EffectComposer>
            </Suspense>
            
            <CameraControls 
              ref={controlsRef}
              makeDefault 
              minDistance={10}
              maxDistance={300}
              dollyToCursor={true}
              infinityDolly={true}
            />
          </Canvas>
        </main>
      </div>
    </div>
  );
}


function GameController({ playerRef, housePos, inHouse, setCanInteract }: any) {
  const tempPos = useMemo(() => new THREE.Vector3(), []);
  useFrame(() => {
    if (playerRef.current) {
      if (inHouse) {
        setCanInteract(true);
      } else {
        tempPos.copy(housePos);
        const dist = playerRef.current.position.distanceTo(tempPos);
        setCanInteract(dist < 5);
      }
    }
  });
  return null;
}
