import { create } from 'zustand';

const useGameStore = create((set, get) => ({
  // Player Stats
  player: {
    level: 1,
    xp: 0,
    coins: 0,
    gems: 0,
    hearts: 3,
    maxHearts: 3,
  },

  // Game World State
  world: {
    unlockedIslands: ['tutorial'],
    currentIsland: 'tutorial',
    bridgeRepaired: false,
  },

  // Inventory
  inventory: [],

  // Current Mission
  currentMission: {
    id: 'tutorial_1',
    title: 'Welcome to CyberLand',
    description: 'Complete the tutorial to begin your journey.',
    isCompleted: false,
  },

  // Actions
  addXP: (amount) => set((state) => {
    const newXP = state.player.xp + amount;
    // Simple level up logic for now
    const newLevel = Math.floor(newXP / 100) + 1;
    return {
      player: {
        ...state.player,
        xp: newXP,
        level: newLevel,
      }
    };
  }),

  addCoins: (amount) => set((state) => ({
    player: { ...state.player, coins: state.player.coins + amount }
  })),

  addGems: (amount) => set((state) => ({
    player: { ...state.player, gems: state.player.gems + amount }
  })),

  loseHeart: () => set((state) => ({
    player: { ...state.player, hearts: Math.max(0, state.player.hearts - 1) }
  })),

  unlockIsland: (islandId) => set((state) => ({
    world: {
      ...state.world,
      unlockedIslands: [...new Set([...state.world.unlockedIslands, islandId])],
    }
  })),

  addItem: (item) => set((state) => ({
    inventory: [...state.inventory, item]
  })),

  setMission: (mission) => set({ currentMission: mission }),
}));

export default useGameStore;
