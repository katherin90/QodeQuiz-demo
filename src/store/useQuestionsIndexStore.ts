import { create } from 'zustand'
import { DifficultyKeyType, TechKeyType } from '@/assets/data/constants'


type DiffType = Partial<Record<TechKeyType, Partial<Record<DifficultyKeyType, number[]>>>>
type indexByTechType = Record<TechKeyType, number[]>
type indexesAllType = number[]

type storeType = {
    indexesAll: indexesAllType
    indexByTech: indexByTechType
    indexByTechAndDiff: DiffType
    loadedAt: number | null

    hydrate : (data:{idsAll:indexesAllType, indexByTech: indexByTechType, indexByTechAndDiff: DiffType}) => void
    loadIndexes: () => Promise<void>
}


export const useQuestionsStore = create<storeType>((set, get) => ({
    indexesAll: [],
    indexByTech: {} as indexByTechType,
    indexByTechAndDiff: {} as DiffType,
    loadedAt: null,

  hydrate: (data) => {
    set({
      indexesAll: data.idsAll,
      indexByTech: data.indexByTech,
      indexByTechAndDiff: data.indexByTechAndDiff,
      loadedAt: Date.now(),
    });
  },

  loadIndexes: async () => {
    if (get().loadedAt) return;

    const res = await fetch("/api/indexes")
    if (!res.ok) throw new Error("Failed to load indexes")

    const data = await res.json()
    get().hydrate(data)
  },
}));
