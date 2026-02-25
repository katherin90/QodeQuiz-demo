import React from 'react'
import { poppins } from '@/app/fonts'

type PropsType = {
    headline: string
}

const SectionHeadline:React.FC<PropsType> = ({headline}) => {
    return <h2 className={`inline-block text-[clamp(28px,2vw,36px)] font-bold gradientText ${poppins.className}`}>{headline}</h2>
}

export default SectionHeadline