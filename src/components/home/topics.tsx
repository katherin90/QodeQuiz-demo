import React from 'react'
import { poppins } from '@/app/fonts'

import SectionHeadline from '../ui/section-headline'
import Flow from '../ui/flow'


import { TECH_LIST, DIFFICULTY, TechType } from '@/assets/data/constants'
import Link from 'next/link'
const TEXT = {
    headline: 'Topics',
    description: 'Choose a focus area and practice your fundamentals.',
    flow: ['focus', 'assess', 'strengthen']
}

type  CategoryProps = {
    data : TechType
}

const Topic:React.FC<CategoryProps> = ({data}) => {
    const {key, label} = data
    return (
        <li>
            <div className='topicsItem elementBg'>
                <h3 className={`${poppins.className} topicsTitle ${key}`}>{label}</h3>
                <span className='flex flex-2 flex-wrap justify-between pt-(--gap)'>
                    {
                        DIFFICULTY.map(item => {
                            const url = item === 'Random' ? `quiz?tech=${key}` : `quiz?tech=${key}&difficulty=${item}`
                            return <Link href={url} key={`${key}-${item}`} className='topicsLink'>{item}</Link>
                        })
                    }
                </span>
            </div>
        </li>
    )
}

const TopicsSection:React.FC = () => {
    return (
        <section id='categories'>
            <div className="content">
                <div className='w-fit mx-auto text-center'>
                    <SectionHeadline headline={TEXT.headline}/>
                    <p>{TEXT.description}</p>
                </div>
                <ul className='mt-[clamp(24px,2.6vw,48px)] grid grid-cols-4 gap-8 topicsGrid'>
                    {
                        TECH_LIST.map(tech => <Topic data={tech} key={tech.key}/>)
                    }
                </ul>
                <Flow text={TEXT.flow}/> 
            </div>
        </section>
    )
}

export default TopicsSection