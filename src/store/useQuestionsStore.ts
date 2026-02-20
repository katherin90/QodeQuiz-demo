import { create } from 'zustand'
import { QuestionType, TechKeyType } from '@/assets/data/constants'

type storeType = {
    questionsById: Record<number, QuestionType>
    indexByTech: Record<TechKeyType, number[]>
    loadedAt: number | null

    hydrate : (data:{questionsById: Record<string, QuestionType>, indexByTech: Record<TechKeyType, number[]>}) => void
}

export const useQuestionsStore = create<storeType>((set) => ({
    questionsById: {},
    indexByTech: {} as Record<TechKeyType, number[]>,
    loadedAt: null,

    hydrate: (data) => {
        const normalizedIds: Record<number, QuestionType> = {};
        for (const [key, q] of Object.entries(data.questionsById)) {
        const id = q.id
        if (!Number.isFinite(id)) continue;
        normalizedIds[id] = q;
        }
        set({
            questionsById: normalizedIds,
            indexByTech: data.indexByTech,
            loadedAt: Date.now(),
        });
    }
}))
