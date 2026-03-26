import { create } from 'zustand'

import { pickIndexes } from '@/helpers/getRandomIndexes'

import {TECH_MAP, TECH_LIST} from '@/assets/data/constants'

import { DifficultyKeyType, TechKeyType, QueryType, TechLabelType } from '@/assets/data/constants'
type DiffType = Partial<Record<TechKeyType, Partial<Record<DifficultyKeyType, number[]>>>>
type indexByTechType = Record<TechKeyType, number[]>
type indexesAllType = number[]
type techByIdType = Record<number, TechLabelType[]>
type storeType = {
    indexesAll: indexesAllType
    indexByTech: indexByTechType
    indexByTechAndDiff: DiffType
    techById: techByIdType
    loadedAt: number | null

    hydrate : (data:{idsAll:indexesAllType, indexByTech: indexByTechType, indexByTechAndDiff: DiffType}) => void
    loadIndexes: () => Promise<void>
    getIndexes: (query:QueryType, solvedIds: number[]) => number[]
}

export const useQuestionsIndexesStore = create<storeType>((set, get) => ({
    indexesAll: [],
    indexByTech: {} as indexByTechType,
    indexByTechAndDiff: {} as DiffType,
    techById: {} as techByIdType,
    loadedAt: null,

  hydrate: (data) => {
    const out: techByIdType = {}
    for (const { key } of TECH_LIST) {
      const label = TECH_MAP[key]
      for (const id of data.indexByTech[key] ?? []) {
        const arr = (out[id] ??= [])
        if (!arr.includes(label)) arr.push(label)
      }
    }
    
    set({
      indexesAll: data.idsAll,
      indexByTech: data.indexByTech,
      indexByTechAndDiff: data.indexByTechAndDiff,
      techById: out,
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
  getIndexes: (query, solvedIds: number[]) => {
    const LIMIT_INDEXES = 10
    const {tech, difficulty} = query
    const state = get()
    let sourceList: number[] = []
    
    if (tech && difficulty) {
      sourceList = state.indexByTechAndDiff?.[tech]?.[difficulty] ?? []
    } else if (tech) {
      sourceList = state.indexByTech?.[tech] ?? []
    } else {
      sourceList = state.indexesAll ?? []
    }
    
    const solvedSet = new Set(solvedIds)
    let available = sourceList.filter(id => !solvedSet.has(id))

    if (available.length === 0) {
      available = []
    }


    
    return pickIndexes(available, LIMIT_INDEXES)
  },
}));


