import { Canvas, useFrame } from '@react-three/fiber';
import { CameraControls, Sky, Stars, Environment, ContactShadows } from '@react-three/drei';
import { Suspense, useRef, useState, useCallback, useMemo } from 'react';
import { Island, getVoxelHeight } from './components/Island';
import { House } from './components/House';
import { Lighthouse } from './components/Lighthouse';
import { DestroyedLighthouse } from './components/DestroyedLighthouse';
import { GiantHand } from './components/GiantHand';
import { HouseInterior } from './components/HouseInterior';
import { CaveArea } from './components/CaveArea';
import { Player } from './components/Player';
import { EffectComposer, Bloom, SSAO, SMAA, Vignette, BrightnessContrast, HueSaturation } from '@react-three/postprocessing';
import * as THREE from 'three';

const HOUSE_POS_VEC = new THREE.Vector3(0, 3, 0);
const LAKE_POS_VEC = new THREE.Vector3(-10, -3, 10);
const LIGHTHOUSE_POS_VEC = new THREE.Vector3(15, 3, 15);

export default function App() {
  const controlsRef = useRef<any>(null);
  const [targetPos, setTargetPos] = useState<[number, number, number] | null>(null);
  const [inHouse, setInHouse] = useState(false);
  const [inCave, setInCave] = useState(false);
  const [isLighthouseDestroyed, setIsLighthouseDestroyed] = useState(false);
  const [isHandEventActive, setIsHandEventActive] = useState(false);

  const handleIslandClick = useCallback((x: number, y: number, z: number) => {
    if (inHouse || inCave) {
      setTargetPos([x, y, z]);
    } else {
      const h = getVoxelHeight(x, z);
      setTargetPos([x, h, z]);
    }
  }, [inHouse, inCave]);
  const playerRef = useRef<THREE.Group>(null);
  const [interactType, setInteractType] = useState<'house' | 'cave' | null>(null);
  const housePos = useMemo(() => [0, 0.5, 0] as [number, number, number], []);
  const islandPos = useMemo(() => [0, 3, 4] as [number, number, number], []);
  const cavePos = useMemo(() => [0, 0.5, 0] as [number, number, number], []);

  const toggleHouse = () => {
    setInHouse(!inHouse);
    setTargetPos(null);
  };

  const toggleCave = () => {
    setInCave(!inCave);
    setTargetPos(null);
  };

  return (
    <div className="w-full h-screen bg-[#020202] overflow-hidden">
      {interactType === 'house' && (
        <button 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-white/10 backdrop-blur-md text-white px-6 py-3 rounded-full border border-white/20 hover:bg-white/20 transition-all font-mono uppercase tracking-widest"
          onClick={toggleHouse}
        >
          {inHouse ? "EXIT HOUSE" : "ENTER HOUSE"}
        </button>
      )}

      {interactType === 'cave' && (
        <button 
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20 bg-blue-500/20 backdrop-blur-md text-white px-6 py-3 rounded-full border border-blue-400/30 hover:bg-blue-500/40 transition-all font-mono uppercase tracking-widest"
          onClick={toggleCave}
        >
          {inCave ? "LEAVE CAVE" : "ENTER CAVE"}
        </button>
      )}
      <div className="w-full h-full relative">
        {/* UI Overlay */}
        <div className="absolute top-8 left-8 z-10 pointer-events-none select-none">
          <h1 className="text-white text-3xl font-light tracking-[0.2em] opacity-80 mb-1 uppercase">Lumina Island</h1>
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            <p className="text-blue-400 text-[10px] font-mono tracking-widest opacity-60 uppercase">
              {inHouse ? "Exploring House" : inCave ? "Deep in Cave" : "Exploring Lumina"}
            </p>
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
                  housePos={HOUSE_POS_VEC}
                  lakePos={LAKE_POS_VEC}
                  lighthousePos={LIGHTHOUSE_POS_VEC}
                  inHouse={inHouse}
                  inCave={inCave}
                  setInteractType={setInteractType}
                  isLighthouseDestroyed={isLighthouseDestroyed}
                  isHandEventActive={isHandEventActive}
                  setIsHandEventActive={setIsHandEventActive}
                />
                
                {inHouse ? (
                  <HouseInterior onGroundClick={handleIslandClick} />
                ) : inCave ? (
                  <CaveArea onGroundClick={handleIslandClick} />
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

                    {isLighthouseDestroyed ? (
                      <DestroyedLighthouse position={[15, 3, 15]} />
                    ) : (
                      <Lighthouse position={[15, 3, 15]} />
                    )}

                    <GiantHand
                      active={isHandEventActive}
                      onGrab={() => setIsLighthouseDestroyed(true)}
                    />
                    
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
                
                <Player 
                  key={inHouse ? 'house' : inCave ? 'cave' : 'island'} 
                  ref={playerRef} 
                  position={inHouse ? housePos : inCave ? cavePos : islandPos} 
                  targetPosition={targetPos} 
                  yOffset={inHouse ? 0.3 : inCave ? 0.3 : 0.5} 
                />

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


interface GameControllerProps {
  playerRef: React.RefObject<THREE.Group | null>;
  housePos: THREE.Vector3;
  lakePos: THREE.Vector3;
  lighthousePos: THREE.Vector3;
  inHouse: boolean;
  inCave: boolean;
  setInteractType: (type: 'house' | 'cave' | null) => void;
  isLighthouseDestroyed: boolean;
  isHandEventActive: boolean;
  setIsHandEventActive: (active: boolean) => void;
}

function GameController({
  playerRef,
  housePos,
  lakePos,
  lighthousePos,
  inHouse,
  inCave,
  setInteractType,
  isLighthouseDestroyed,
  isHandEventActive,
  setIsHandEventActive
}: GameControllerProps) {
  useFrame(() => {
    if (playerRef.current) {
      if (inHouse) {
        setInteractType('house');
      } else if (inCave) {
        setInteractType('cave');
      } else {
        // Check distance to house
        const distHouse = playerRef.current.position.distanceTo(housePos);
        
        // Check distance to lake
        const distLake = playerRef.current.position.distanceTo(lakePos);

        // Check distance to lighthouse for the event
        const distLighthouse = playerRef.current.position.distanceTo(lighthousePos);

        if (distLighthouse < 8 && !isLighthouseDestroyed && !isHandEventActive) {
          setIsHandEventActive(true);
        }

        if (distHouse < 5) {
          setInteractType('house');
        } else if (distLake < 6) {
          setInteractType('cave');
        } else {
          setInteractType(null);
        }
      }
    }
  });
  return null;
}
