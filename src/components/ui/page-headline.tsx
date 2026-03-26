import React from 'react'
import { poppins } from '@/app/fonts'

type PropsType = {
    text: string
}

const PageHeadline:React.FC<PropsType> = ({text}) => {
    return <h1 className={`text-[clamp(32px,3.4vw,58px)] ${poppins.className} font-bold`}>{text}</h1>
}

export default PageHeadline