'use client'
import React from 'react'
import { useRouter } from 'next/navigation'
import { useQuizStore } from '@/store/useQuizStore'

import ResultItem from '../ui/result-item'
import PageHeadline from '../ui/page-headline'
import Button from '../ui/button'
import SectionHeadline from '../ui/section-headline'

const TEXT = {
    headline: 'Quiz results',
    headlineEmpty: "No Quiz results yet",
    description: 'Here are your quiz results. Review your answers and check the correct explanations.',
    descriptionEmpty: 'It looks like you haven\'t completed a quiz yet. Start one to see your results here.',
    sectionHeadline: 'Review your answers',
    btnNewQuiz: {label:'Try Another Quiz', href:'/quiz'},
    btnHome: {label:'Back to Quizzes', href: '/'},
    btnEmpty: {label:'Start a Quiz', href: '/'},
    headText: {
        total: 'Total',
        correct: 'Correct',
        wrong: 'Incorrect'
    }
}

import type { QueryType} from '@/assets/data/constants'

type Props = {query: QueryType}

const ResultContent:React.FC<Props> = ({query}) => {
    const router = useRouter()
    const tech = query.tech
    const difficulty = query.difficulty
    const result = useQuizStore((s)=>s.result)
    const {total, correct, wrong, items} = result
    let quizBtnHref:string

    const btnHandel = (e:React.MouseEvent<HTMLButtonElement>) => {
        const href = e.currentTarget?.dataset.href
        const finishedQuiz = useQuizStore.getState().finishedQuiz
        finishedQuiz()
        if (href) router.replace(href)
    }
    
    if(tech && difficulty) {
        quizBtnHref = `?tech=${tech}&difficulty=${difficulty}`
    }else if(tech) {
        quizBtnHref = `?tech=${tech}`
    }else {
        quizBtnHref = ''
    }

    return (
        <>
            <section>
                <div className="content">
                    <PageHeadline text={items?.length ? TEXT.headline : TEXT.headlineEmpty}/>
                    <p className='mt-5'>{items?.length ? TEXT.description : TEXT.descriptionEmpty}</p>  
                    {!items?.length && <Button text={TEXT.btnEmpty.label} href={TEXT.btnEmpty.href} className='mt-8'/>}              
                </div>
            </section>
            <span className="sectionDivider"></span>
            {
                items?.length &&  <>
                    <section>
                        <div className="content">
                            <div className='flex flex-wrap items-center gap-4 elementBg'>
                                <div className='flex-[1_1_100%] text-[20px]'>
                                    <span className='font-semibold text-(--secondary)'>Quiz score: </span>
                                    <span>{((correct*100)/total).toFixed(1)}%</span>
                                </div>
                                <div className='text-[18px]'>
                                    <span className='font-semibold text-(--secondary)'>{TEXT.headText.total}:</span>
                                    <span>{total}</span>
                                </div>
                                <div className='text-[18px]'>
                                    <span className='font-semibold text-(--secondary)'>{TEXT.headText.correct}:</span>
                                    <span>{correct}</span>
                                </div>
                                <div className='text-[18px]'>
                                    <span className='font-semibold text-(--secondary)'>{TEXT.headText.wrong}:</span>
                                    <span>{wrong}</span>
                                </div>
                            </div>
                        </div>
                    </section>
                    <section className='pt-0'>
                        <div className="content">
                            <SectionHeadline headline={TEXT.sectionHeadline}/>
                            <ul className='mt-[clamp(24px,2.6vw,48px)]'>
                                {items.map(item => <ResultItem data={item} key={item.id}/>)}
                            </ul>
                        </div>
                    </section>
                    <span className="sectionDivider"></span>
                    <section>
                        <div className="content">
                            <div className='flex items-center justify-center gap-8 resultsBtns'>
                                <Button text={TEXT.btnNewQuiz.label} dataHref={`${TEXT.btnNewQuiz.href}${quizBtnHref}`}  handler={btnHandel}/>
                                <Button text={TEXT.btnHome.label} dataHref={TEXT.btnHome.href} handler={btnHandel}/>
                            </div>
                        </div>
                    </section>
                </>
            }
           
        </>
        
    )
}

export default ResultContent