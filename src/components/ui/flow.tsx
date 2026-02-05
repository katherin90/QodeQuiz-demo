import classNames from 'classnames'
import React from 'react'

type PropsType = {
    text: string[]
    classes?: string
}

const Flow:React.FC<PropsType> = ({text, classes}) => {
    const str = text.join(' → ') 
    return (
        <p className={`text-[13px] opacity-50 ${classes ? classes : 'pt-[clamp(30px,3.2vw,60px)]'}`}>
            <span className='text-(--secondary)'>&lt;</span> {str}
        </p>
    )
}

export default Flow