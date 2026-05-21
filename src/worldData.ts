export type CityBuildingType =
  | 'church'
  | 'tavern'
  | 'blacksmith'
  | 'magic_shop'
  | 'army_hall'
  | 'adventurers_guild'
  | 'traders_guild'
  | 'inn'
  | 'random_shop'
  | 'castle';

export interface CityBuilding {
  id: string;
  name: string;
  type: CityBuildingType;
  floors: number;
  floorSize: [number, number];
  position: [number, number, number];
  services: string[];
}

export const cityBuildings: CityBuilding[] = [
  { id: 'church-01', name: 'Sanctum Church', type: 'church', floors: 3, floorSize: [70, 70], position: [-120, 1, -50], services: ['heal_party', 'blessing'] },
  { id: 'tavern-01', name: 'Copper Tankard Tavern', type: 'tavern', floors: 4, floorSize: [90, 80], position: [-40, 1, -80], services: ['quests', 'rumors', 'hire_mercenary', 'drinks'] },
  { id: 'blacksmith-01', name: 'Ironforge Smithy', type: 'blacksmith', floors: 3, floorSize: [80, 70], position: [40, 1, -80], services: ['buy_weapons', 'buy_armor', 'upgrade_gear'] },
  { id: 'magic-01', name: 'Astral Arcana', type: 'magic_shop', floors: 5, floorSize: [75, 75], position: [120, 1, -50], services: ['potions', 'charms', 'magic_items'] },
  { id: 'army-01', name: 'Garrison Hall', type: 'army_hall', floors: 5, floorSize: [100, 90], position: [-130, 1, 40], services: ['train_party', 'hire_soldiers'] },
  { id: 'adv-01', name: 'Adventurers Guild', type: 'adventurers_guild', floors: 6, floorSize: [110, 100], position: [-40, 1, 70], services: ['daily_quests', 'hire_adventurers'] },
  { id: 'trade-01', name: 'Merchants Guild', type: 'traders_guild', floors: 6, floorSize: [120, 110], position: [50, 1, 70], services: ['buy', 'sell', 'market_contracts'] },
  { id: 'inn-01', name: 'Moonrest Inn', type: 'inn', floors: 4, floorSize: [85, 85], position: [130, 1, 50], services: ['rent_room', 'rest_bonus'] },
  { id: 'castle-01', name: 'Central Citadel', type: 'castle', floors: 9, floorSize: [150, 150], position: [0, 2, 0], services: ['throne_hall', 'story_events'] },
];

export interface BattleLayout {
  id: string;
  biome: 'temperate'|'snow'|'desert'|'forest'|'volcanic';
  obstacleSeed: number;
  heightSeed: number;
}

export const battleLayouts: BattleLayout[] = ['temperate','snow','desert','forest','volcanic'].flatMap((biome) =>
  Array.from({ length: 20 }).map((_, i) => ({
    id: `${biome}-${String(i + 1).padStart(2, '0')}`,
    biome: biome as BattleLayout['biome'],
    obstacleSeed: 1000 + i * 17 + biome.length,
    heightSeed: 700 + i * 11 + biome.charCodeAt(0),
  })),
);

export interface EnemyDef {
  id: string;
  biome: 'temperate'|'snow'|'desert'|'forest'|'volcanic';
  category: 'beast'|'humanoid'|'fantasy';
  name: string;
  style: string;
}

const biomes: EnemyDef['biome'][] = ['temperate','snow','desert','forest','volcanic'];
const cats: EnemyDef['category'][] = ['beast','humanoid','fantasy'];

export const enemyCatalog: EnemyDef[] = Array.from({ length: 150 }).map((_, i) => {
  const biome = biomes[i % biomes.length];
  const category = cats[i % cats.length];
  return {
    id: `enemy-${String(i + 1).padStart(3, '0')}`,
    biome,
    category,
    name: `${biome}-${category}-unit-${i + 1}`,
    style: `unique-style-${i + 1}`,
  };
});
