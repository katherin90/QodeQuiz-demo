'use client'
import React from 'react'

import { QuestionsBlobType } from '@/assets/data/constants'
import { useQuestionsStore } from '@/store/useQuestionsStore'

type PropsType = {data: QuestionsBlobType}


const QuestionProvider:React.FC<PropsType> = ({data}) => {
    const {questionsById, indexByTech} = data
    const questions = {questionsById, indexByTech}
    
    if(questions) {
        useQuestionsStore.getState().hydrate(questions);
    } else { 
        console.log('Error. Question not found')
    }
    
    return (
        <></>
    )
}

export default QuestionProvider