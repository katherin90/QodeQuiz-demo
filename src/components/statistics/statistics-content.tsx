'use client'
import React from 'react'

import { useQuestionsIndexesStore } from '@/store/useQuestionsIndexesStore'
import { useProgressStore } from '@/store/useProgressStore'

import PageHeadline from '../ui/page-headline'
import Button from '../ui/button'
import OverviewSection from './overview-section'
import TechStatistics from './tech-statistics-section'
import ProgressSection from './progress-section'
import ResetModal from './reset-modal'



const TEXT = {
  empty: {
    headline: 'No statistics yet',
    description: 'Complete your first quiz to start tracking your progress.',
    btn: {title: 'Start Quiz', href: '/'}
  },
  pageHeadline: 'Your quiz statistics',
  pageDescription: ['Track your progress and see how well you know different web technologies.','Complete more quizzes to improve your results.'],
  btnHome: {label:'Start New Quiz', href:'/'},
  btnReset: {label:'Reset Statistics'},
}

const StatisticsContent:React.FC = () => {
    const loadIndexes = useQuestionsIndexesStore((s) => s.loadIndexes)
    const totalQuizzes = useProgressStore((s)=>s.totalQuizzes)
    const hasHydrated = useProgressStore((s)=>s.hasHydrated)
    const [showResetModal, setShowResetModal] = React.useState(false)
    const toggleModal = (value:boolean) => setShowResetModal(value)

    React.useEffect(() => {
        loadIndexes().catch(console.error)
    }, [loadIndexes])

    if (!hasHydrated) {
        return (
            <section>
                <div className="content text-[18px]">Loading<span className='text-(--accent)'>...</span></div>
            </section>
        )
    }

    return (
        <>
            {
                totalQuizzes !== 0 
                    ? <>
                        <section>
                            <div className="content">
                                <PageHeadline text={TEXT.pageHeadline}/>
                                <div className='mt-5'>
                                    {
                                        TEXT.pageDescription.map(p => <p key={p}>{p}</p>)
                                    }
                                </div>
                            </div>
                        </section>
                        <span className="sectionDivider"></span>
                        <OverviewSection/>
                        <span className="sectionDivider"></span>
                        <ProgressSection/>
                        <span className="sectionDivider"></span>
                        <TechStatistics/>
                        <span className="sectionDivider"></span>
                        <section>
                            <div className="content">
                                <div className='flex items-center justify-center gap-8 @max-[415px]:flex-col'>
                                    <Button text={TEXT.btnHome.label} href={TEXT.btnHome.href}/>
                                    <Button text={TEXT.btnReset.label} handler={()=>toggleModal(true)}/>
                                </div>
                            </div>
                        </section>
                        <ResetModal isOpen={showResetModal} onChange={()=>toggleModal(false)}/>
                    </>
                    : <>
                        <section>
                            <div className="content">
                                <PageHeadline text={TEXT.empty.headline}/>
                                <p className='mt-5 mb-8'>{TEXT.empty.description}</p>
                                <Button text={TEXT.empty.btn.title} href={TEXT.empty.btn.href}/>
                            </div>
                        </section>
                        <span className="sectionDivider"></span>
                    </>
            }
        </>
    )
}

export default StatisticsContent