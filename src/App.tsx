import { Canvas } from '@react-three/fiber';
import { CameraControls, Sky, Stars } from '@react-three/drei';
import { Suspense, useEffect, useMemo, useState } from 'react';
import { Island, getVoxelHeight } from './components/Island';
import { House } from './components/House';
import { Lighthouse } from './components/Lighthouse';
import { Player } from './components/Player';
import { PixelSprite } from './components/PixelSprite';
import { BattleMap } from './components/BattleMap';
import * as THREE from 'three';
import { Unit, TurnSide, canAttack, calcDamage, distance2D } from './combat';
import { battleLayouts, cityBuildings } from './worldData';
import { BuildingInterior } from './components/BuildingInterior';
import { TacticalOverlay } from './components/TacticalOverlay';
import { CombatVFX, HitFxEvent } from './components/CombatVFX';

const PLAYER_ID = 'hero';
type GameMode = 'explore' | 'battle' | 'interior';

export default function App() {
  const [mode, setMode] = useState<GameMode>('explore');
  const [targetPos, setTargetPos] = useState<[number, number, number] | null>(null);
  const [turnSide, setTurnSide] = useState<TurnSide>('player');
  const [turnNumber, setTurnNumber] = useState(1);
  const [selectedEnemyId, setSelectedEnemyId] = useState<string | null>(null);
  const [log, setLog] = useState<string[]>([]);
  const [battleState, setBattleState] = useState<'ongoing'|'victory'|'defeat'>('ongoing');
  const [wildThreat, setWildThreat] = useState(0);
  const [activeBuildingId, setActiveBuildingId] = useState<string | null>(null);
  const activeBuilding = cityBuildings.find((b) => b.id === activeBuildingId) || null;
  const [activeBattleLayout, setActiveBattleLayout] = useState(battleLayouts[0]);
  const [hitFx, setHitFx] = useState<HitFxEvent[]>([]);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(PLAYER_ID);
  const [units, setUnits] = useState<Unit[]>([
    { id: PLAYER_ID, side: 'player', name: 'Knight', hp: 120, maxHp: 120, ap: 5, maxAp: 5, atk: 22, moveRange: 6, attackRange: 2.2, position: [0, 3, 4], alive: true, hasActed: false },
    { id: 'player-2', side: 'player', name: 'Mage', hp: 80, maxHp: 80, ap: 5, maxAp: 5, atk: 26, moveRange: 5, attackRange: 5.5, position: [-2, 3, 4], alive: true, hasActed: false },
    { id: 'player-3', side: 'player', name: 'Archer', hp: 90, maxHp: 90, ap: 5, maxAp: 5, atk: 20, moveRange: 6, attackRange: 6.5, position: [2, 3, 4], alive: true, hasActed: false },
    { id: 'enemy-1', side: 'enemy', name: 'Dark Archer', hp: 75, maxHp: 75, ap: 5, maxAp: 5, atk: 14, moveRange: 5, attackRange: 7, position: [10, 3.5, -4], alive: true },
    { id: 'enemy-2', side: 'enemy', name: 'Spear Raider', hp: 95, maxHp: 95, ap: 5, maxAp: 5, atk: 18, moveRange: 5, attackRange: 3, position: [5, 3.5, 9], alive: true },
  ]);

  const hero = units.find((u) => u.id === PLAYER_ID)!;
  const players = units.filter((u) => u.side === 'player' && u.alive);
  const activePlayer = units.find((u) => u.id === selectedPlayerId && u.side === 'player' && u.alive) || hero;
  const enemies = units.filter((u) => u.side === 'enemy');

  const explorationBiome = useMemo(() => {
    const [x,,z] = hero.position;
    if (x < -120) return 'snow' as const;
    if (x > 120) return 'desert' as const;
    if (z > 120) return 'forest' as const;
    if (z < -120) return 'volcanic' as const;
    return 'temperate' as const;
  }, [hero.position]);


  useEffect(() => {
    if (mode !== 'explore') return;
    const id = setInterval(() => {
      const [x,,z] = hero.position;
      const dangerZone = Math.abs(x) > 120 || Math.abs(z) > 120;
      if (!dangerZone) return;
      if (Math.random() < 0.35) {
        const dmg = 4 + Math.floor(Math.random() * 8);
        setUnits((prev) => prev.map((u) => u.id === PLAYER_ID ? { ...u, hp: Math.max(1, u.hp - dmg) } : u));
        setWildThreat((v) => Math.min(100, v + 8));
        appendLog(`Wild predator attacked hero for ${dmg}`);
      }
    }, 2200);
    return () => clearInterval(id);
  }, [mode, hero.position]);
  const appendLog = (m: string) => setLog((l) => [m, ...l].slice(0, 8));
  const addHitFx = (position: [number, number, number], color = '#f97316') => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    setHitFx((fx) => [...fx, { id, position, color }]);
    setTimeout(() => setHitFx((fx) => fx.filter((f) => f.id !== id)), 500);
  }; 

  const startBattle = () => {
    const candidates = battleLayouts.filter((b) => b.biome === explorationBiome);
    setActiveBattleLayout(candidates[Math.floor(Math.random() * candidates.length)] || battleLayouts[0]);
    setMode('battle');
    setBattleState('ongoing');
    setTurnSide('player');
    setTurnNumber(1);
    setUnits((prev) => prev.map((u) => u.side === 'enemy'
      ? { ...u, hp: u.maxHp, ap: u.maxAp, alive: true, position: [Math.random() * 8 - 4, 0.5, Math.random() * 8 - 4] }
      : { ...u, ap: u.maxAp, hasActed: false, position: [u.id===PLAYER_ID?0:u.id==='player-2'?-2:2, 0.5, 6] }
    ));
    appendLog(`Entered ${explorationBiome} battle map`);
  };

  const endBattleAndReturn = () => {
    setMode('explore');
    setTargetPos([hero.position[0], getVoxelHeight(hero.position[0], hero.position[2]), hero.position[2]]);
    appendLog('Returned to exploration map');
  };

  const handleExploreClick = (x: number, _y: number, z: number) => {
    const h = getVoxelHeight(x, z);
    setTargetPos([x, h, z]);
  };

  const handleBattleClick = (x:number,y:number,z:number)=>{
    if (turnSide !== 'player' || activePlayer.ap <= 0 || activePlayer.hasActed || battleState !== 'ongoing') return;
    const dst:[number,number,number] = [x, y + 0.5, z];
    if (distance2D(activePlayer.position, dst) > activePlayer.moveRange + 2) return;
    setTargetPos(dst);
    setUnits((prev)=>prev.map(u=>u.id===activePlayer.id?{...u, position:dst, ap:Math.max(0,u.ap-1), hasActed:true}:u));
  };

  const evaluateBattleState = (nextUnits: Unit[]) => {
    const playerAlive = nextUnits.some((u) => u.id === PLAYER_ID && u.alive);
    const enemiesAlive = nextUnits.some((u) => u.side === 'enemy' && u.alive);
    if (!playerAlive) setBattleState('defeat');
    else if (!enemiesAlive) setBattleState('victory');
  };

  const attack = () => {
    if (mode !== 'battle' || turnSide !== 'player' || !selectedEnemyId || activePlayer.hasActed) return;
    const t = units.find((u) => u.id === selectedEnemyId);
    const a = activePlayer;
    if (!t || a.ap < 2 || !canAttack(a, t)) return;
    const dmg = calcDamage(a, t);
    const next = units.map((u) => u.id === t.id ? { ...u, hp: Math.max(0, u.hp - dmg), alive: Math.max(0, u.hp - dmg) > 0 } : u.id === a.id ? { ...u, ap: Math.max(0, u.ap - 2), hasActed: true } : u);
    setUnits(next);
    appendLog(`Hit ${t.name} for ${dmg}`);
    addHitFx(t.position, '#fb7185');
    evaluateBattleState(next);
  };

  const endTurn = () => {
    if (mode !== 'battle' || turnSide !== 'player') return;
    setTurnSide('enemy');
    let next = [...units];
    const p = next.find((u) => u.id === PLAYER_ID)!;
    for (const e of next.filter((u) => u.side === 'enemy' && u.alive)) {
      if (distance2D(e.position, p.position) <= e.attackRange) {
        const dmg = calcDamage(e, p);
        p.hp = Math.max(0, p.hp - dmg);
        addHitFx(p.position, '#f59e0b');
        p.alive = p.hp > 0;
      }
    }
    next = next.map((u) => ({ ...u }));
    setUnits(next);
    evaluateBattleState(next);
    setTimeout(() => {
      setTurnSide('player');
      setTurnNumber((n) => n + 1);
      setUnits((prev) => prev.map((u) => ({ ...u, ap: u.maxAp, hasActed: u.side==='player' ? false : u.hasActed })));
    }, 250);
  };


  const spriteStateForPlayer = (id: string): 'idle' | 'walk' | 'attack' => {
    const u = units.find((x) => x.id === id);
    if (!u) return 'idle';
    if (mode === 'battle' && selectedPlayerId === id && !u.hasActed) return 'walk';
    if (mode === 'battle' && selectedPlayerId === id && u.hasActed) return 'attack';
    return 'idle';
  };
  const inBattle = mode === 'battle';

  return <div className="w-full h-screen bg-[#020202] overflow-hidden">
    <div className="absolute top-4 left-4 z-30 bg-black/60 text-white p-3 rounded text-xs font-mono">
      <div>MODE: {mode.toUpperCase()}</div><div>EXPLORE BIOME: {explorationBiome.toUpperCase()}</div><div>WILD THREAT: {wildThreat}</div><div>BATTLE LAYOUT: {activeBattleLayout.id}</div>
      {mode !== 'battle' ? <><button className="mt-2 px-2 py-1 rounded bg-red-700" onClick={startBattle}>Encounter Enemy (Start Battle)</button>
      {!inBattle && <div className="mt-2 max-h-40 overflow-auto">{cityBuildings.map((b)=><button key={b.id} onClick={()=>{setActiveBuildingId(b.id); setMode('interior');}} className="block w-full text-left px-2 py-1 rounded bg-white/10 my-1">Enter {b.name} ({b.floors}F)</button>)}</div>}
      {mode === 'interior' && activeBuilding && <div className="mt-2 p-2 bg-black/40 rounded text-[10px]">Inside: {activeBuilding.name}<br/>Services: {activeBuilding.services.join(', ')}<br/>Floors: {activeBuilding.floors}<br/>Floor size: {activeBuilding.floorSize[0]}x{activeBuilding.floorSize[1]}<br/><button className='mt-2 mr-2 px-2 py-1 rounded bg-blue-700' onClick={()=>appendLog('Hired helper from building service')}>Hire Helper</button><button className="mt-2 px-2 py-1 rounded bg-emerald-700" onClick={()=>setMode('explore')}>Exit Building</button></div>}
</> : <>
        <div>TURN: {turnNumber} ({turnSide})</div><div>Selected: {activePlayer.name} | AP {activePlayer.ap} | Acted: {activePlayer.hasActed ? 'YES' : 'NO'}</div><div>STATE: {battleState}</div>
        <div className="mt-2 flex gap-2"><button className="bg-red-600 px-2 py-1 rounded" onClick={attack}>Attack</button><button className="bg-blue-600 px-2 py-1 rounded" onClick={endTurn}>End Turn</button></div>
        {(battleState !== 'ongoing') && <button className="mt-2 px-2 py-1 rounded bg-emerald-700" onClick={endBattleAndReturn}>Return to Explore</button>}
      </>}
    </div>

    {inBattle && <div className="absolute bottom-4 left-4 z-30 bg-black/60 text-white p-2 rounded text-xs w-72">{players.map(p=><div key={p.id} className='mb-1'><div className='text-[10px]'>{p.name}</div><div className='w-full h-2 bg-white/20 rounded'><div className='h-2 bg-emerald-400 rounded' style={{width:`${Math.max(0,(p.hp/p.maxHp)*100)}%`}}/></div></div>)}</div>}

    {inBattle && <div className="absolute top-4 right-4 z-30 bg-black/60 text-white p-2 rounded text-xs">
      <div className="mb-2">{players.map(p=><button key={p.id} onClick={()=>setSelectedPlayerId(p.id)} className={`block px-2 py-1 my-1 rounded ${selectedPlayerId===p.id?'bg-cyan-700':'bg-white/10'} ${p.hasActed?'opacity-40':''}`}>{p.name} {p.hasActed?'(Done)':''}</button>)}</div>{enemies.map(e=><button key={e.id} onClick={()=>setSelectedEnemyId(e.id)} className={`block px-2 py-1 my-1 rounded ${selectedEnemyId===e.id?'bg-yellow-600':'bg-white/10'} ${!e.alive?'opacity-30':''}`}>{e.name} HP {e.hp}</button>)}</div>}

    <Canvas shadows frameloop="always" dpr={[1, 1.5]} gl={{ powerPreference: 'high-performance', antialias: false }} camera={{ position: inBattle ? [28, 24, 28] : [60, 45, 60], fov: 25 }}>
      <Suspense fallback={null}>
        {mode === 'explore' ? <>
          <Sky distance={450000} sunPosition={[100,20,100]} /><Stars radius={150} depth={50} count={1000} factor={2} />
          <fog attach='fog' args={['#0b1020', 35, 190]} />
          <hemisphereLight intensity={0.35} color='#dbeafe' groundColor='#0f172a' />
          <ambientLight intensity={0.35} />
          <directionalLight position={[80,120,80]} intensity={1.1} castShadow />
          <Island onGroundClick={handleExploreClick} /><House position={[0,3,0]} /><Lighthouse position={[15,3,15]} />
          <Player position={activePlayer.position} targetPosition={targetPos} yOffset={0.5} />
          {players.map(p=><PixelSprite key={p.id} position={p.position} state={spriteStateForPlayer(p.id)} pulse={selectedPlayerId===p.id} palette={p.id===PLAYER_ID ? { primary: '#1d4ed8', secondary: '#1e3a8a', accent: '#facc15' } : p.id==='player-2' ? { primary:'#6d28d9', secondary:'#4c1d95', accent:'#22d3ee' } : { primary:'#166534', secondary:'#14532d', accent:'#facc15' }} />)}
        </> : mode === 'interior' && activeBuilding ? <>
          <ambientLight intensity={0.8} /><directionalLight position={[16,22,12]} intensity={1.1} castShadow />
          <BuildingInterior building={activeBuilding} onGroundClick={handleExploreClick} />
          <Player position={[0,0.6,8]} targetPosition={targetPos} yOffset={0.5} />
          <PixelSprite position={[0,0.6,8]} state='idle' palette={{ primary: '#1d4ed8', secondary: '#1e3a8a', accent: '#facc15' }} />
        </> : <>
          <fog attach='fog' args={['#0a0f1d', 20, 90]} />
          <hemisphereLight intensity={0.28} color='#c7d2fe' groundColor='#111827' />
          <ambientLight intensity={0.3} />
          <directionalLight position={[20,38,20]} intensity={1.35} castShadow />
          <BattleMap onGroundClick={handleBattleClick} biome={explorationBiome} obstacleSeed={activeBattleLayout.obstacleSeed} heightSeed={activeBattleLayout.heightSeed} />
          <TacticalOverlay activePlayer={activePlayer} enemies={enemies} />
          <Player position={activePlayer.position} targetPosition={targetPos} yOffset={0.5} />
          {players.map(p=><PixelSprite key={p.id} position={p.position} state={spriteStateForPlayer(p.id)} pulse={selectedPlayerId===p.id} palette={p.id===PLAYER_ID ? { primary: '#1d4ed8', secondary: '#1e3a8a', accent: '#facc15' } : p.id==='player-2' ? { primary:'#6d28d9', secondary:'#4c1d95', accent:'#22d3ee' } : { primary:'#166534', secondary:'#14532d', accent:'#facc15' }} />)}
          {enemies.filter(e=>e.alive).map(e=><group key={e.id} onClick={()=>setSelectedEnemyId(e.id)}><PixelSprite position={e.position} state={selectedEnemyId===e.id ? 'attack' : 'idle'} pulse={selectedEnemyId===e.id} palette={selectedEnemyId===e.id ? { primary: '#ca8a04', secondary: '#92400e', accent: '#fde047' } : { primary: '#b91c1c', secondary: '#7f1d1d', accent: '#f97316' }} /></group>)}
          <CombatVFX events={hitFx} />
        </>}
        <CameraControls makeDefault minDistance={10} maxDistance={300} />
      </Suspense>
    </Canvas>
  </div>;
}
