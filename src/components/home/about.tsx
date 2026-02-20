import React from 'react'
import { poppins } from '@/app/fonts'

import Flow from '../ui/flow'
import SectionHeadline from '../ui/section-headline'

type BlocksItemType = {
    data : {
        title: string
        items: string[]
    }
}

const TEXT = {
    headline: 'About',
    description: 'Why QodeQuiz exists and how it’s built.',
    content: `<p>QodeQuiz is a small pet project focused on frontend fundamentals. It’s designed as a practical way to test knowledge, explore edge cases, and better understand how core web concepts work in real scenarios.</p>
    <p>The project prioritizes clarity over gamification. Questions are short, answers are intentional, and explanations focus on understanding why a solution works.</p>`,
    blocks: [
        {title:'Focus', items: ['Frontend basics', 'Real questions', 'Clear reasoning']},
        {title:'Design', items: ['Minimal UI', 'No distractions', 'App-like flow']},
        {title:'Tech', items: ['Modern frontend stack', 'Local data storage', 'No backend / no auth']},
    ],
    note: ['QodeQuiz is intentionally built without authentication.', 'Progress is stored locally to keep the experience simple.'],
    flow: ['build', 'iterate', 'improve']
}

const BlocksItem:React.FC<BlocksItemType> = ({data}) => {
    const {title, items} = data
    return (
        <div className='elementBg h-full'>
            <h3 className={`text-[clamp(20px,1.5vw,28px)] ${poppins.className}`}>{title}</h3>
            <ul className='mt-4'>
                {
                    items.map((item, index) => <li key={`${index}-2`} className='relative not-first:mt-2 before:absolute before:right-full before:top-[49%] before:w-4 before:h-0.5 before:bg-(--accent) before:opacity-40 pl-1.5'>{item}</li>)
                }
            </ul>
        </div>
    )
}

const AboutSection:React.FC = () => {
    return (
        <section className='pb-[clamp(30px,3.2vw,60px)]'>
            <div className="content @container">
                <div className='text-center'>
                    <SectionHeadline headline={TEXT.headline}/>
                    <p>{TEXT.description}</p>
                </div>
                <div className='w-full max-w-190 mx-auto mt-[clamp(24px,2.6vw,48px)] [&>p]:not-first:mt-4 columns-2 [&>p]:break-inside-avoid max-sm:columns-1' dangerouslySetInnerHTML={{ __html: TEXT.content }}></div>
                <ul className='mt-8 flex gap-8 aboutBlocks @max-[678px]:gap-4'>
                    {
                        TEXT.blocks.map(item => <li key={item.title} className='flex-3 aboutBlockItem'><BlocksItem data={item}/></li>)
                    }    
                </ul>
                <div className='w-full max-w-190 mx-auto mt-8 [&>p]:not-first:mt-2'>
                    {
                        TEXT.note.map((item, index) => <p key={`text-${index}`} className='opacity-55'>{item}</p>)
                    }
                </div>
                <Flow text={TEXT.flow}/>
            </div>
        </section>
    )
}

export default AboutSection