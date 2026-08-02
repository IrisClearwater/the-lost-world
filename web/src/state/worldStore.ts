import { create } from 'zustand';

export type ZoneState = 'dormant' | 'overgrown' | 'restored' | 'thriving';

export interface Zone {
  id: string;
  name: string;
  biome: string;
  state: ZoneState;
  description: string;
  gridPosition: { q: number; r: number };
  clearCost: number;
  restoreCost: number;
  rewards: { coins: number; harmony: number; materials: number };
}

export interface WorldState {
  zones: Zone[];
  discoveredHexes: Set<string>;
  selectedZoneId: string | null;
  selectedHex: { q: number; r: number } | null;

  // Actions
  selectHex: (q: number, r: number) => void;
  selectZone: (id: string | null) => void;
  clearZone: (id: string) => void;
  restoreZone: (id: string) => void;
  discoverHex: (q: number, r: number) => void;
}

const hexKey = (q: number, r: number) => `${q},${r}`;

// Initial demo zones in Verdant Valley
const initialZones: Zone[] = [
  {
    id: 'clearing',
    name: 'Overgrown Clearing',
    biome: 'Verdant Valley',
    state: 'overgrown',
    description: 'A small clearing choked with brambles and weeds. The old stone well is still standing.',
    gridPosition: { q: 0, r: 0 },
    clearCost: 10,
    restoreCost: 15,
    rewards: { coins: 80, harmony: 5, materials: 3 },
  },
  {
    id: 'thicket',
    name: 'Bramble Thicket',
    biome: 'Verdant Valley',
    state: 'dormant',
    description: 'A dense tangle of thorny brambles. Something glints deep within.',
    gridPosition: { q: 1, r: 0 },
    clearCost: 15,
    restoreCost: 20,
    rewards: { coins: 120, harmony: 8, materials: 5 },
  },
  {
    id: 'grove',
    name: 'Elder Oak Grove',
    biome: 'Verdant Valley',
    state: 'dormant',
    description: 'Ancient oaks stand dormant, their roots tangled in debris.',
    gridPosition: { q: 0, r: 1 },
    clearCost: 20,
    restoreCost: 25,
    rewards: { coins: 150, harmony: 10, materials: 8 },
  },
  {
    id: 'meadow',
    name: 'Wildflower Meadow',
    biome: 'Verdant Valley',
    state: 'dormant',
    description: 'A sun-dappled meadow waiting to bloom again.',
    gridPosition: { q: -1, r: 1 },
    clearCost: 12,
    restoreCost: 18,
    rewards: { coins: 100, harmony: 7, materials: 4 },
  },
];

const initialDiscovered = new Set<string>();
// Starting zone and immediate neighbours are visible
initialDiscovered.add(hexKey(0, 0));
initialDiscovered.add(hexKey(1, 0));
initialDiscovered.add(hexKey(0, 1));
initialDiscovered.add(hexKey(-1, 1));

export const useWorldStore = create<WorldState>((set, get) => ({
  zones: initialZones,
  discoveredHexes: initialDiscovered,
  selectedZoneId: null,
  selectedHex: null,

  selectHex: (q, r) => {
    const key = hexKey(q, r);
    if (!get().discoveredHexes.has(key)) return;
    const zone = get().zones.find(z => z.gridPosition.q === q && z.gridPosition.r === r);
    set({ selectedHex: { q, r }, selectedZoneId: zone?.id ?? null });
  },

  selectZone: (id) => set({ selectedZoneId: id }),

  clearZone: (id) => {
    set(state => ({
      zones: state.zones.map(z =>
        z.id === id && z.state === 'overgrown' ? { ...z, state: 'restored' as ZoneState } : z
      ),
    }));
    // Discover neighbouring hexes when a zone is cleared
    const zone = get().zones.find(z => z.id === id);
    if (zone) {
      const { q, r } = zone.gridPosition;
      const neighbours = [
        { q: q + 1, r }, { q: q - 1, r },
        { q, r: r + 1 }, { q, r: r - 1 },
        { q: q + 1, r: r - 1 }, { q: q - 1, r: r + 1 },
      ];
      const newDiscovered = new Set(get().discoveredHexes);
      neighbours.forEach(n => newDiscovered.add(hexKey(n.q, n.r)));
      set({ discoveredHexes: newDiscovered });
    }
  },

  restoreZone: (id) => {
    set(state => ({
      zones: state.zones.map(z =>
        z.id === id && z.state === 'restored' ? { ...z, state: 'thriving' as ZoneState } : z
      ),
    }));
  },

  discoverHex: (q, r) => {
    set(state => {
      const next = new Set(state.discoveredHexes);
      next.add(hexKey(q, r));
      return { discoveredHexes: next };
    });
  },
}));
