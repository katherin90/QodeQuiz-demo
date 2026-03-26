import {create} from 'zustand'
import { persist } from 'zustand/middleware'

import { ResultItemType, TechKeyType } from '@/assets/data/constants'
type StoreType = {
    totalQuizzes: number
    totalQuestions: number
    correctAnswers: number
    solvedQuestionIds: number[]
    statByTech: Partial<Record<TechKeyType, {answered: number, correct: number, accuracy:number}>> 
    hasHydrated: boolean,
    setHasHydrated: () => void
    addResult: (data:ResultItemType[] | undefined, questionsCount:number, correctCount:number)=>void
    resetStor: () => void
}

export const useProgressStore = create<StoreType>()(
    persist(
        (set, get) => (
            {
                totalQuizzes: 0,
                totalQuestions: 0,
                correctAnswers: 0,
                solvedQuestionIds: [],
                statByTech: {},
                hasHydrated: false,
                
                setHasHydrated: () => set({ hasHydrated: true }),

                addResult: (data, questionsCount, correctCount) => {
                    set((state) => {
                        const newUsedIds = data ? [...state.solvedQuestionIds, ...data.filter(item => item.isCorrect).map(item => item.id)] : state.solvedQuestionIds
                        const newStatByTech = { ...state.statByTech }
                        
                        if (data) {
                            data.forEach((item) => {
                            const tech = item.tech as TechKeyType
                            const stat = newStatByTech[tech] || { answered: 0, correct: 0, accuracy: 0 }
                            stat.answered += 1
                            if (item.isCorrect) stat.correct += 1
                                stat.accuracy = stat.correct / stat.answered
                                newStatByTech[tech] = stat
                            })
                        }

                        return {
                            totalQuizzes: state.totalQuizzes + 1,
                            totalQuestions: state.totalQuestions + questionsCount,
                            correctAnswers: state.correctAnswers + correctCount,
                            solvedQuestionIds: newUsedIds,
                            statByTech: newStatByTech
                        }
                    })
                },
                resetStor: () => {
                    set({
                        totalQuizzes: 0,
                        totalQuestions: 0,
                        correctAnswers: 0,
                        solvedQuestionIds: [],
                        statByTech: {},
                    })
                },
        }),
        {
            name: 'quiz-progress',
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated()
            },
            partialize: (state) => ({
                totalQuizzes: state.totalQuizzes,
                totalQuestions: state.totalQuestions,
                correctAnswers: state.correctAnswers,
                solvedQuestionIds: state.solvedQuestionIds,
                statByTech: state.statByTech
            })
        }
    )
)