import {QuestionType} from "@/assets/data/constants";

const getRandomQuestions = (arr:number[], limit:number) => {
    const len = arr.length
    for (let i = 0; i < limit; i++) {
    const j = i + Math.floor(Math.random() * (len - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }

  return arr.slice(0, limit);
}

const pickQuestions = (arr: number[], count: number) =>
  arr.length <= count ? arr : getRandomQuestions(arr, count)

type Props = {
    questions: Record<number, QuestionType>, 
    random?:boolean, 
    techIdsList?:number[], 
    diffIdsList?:number[]
}


export const getQuizQuestions = ({
  questions,
  random,
  techIdsList,
  diffIdsList,
}: Props) => {
  
    const COUNT_QUESTION = 10
    let sourceIds: number[] = []

    if (diffIdsList?.length) {
        sourceIds = diffIdsList
    } else if (techIdsList?.length) {
        sourceIds = techIdsList
    } else if (random) {
        sourceIds = Object.values(questions).map(q => q.id)
    }

    const indexesArr = pickQuestions(sourceIds, COUNT_QUESTION)

    return indexesArr
        .map(id => questions[id])
        .filter(Boolean)
}