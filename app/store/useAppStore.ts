import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Types for the generated data representations (can be refined later, but 'any' or basic interface is fine for now)
export interface AlterEgoData {
  name: string;
  age: number;
  origin: string;
  avatar_id: string;
  stats: {
    pace: number;
    culture: number;
    social: number;
  };
  movement: string;
  notices: string;
  never: string;
  quote: string;
  missions: Array<{
    text: string;
    xp: number;
    difficulty: string;
  }>;
}

export interface StampData {
  moment: string;
  confrontation: string;
  seal_emoji: string;
}

export interface GuideData {
  name: string;
  avatar_id: string;
  age: number;
  origin: string;
  languages: number;
  years_in_city: number;
  territory: string;
  offer: string;
  specialties: string[];
  quote: string;
}

export interface CollectionItem {
  id: string;
  city: string;
  stampData: StampData;
  date: string;
}

interface AppState {
  // User details
  name: string;
  city: string;
  style: string;
  // Game status
  xp: number;
  level: number;
  currentScreen: string; // 'intro', 'loading', 'ego', 'debrief', 'stamp', 'guide', 'profile'
  // Generated data
  ego: AlterEgoData | null;
  activeMission: any | null; // e.g. the selected mission object from ego.missions
  missionReport: string;
  stamp: StampData | null;
  guide: GuideData | null;

  // Persistent Passport Collection
  collection: CollectionItem[];

  // Audio settings
  isMuted: boolean;

  // Actions
  setName: (name: string) => void;
  setCity: (city: string) => void;
  setStyle: (style: string) => void;
  setXp: (xp: number | ((prev: number) => number)) => void;
  setLevel: (level: number) => void;
  setCurrentScreen: (screen: string) => void;
  setEgo: (ego: AlterEgoData | null) => void;
  setActiveMission: (mission: any | null) => void;
  setMissionReport: (report: string) => void;
  setStamp: (stamp: StampData | null) => void;
  setGuide: (guide: GuideData | null) => void;
  saveStampToCollection: () => void;
  toggleMute: () => void;
  resetGame: () => void;
}

const initialState = {
  name: '',
  city: '',
  style: '',
  xp: 0,
  level: 1,
  currentScreen: 'intro',
  ego: null,
  activeMission: null,
  missionReport: '',
  stamp: null,
  guide: null,
  isMuted: false,
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      ...initialState,
      collection: [], // Collection initializes empty if nothing is in local storage

      setName: (name) => set({ name }),
      setCity: (city) => set({ city }),
      setStyle: (style) => set({ style }),
      setXp: (xp) => set((state) => ({ xp: typeof xp === 'function' ? xp(state.xp) : xp })),
      setLevel: (level) => set({ level }),
      setCurrentScreen: (currentScreen) => set({ currentScreen }),
      setEgo: (ego) => set({ ego }),
      setActiveMission: (activeMission) => set({ activeMission }),
      setMissionReport: (missionReport) => set({ missionReport }),
      setStamp: (stamp) => set({ stamp }),
      setGuide: (guide) => set({ guide }),

      saveStampToCollection: () => {
        const state = get();
        if (state.stamp && state.city) {
          const newItem: CollectionItem = {
            id: crypto.randomUUID(),
            city: state.city,
            stampData: state.stamp,
            date: new Date().toISOString()
          };
          set({ collection: [...state.collection, newItem] });
        }
      },

      toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),

      resetGame: () => {
        const state = get();
        set({
          ...initialState,
          name: state.name,
          xp: state.xp,
          level: state.level,
          isMuted: state.isMuted,
        });
      },
    }),
    {
      name: 'alter-ego-storage',
    }
  )
);
