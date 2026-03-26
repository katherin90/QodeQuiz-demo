import React from 'react'
import { useQuestionsIndexesStore } from '@/store/useQuestionsIndexesStore'
import { useProgressStore } from '@/store/useProgressStore'

import SectionHeadline from '../ui/section-headline'

const TEXT = {
    headline: 'Question progress',
    description: ['See how many questions you have already completed.', 'Try to answer all available questions.'],
    text: (count: number) => `You have completed: ${count} questions`
}

const ProgressSection:React.FC = () => {
    const allQuestions = useQuestionsIndexesStore((s)=>s.indexesAll.length)
    const solvedQuestionCount = useProgressStore((s)=>s.solvedQuestionIds.length)
    const progress = allQuestions > 0 ? ((solvedQuestionCount / allQuestions)*100).toFixed(2) : 0
    
    return (
        <section>
            <div className="content">
                <SectionHeadline headline={TEXT.headline}/>
                <div className='mt-5'>
                    {TEXT.description.map(p => <p key={p}>{p}</p>)}
                </div>
                <div>
                    <p>{TEXT.text(solvedQuestionCount)}</p>
                </div>
                <div className='mt-[clamp(24px,2.6vw,48px)] flex gap-x-2.5 items-center'>
                    <div className='w-full h-10 overflow-hidden elementBg '>
                        <div className='w-full h-full bg-linear-to-r from-(--accent) from-0% to-(--secondary) to-50% rounded-[5px] flex justify-end'>
                            <div className='progressMask' style={{width:`calc(100% - (${progress}*1%))`}}></div>
                        </div>
                    </div>
                    <p>{progress}%</p>
                </div>
            </div>
        </section>
    )
}

export default ProgressSection