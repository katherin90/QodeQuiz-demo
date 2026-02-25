import React from 'react'
import { poppins } from '@/app/fonts'
import SectionHeadline from '../ui/section-headline'
import Flow from '../ui/flow'

const TEXT = {
    headline: 'How it works',
    description: 'A simple flow from question to understanding.',
    steps: [
        {title:'Choose a topic', text:'Pick a category or start a random quiz.',},
        {title:'Answer questions', text:'Short technical questions. One correct answer.',},
        {title:'Explanations', text:'Clear explanations after each answer.',},
        {title:'Track progress', text:'Your results are saved locally in your browser.',},
    ],
    flow: ['select', 'solve', 'review', 'refine']
}

const HowWork:React.FC = () => {
    return (
        <section>
            <div className="content">
                <div className='w-fit mx-auto text-center'>
                    <SectionHeadline headline={TEXT.headline}/>
                    <p>{TEXT.description}</p>
                </div>
                <ul className='mt-[clamp(24px,2.6vw,48px)] hwCardRow'>
                    {
                        TEXT.steps.map((step, index) => {
                            return (
                                <li key={step.title} className='hwCard'>
                                    <div className='elementBg h-full'>
                                        <span className='block text-right text-(--secondary) text-[14px] leading-none opacity-45'>{index + 1}</span>
                                        <h3 className={`text-[clamp(16px,1.5vw,28px)] ${poppins.className}`}>{step.title}</h3>
                                        <p className='mt-4 text-[clamp(14px,1vw,16px)]'>{step.text}</p>
                                    </div>
                                </li>
                            )
                        })
                    }
                </ul>
                <Flow text={TEXT.flow}/>    
            </div>
        </section>
    )
}

export default HowWork