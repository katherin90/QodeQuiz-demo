import React from 'react'

import { ResultItemType } from '@/assets/data/constants'

type PropsType = {
    data: ResultItemType
}
const ResultItem:React.FC<PropsType> = ({data}) => {
    const {question, userAnswer, correctAnswer, explanation, isCorrect} = data
    return (
        <li className={`resultItem flex gap-x-[2%] elementBg not-first:mt-4 sm:not-first:mt-8 border ${isCorrect ? 'border-(--status-correct)' : 'border-(--status-wrong)'}`}>
            <div className='flex-[0_1_49%] resultItemCol'>
                <p><span className='text-(--secondary)'>&lt;</span> {question}</p>
                <p className='mt-4'><span className='font-semibold text-(--secondary)'>Your answer:</span> {userAnswer}</p>
                <p className='mt-4'><span className='font-semibold text-(--secondary)'>Correct answer:</span> {correctAnswer}</p>
            </div>
            <div className='flex-[0_1_49%] resultItemCol'>
                <span className='font-semibold text-(--secondary)'>Explanation:</span> 
                <p>{explanation}</p>
            </div>
        </li>
    )
}

export default ResultItem