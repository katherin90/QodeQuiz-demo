import React from 'react'
import { poppins } from '@/app/fonts'
import { useProgressStore } from '@/store/useProgressStore'


import SectionHeadline from '../ui/section-headline'

const TEXT = {
    headline: 'Overview',
    cards: [
        {title:'Quizzes completed', description: 'Number of quizzes you have finished.', value: 0},
        {title:'Questions answered', description: 'Total questions you have answered.', value: 0},
        {title:'Correct answers', description: 'How many answers were correct.', value: 0},
        {title:'Accuracy', description: 'Percentage of correct answers.', value: 0},
    ]
}
type OverviewCardType = {
    data : {title: string, description: string, value:number}
}
const OverviewCard:React.FC<OverviewCardType> = ({data}) => {
    const {title, description, value} = data
    return (
        <li>
            <div className='text-center elementBg h-full'>
                <h3 className={`text-[clamp(18px,1.5vw,28px)] ${poppins.className}`}>{title}</h3>
                <p className='mt-4'>{description}</p>
                <p className='mt-4 text-[clamp(18px,1.5vw,28px)] text-(--secondary) font-semibold'>{value}</p>
            </div>
        </li>
    )
}

const OverviewSection:React.FC = () => {
    const totalQuizzes = useProgressStore((s)=>s.totalQuizzes)
    const totalQuestions = useProgressStore((s)=>s.totalQuestions)
    const correctAnswers = useProgressStore((s)=>s.correctAnswers)
    const accuracy = totalQuestions > 0 ? +(correctAnswers / totalQuestions).toFixed(2) : 0
    const valueArr = [totalQuizzes, totalQuestions, correctAnswers, accuracy]
    let cards : {title: string, description: string, value:number}[]= []
    
    TEXT.cards.forEach((item, index)=>{
        item.value = valueArr[index]
        cards.push(item)
    })
    
    return (
        <section>
            <div className="content">
                <SectionHeadline headline={TEXT.headline}/>
                <ul className='mt-[clamp(24px,2.6vw,48px)] grid grid-cols-2 gap-8 overviewList'>
                    {cards.map((item, index ) => <OverviewCard data={item} key={index}/>)}
                </ul>
            </div>
        </section>
    )
}

export default OverviewSection