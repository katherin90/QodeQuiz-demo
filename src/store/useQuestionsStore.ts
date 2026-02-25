import { create } from 'zustand'
import { DifficultyKeyType, QueryType, QuestionType, TechKeyType } from '@/assets/data/constants'
import { getQuizQuestions } from '@/helpers/get-quiz-question'


type DiffType = Partial<Record<TechKeyType, Partial<Record<DifficultyKeyType, number[]>>>>
type indexByTechType = Record<TechKeyType, number[]>
type storeType = {
    questionsById: Record<number, QuestionType>
    indexByTech: indexByTechType
    indexByTechAndDiff: DiffType
    loadedAt: number | null

    hydrate : (data:{questionsById: Record<string, QuestionType>, indexByTech: indexByTechType}) => void
    getRandomQuestions: () => QuestionType[]
    getQuestionsByTech: (query: QueryType) => QuestionType[]
}

export const useQuestionsStore = create<storeType>((set, get) => ({
    questionsById: {},
    indexByTech: {} as indexByTechType,
    indexByTechAndDiff: {} as DiffType,
    loadedAt: null,

    hydrate: (data) => {
        const normalizedIds: Record<number, QuestionType> = {};
        const diff:DiffType = {}
        
        for (const [key, q] of Object.entries(data.questionsById)) {
        const id = q.id
        if (!Number.isFinite(id)) continue;
        normalizedIds[id] = q;
        }
        
        for (const [tech, list] of Object.entries(data.indexByTech) as [TechKeyType, number[]][]) {
            
            list.forEach(id=>{
                const difficultyKey = data.questionsById[String(id)]?.difficulty?.toLowerCase() as DifficultyKeyType | undefined;
                if (!difficultyKey) return;
                diff[tech] ??= {};
                diff[tech][difficultyKey] ??= [];
                diff[tech][difficultyKey]!.push(id);
            })
        }
        
        set({
            questionsById: normalizedIds,
            indexByTech: data.indexByTech,
            indexByTechAndDiff: diff,
            loadedAt: Date.now(),
        });
    },
    getRandomQuestions: () => {
        const {questionsById} = get()
        const questionList:QuestionType[] = getQuizQuestions({questions: questionsById, random: true})
        return questionList
    },
    getQuestionsByTech: (query) => {
        const {tech, difficulty} = query 
        const {questionsById} = get()
        let questionList:QuestionType[] = []
        
        if (tech && difficulty) {
            const {indexByTechAndDiff} = get()
            const listIdsDiff: number[] = indexByTechAndDiff?.[tech]?.[difficulty] ?? []
            questionList = getQuizQuestions({questions: questionsById, diffIdsList: listIdsDiff})
        } else if (tech) {
            const {indexByTech} = get()
            const listIdsTech:number[] = indexByTech[tech]
            questionList = getQuizQuestions({questions: questionsById, techIdsList: listIdsTech})
        }
        
        return questionList
    },

}))
