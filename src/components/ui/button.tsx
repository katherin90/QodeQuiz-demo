import React from 'react'
import cn from 'classnames'
import Link from 'next/link'



type PropsType = {
    text: string
    type?: 'button' | 'submit' | 'reset'
    href?: string
    className?: string 
    handler?: (e:React.MouseEvent<HTMLButtonElement>)=>void
}

const Button:React.FC<PropsType> = ({text, type='button', href='', className, handler}) => {
    const classes = cn('btn', className)
    return (
        <>
            {
                href 
                    ? <Link href={href}  className={classes}>{text}</Link> 
                    : <button type={type} className={classes}>{text}</button>
            }
        </>
    )
}

export default Button