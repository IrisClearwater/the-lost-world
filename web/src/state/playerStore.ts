import { create } from 'zustand';

export interface PlayerState {
  level: number;
  title: string;
  xp: number;
  xpToNext: number;
  energy: number;
  maxEnergy: number;
  coins: number;
  gems: number;
  water: number;
  harmony: number;
  materials: number;

  // Actions
  spendEnergy: (amount: number) => boolean;
  restoreEnergy: (amount: number) => void;
  addCoins: (amount: number) => void;
  addHarmony: (amount: number) => void;
  addMaterials: (amount: number) => void;
  addGems: (amount: number) => void;
  addXp: (amount: number) => void;
}

export const usePlayerStore = create<PlayerState>((set, get) => ({
  level: 1,
  title: 'Custodian',
  xp: 0,
  xpToNext: 100,
  energy: 80,
  maxEnergy: 100,
  coins: 250,
  gems: 15,
  water: 20,
  harmony: 0,
  materials: 12,

  spendEnergy: (amount) => {
    const current = get().energy;
    if (current < amount) return false;
    set({ energy: current - amount });
    return true;
  },

  restoreEnergy: (amount) => {
    set(state => ({
      energy: Math.min(state.energy + amount, state.maxEnergy),
    }));
  },

  addCoins: (amount) => set(state => ({ coins: state.coins + amount })),
  addHarmony: (amount) => set(state => ({ harmony: state.harmony + amount })),
  addMaterials: (amount) => set(state => ({ materials: state.materials + amount })),
  addGems: (amount) => set(state => ({ gems: state.gems + amount })),

  addXp: (amount) => {
    set(state => {
      let { xp, xpToNext, level } = state;
      xp += amount;
      while (xp >= xpToNext) {
        xp -= xpToNext;
        level += 1;
        xpToNext = Math.floor(xpToNext * 1.3);
      }
      return { xp, xpToNext, level };
    });
  },
}));
