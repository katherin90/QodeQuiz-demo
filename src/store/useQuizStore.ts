
import { create } from "zustand"

import { useProgressStore } from "./useProgressStore"

import { fetchQuestions } from "@/helpers/get-questions"
import { getQuestionTech } from "@/helpers/get-question-tech"


import type { AnswerKeyType, QuestionType, ResultType } from "@/assets/data/constants"

type Status = "idle" | "loading" | "ready" | "error"
type StoreType = {
  questions: QuestionType[]
  userAnswers: Record<string, AnswerKeyType>
  result: ResultType
  status: Status
  error: string | null
  currentIdsKey: string | null

  loadQuestions: (ids: number[]) => Promise<void>
  setUserAnswer: (data:Record<string,AnswerKeyType>) => void
  calcResult: () => void
  resetState: () => void
  finishedQuiz: () => void
}

const getAnswerResult = (question: QuestionType, userAnswerKey: AnswerKeyType ) => {
  const correctKey = (Object.keys(question.correct_answers)as Array<keyof typeof question.correct_answers>)
    .find(k => question.correct_answers[k] === "true")
    ?.replace("_correct", "") as AnswerKeyType
  return {
    correctKey,
    correctText: correctKey ? question.answers[correctKey] : null,
    userAnswerKey,
    userAnswerText: userAnswerKey ? question.answers[userAnswerKey] : null,
    isCorrect: userAnswerKey === correctKey
  }
}

export const useQuizStore = create<StoreType>((set, get) => ({
  questions: [],
  userAnswers: {},
  result: {total:0, correct:0, wrong:0},
  status: "idle" as Status,
  error: null,
  currentIdsKey: null,

  loadQuestions: async (ids) => {
    const idsKey = ids.join(",")
    
    if (get().status === "ready" && get().currentIdsKey === idsKey) return
    set({
      status: "loading",
      error: null,
      currentIdsKey: idsKey,
      questions: [],
    })
    try {
      const list = ids.length ? await fetchQuestions(ids) : []
      set({ questions: list, status: "ready" })
    } catch (e: any) {
      set({
        questions: [],
        status: "error",
        error: e?.message ?? "Failed to load questions",
      })
    }
  },
  setUserAnswer: (data) => {
    const result: Record<string, AnswerKeyType> = {}
    const arrAnswers = Object.entries(data)
    arrAnswers.forEach(item=>{
      const numberId = item[0].slice(item[0].indexOf('-')+1)
      result[numberId] = item[1]
    })
    set({
      userAnswers: result
    })
  },
  calcResult: () => {
    const {questions, userAnswers} = get()
    
    const items = questions.map(item => {
      const answerKey: AnswerKeyType = userAnswers[item.id]
      let {correctKey, correctText, userAnswerKey, userAnswerText, isCorrect} = getAnswerResult(item, answerKey)
      correctText = `${correctKey.charAt(7).toUpperCase()}. ${correctText}`
      userAnswerText = `${userAnswerKey.charAt(7).toUpperCase()}. ${userAnswerText}`

      return {
        id: item.id,
        tech: getQuestionTech(item.id)[0],
        question:item.question,
        userAnswer: userAnswerText,
        correctAnswer: correctText,
        explanation: item.explanation,
        isCorrect
      }
      
    })
    const correct = items.filter(item=>item.isCorrect).length
    set({
      result: {
        total: items.length,
        correct,
        wrong: items.length - correct,
        items
      }
    })
  },
  resetState: () => {
    set({
      questions: [],
      userAnswers: {},
      result: {total:0, correct:0, wrong:0},
      status: "idle" as Status,
      error: null,
      currentIdsKey: null,
    })
  },
  finishedQuiz: () => {
    const data = get().result.items
    const questionsCount = get().result.total
    const correctCount = get().result.correct
    useProgressStore.getState().addResult(data, questionsCount, correctCount)
    get().resetState()
  },
}))