'use client'
import React from 'react'
import { useRouter } from 'next/navigation'

import Button from '../ui/button'
import Question from '../ui/question'

import { useQuestionsIndexesStore } from '@/store/useQuestionsIndexesStore'
import { useQuizStore } from '@/store/useQuizStore'

import {TECH_MAP} from '@/assets/data/constants'
const TEXT = {
    headline: 'Technical challenge',
    description: 'Single answer. Results after submission.',
    subTitle: 'Technology: ',
    questionCountText: 'Quantity of questions: ',
    notFound: ['No questions available at the moment.', 'Try another category or refresh the session.'],
    notFoundBtn: [
        {label: 'Try Random Session', href:'/quiz'},
        {label: 'Choose Another Topic', href: '/#categories'}
    ],
    submitBtn: 'View Results'
}

import type { QueryType, AnswerKeyType} from '@/assets/data/constants'
import PageHeadline from '../ui/page-headline'
import { useProgressStore } from '@/store/useProgressStore'
type Props = {query: QueryType}


const EmptyList:React.FC = () => {
    return (
        <div className='w-full max-w-125 text-[18px] mx-auto text-center'>
            {TEXT.notFound.map((p, index) => <p key={`notFoundP-${index}`}>{p}</p>)}
            <div className='flex items-center justify-between mt-8'>
                {TEXT.notFoundBtn.map(btn => <Button text={btn.label} href={btn.href} key={`btn-${btn.label}`} className='w-fit px-4'/>)}
            </div>
        </div>
    )
}

const QuizContent:React.FC<Props> = ({query}) => {
    const goingToResult = React.useRef(false)
    const tech = query.tech
    const difficulty = query.difficulty
    const router = useRouter()
    const modalRef = React.useRef<HTMLDialogElement | null>(null)
    const [countNotAnswer, setCountNotAnswer] = React.useState(0)
    const loadedAt = useQuestionsIndexesStore((s) => s.loadedAt)
    const loadIndexes = useQuestionsIndexesStore((s) => s.loadIndexes)
    const getIndexes = useQuestionsIndexesStore((s) => s.getIndexes)
    const loadQuestions = useQuizStore((s) => s.loadQuestions)
    const calcResult = useQuizStore((s)=> s.calcResult)
    const setUserAnswers = useQuizStore((s)=> s.setUserAnswer)
    const resetQuestions = useQuizStore((s)=> s.resetState)
    const questions = useQuizStore((s) => s.questions)
    const status = useQuizStore((s) => s.status)
    const error = useQuizStore((s) => s.error)
    const hasHydrated = useProgressStore((s)=>s.hasHydrated)
    const solvedQuestionIds = useProgressStore((s)=>s.solvedQuestionIds)
    const quantityQuestions = questions.length
    
    React.useEffect(() => {
        loadIndexes().catch(console.error)
    }, [loadIndexes])
    
    const ids = React.useMemo(() => {
        if (!loadedAt) return []
        if (!hasHydrated) return []
        return getIndexes({ tech, difficulty }, solvedQuestionIds)
    }, [loadedAt, hasHydrated, solvedQuestionIds, tech, difficulty])
    
    React.useEffect(() => {
        // if (!ids.length) return;
        loadQuestions(ids).catch(console.error)
    }, [ids.join(","), loadQuestions])

    React.useEffect(() => {
        return () => {
            if (!goingToResult.current) resetQuestions()
        }
    }, [])

    const handlerSubmit = (e:React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        const dataForm = new FormData(e.currentTarget)
        const data = Object.fromEntries(dataForm) as Record<string, AnswerKeyType>
        const countQuestions = questions.length
        const countAnswer = Object.keys(data).length
        if(countAnswer !== countQuestions) {
            showModal()
            setCountNotAnswer(countQuestions - countAnswer)
        } else {
            goingToResult.current = true
            setUserAnswers(data)
            calcResult()
            if(tech && difficulty) {
                router.replace(`/result?tech=${tech}&difficulty=${difficulty}`)
            } else if(tech) {
                router.replace(`/result?tech=${tech}`)
            } else {
                router.replace('/result')
            }
        }
    }
    const showModal = () => modalRef.current?.showModal()
    const closeModal = () => modalRef.current?.close()
    return (
        <>
            <section>
                <div className="content">
                    <PageHeadline text={TEXT.headline}/>
                    <p className='mt-5'>{TEXT.description}</p>
                </div>
            </section>
            <span className="sectionDivider"></span>
            {
                error
                    ? <div>{error ?? "Error"}</div>
                    :  status==='ready' 
                        ?   <>
                                <section>
                                    <div className="content">
                                        <div className='elementBg'>
                                            <p className='text-2xl'>
                                                {TEXT.subTitle} 
                                                {tech ? <span className={`techName ${tech}`}>{TECH_MAP[tech]}</span>: <span className='techName text-(--secondary)'>Random</span>}
                                            </p>
                                            <p>{TEXT.questionCountText} {quantityQuestions}</p>
                                        </div>
                                    </div>
                                </section>
                                <section className='pt-0'>
                                    <div className="content">
                                        {
                                            questions.length 
                                                ? <form className='questionForm' onSubmit={handlerSubmit}>
                                                    {questions.map((question) => <Question data={question}  tech={tech} key={question.id} />)}
                                                    <div className='questionFormBtn'>
                                                        <Button type='submit' text={TEXT.submitBtn} />
                                                    </div>
                                                </form> 
                                                : <EmptyList/> 
                                        }
                                    </div>
                                </section>
                            </>
                        : <section><div className="content text-[18px]">Loading<span className='text-(--accent)'>...</span></div></section>
            }
            <dialog onClose={closeModal} ref={modalRef} closedby='any' className='fixed inset-0 m-auto max-w-125 w-[calc(100%-40px)] p-7 elementBg noAnswerModal'>
                <div>
                    <button onClick={closeModal} className='absolute top-3 right-3 w-8 h-8 closeModal'></button>
                    <div>
                        <p className='text-[18px]'>Some questions are still unanswered. Please complete the quiz.</p>
                        <p className='pt-5'>{countNotAnswer} questions are still unanswered.</p>
                    </div>
                </div>
            </dialog>
        </>
    )
}

export default QuizContent