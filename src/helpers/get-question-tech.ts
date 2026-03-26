import { TECH_LIST, TechKeyType, TechLabelType } from "@/assets/data/constants"

import { useQuestionsIndexesStore } from "@/store/useQuestionsIndexesStore"

const getTechKeyByLabel = (label: string) : TechKeyType => {
  const tech = TECH_LIST.find(t => t.label === label)

  if (!tech) {
    throw new Error(`Unknown tech label: ${label}`)
  }

  return tech.key
}

export const getQuestionTech = (id:number) : [TechKeyType, TechLabelType] => {
    const TechById = useQuestionsIndexesStore.getState().techById
    const label = TechById[id][0]
    const techClassName = getTechKeyByLabel(label)
    const techName = label
    return [techClassName, techName]
}