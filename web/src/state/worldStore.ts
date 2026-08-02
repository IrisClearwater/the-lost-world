import { create } from 'zustand';

export type ZoneState = 'dormant' | 'overgrown' | 'restored' | 'thriving';

export interface Zone {
  id: string;
  name: string;
  biome: string;
  state: ZoneState;
  description: string;
  clearCost: number;
  restoreCost: number;
  rewards: { coins: number; harmony: number; materials: number };
  unlocks: string[];
}

export interface WorldState {
  zones: Zone[];
  selectedZoneId: string | null;

  selectZone: (id: string | null) => void;
  clearZone: (id: string) => void;
  restoreZone: (id: string) => void;
}

const initialZones: Zone[] = [
  {
    id: 'clearing',
    name: 'Overgrown Clearing',
    biome: 'Verdant Valley',
    state: 'overgrown',
    description:
      'A small clearing choked with brambles and weeds. An old stone well stands at its centre, waiting to be uncovered.',
    clearCost: 10,
    restoreCost: 15,
    rewards: { coins: 80, harmony: 5, materials: 3 },
    unlocks: ['thicket', 'grove'],
  },
  {
    id: 'thicket',
    name: 'Bramble Thicket',
    biome: 'Verdant Valley',
    state: 'dormant',
    description:
      'A dense tangle of thorny brambles and broken stone walls. Something metallic glints deep within the thicket.',
    clearCost: 15,
    restoreCost: 20,
    rewards: { coins: 120, harmony: 8, materials: 5 },
    unlocks: ['meadow'],
  },
  {
    id: 'grove',
    name: 'Elder Oak Grove',
    biome: 'Verdant Valley',
    state: 'dormant',
    description:
      'Ancient oaks stand dormant, their twisted roots buried under years of fallen leaves and debris. A natural cathedral awaits.',
    clearCost: 20,
    restoreCost: 25,
    rewards: { coins: 150, harmony: 10, materials: 8 },
    unlocks: ['meadow'],
  },
  {
    id: 'meadow',
    name: 'Wildflower Meadow',
    biome: 'Verdant Valley',
    state: 'dormant',
    description:
      'A sun-dappled meadow stretches across rolling hills, waiting to bloom. A gentle stream winds through the tall grass.',
    clearCost: 12,
    restoreCost: 18,
    rewards: { coins: 100, harmony: 7, materials: 4 },
    unlocks: [],
  },
];

export const useWorldStore = create<WorldState>((set, get) => ({
  zones: initialZones,
  selectedZoneId: null,

  selectZone: (id) => {
    const zone = get().zones.find(z => z.id === id);
    if (zone && zone.state !== 'dormant') {
      set({ selectedZoneId: id });
    }
  },

  clearZone: (id) => {
    const zone = get().zones.find(z => z.id === id);
    if (!zone || zone.state !== 'overgrown') return;

    // Update the cleared zone to restored
    set(state => ({
      zones: state.zones.map(z =>
        z.id === id ? { ...z, state: 'restored' as ZoneState } : z
      ),
    }));

    // Unlock adjacent dormant zones
    const toUnlock = zone.unlocks;
    if (toUnlock.length > 0) {
      set(state => ({
        zones: state.zones.map(z =>
          toUnlock.includes(z.id) && z.state === 'dormant'
            ? { ...z, state: 'overgrown' as ZoneState }
            : z
        ),
      }));
    }
  },

  restoreZone: (id) => {
    set(state => ({
      zones: state.zones.map(z =>
        z.id === id && z.state === 'restored'
          ? { ...z, state: 'thriving' as ZoneState }
          : z
      ),
    }));
  },
}));
