'use client'
import React from 'react'

import {AnswerKeyType,  QuestionType,  TechKeyType } from '@/assets/data/constants'
import { getQuestionTech } from '@/helpers/get-question-tech'
type PropsType = {
    data: QuestionType
    tech?: TechKeyType
    answer?: FormDataEntryValue
}
type AnswerPropsType = {
    arr: [string, string]
    id: number
    selected?:FormDataEntryValue
}

const getAnswersArr = (
  answers: Partial<Record<AnswerKeyType, string | null>>
): [AnswerKeyType, string][] => {
  return (Object.entries(answers) as [AnswerKeyType, string | null][])
    .flatMap(([key, value]) =>
      value != null ? [[key, value]] : []
    )
}

const Answer:React.FC<AnswerPropsType> = ({arr, id, selected}) => {
    return (
        <li className='not-first:mt-2.5'>
            <label className={`answerItem ${selected === arr[0] ? 'isSelected' : ''}`}>
                {!selected && <input type='radio' name={`question-${id}`} value={arr[0]}/>}
                <span>{arr[1]}</span>
            </label>
        </li>
    )
}

const Question:React.FC<PropsType> = ({data, tech, answer}) => {
    const answersArr = getAnswersArr(data.answers)
    let techName: string | undefined = ''
    let techClassName: string | undefined = ''

    if (tech) {
        techClassName = tech
    } else {
        techName = getQuestionTech(data.id)[1]
        techClassName = getQuestionTech(data.id)[0]
    }
    return (
        <div className='break-inside-avoid questionItem focus-visible:border-red'>
            <div className={`question ${techClassName} elementBg`}>
                <div className='flex items-center justify-between p-2.5'>
                    {techName && <span className='text-2xl font-semibold'>{techName}</span>}
                    <span>{data.difficulty}</span>
                </div>
                <span className='questionDivider'>// <span className='line'></span> </span>
                <div className='flex items-start gap-4 questionText'><span className='text-(--secondary)'>&lt;</span><span>{data.question}</span></div>
                <span className='questionDivider'>// <span className='line'></span> </span>
                <ol className='questionAnswers'>
                    {
                        answersArr.map(item => (<Answer arr={item} id={data.id} key={`question-${data.id}-${item[0]}`} selected={answer}/> ))
                    }
                </ol>
            </div>
        </div>
        
    )
}

export default Question