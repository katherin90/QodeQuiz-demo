import React from 'react'
import SectionHeadline from '../ui/section-headline'
import { useProgressStore } from '@/store/useProgressStore'

import { TECH_MAP } from '@/assets/data/constants'
const TEXT = {
    headline: 'Performance by Technology',
    description: 'Check how well you know each technology.',
    techCardText: {
        answered :'Answered',
        correct : 'Correct',
        accuracy :'Accuracy'  
    }
}

type TechItemProps = {
    data: [string, {answered: number, correct: number, accuracy:number}]
}

const TechItem:React.FC<TechItemProps> = ({data}) => {
    const tech = data[0]
    const label = TECH_MAP[tech]
    const info = data[1]
    
    return (
        <li className='flex-[0_1_49%] @max-[390px]:flex-[1_1_100%]'>
            <div className={`statTechItem elementBg ${tech}`}>
                <h3 className='text-2xl font-semibold py-2.5'>{label}</h3>
                <span className='questionDivider'>// <span className='line'></span> </span>
                <ul className='flex flex-wrap justify-between gap-x-2.5 py-2.5 statTechInfo'>
                    <li className='@max-[845px]:flex-[1_1_100%]'><span className='font-bold'>{TEXT.techCardText.answered}:</span> {info.answered}</li>
                    <li className='@max-[845px]:flex-[1_1_100%]'><span className='font-bold'>{TEXT.techCardText.correct}:</span> {info.correct}</li>
                    <li className='@max-[845px]:flex-[1_1_100%]'><span className='font-bold'>{TEXT.techCardText.accuracy}:</span> {(info.accuracy).toFixed(2)}</li>
                </ul>
            </div>
        </li>
    )
}

const TechStatistics:React.FC = () => {
    const data = useProgressStore(s=>s.statByTech)
    const dataArr = Object.entries(data)
    
    return (
        <section>
            <div className="content">
                <SectionHeadline headline={TEXT.headline}/>
                <p className='mt-5'>{TEXT.description}</p>
                <ul className='flex flex-wrap gap-x-[2%] gap-y-8 @max-[990px]:gap-y-4 mt-[clamp(24px,2.6vw,48px)]'>
                    {
                        dataArr.map((item, index)=><TechItem data={item} key={`tech-${index}`}/>)    
                    }
                </ul>
            </div>
        </section>
    )
}

export default TechStatistics