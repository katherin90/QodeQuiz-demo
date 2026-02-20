import React from 'react'
import Link from 'next/link'
import {sora} from '@/app/fonts'

import ThemeSwitcher from './ui/theme-switcher'

import { MENU } from '@/assets/data/constants'

const TEXT = {
    links: [
        {
            label: 'Questions powered by:',
            name: 'QuizAPI',
            href: 'https://quizapi.io/'
        },
        {
            label: 'Sorce:',
            name: 'GitHub',
            href: ''
        },
    ],
    create: {
        label: 'create',
        author: 'Yanushenko'
    }
}



const Header:React.FC = () => {
    const date = new Date()
    const year = date.getFullYear()
    return (
        <header className='header'>
            <div className="headerContent">
                <div className='flex flex-col items-center justify-between h-full min-h-116'>
                    <div>
                        <div className={`flex items-center w-44.25 h-8 gap-x-2.5 mx-auto ${sora.className}`}>
                            <span className='flex items-center justify-center w-8 h-8 flex-[0_0_32px] bg-(--accent) text-[13px] font-extrabold text-(--secondary) leading-none rounded-sm'>Q|Q</span>
                            <span className='text-2xl font-bold gradientText'>Qode|Quiz</span>
                        </div>
                        <hr className='divider'/>
                        <nav className='mt-17.5 [@media(max-height:640px)]:mt-9'>
                            <ul className='text-center'>
                                {
                                    MENU.map(item=><li className='not-first:mt-6 [@media(max-height:640px)]:not-first:mt-3' key={item.text}><Link href={item.link} className='menuLink'>{item.text}</Link></li>)
                                }
                            </ul>
                        </nav>
                        <hr className='divider mt-17.5 [@media(max-height:640px)]:mt-9'/>
                        <ThemeSwitcher/>
                    </div>
                    <div>
                        <hr className='divider'/>
                        <div className='text-[14px] text-center mt-9'>
                            {
                                TEXT.links.map(link => {
                                    return (
                                        <p key={link.name} className='not-first:mt-4'>
                                             <span className='opacity-65'>{link.label} </span> 
                                             <Link href={link.href} target='_blank'>{link.name}</Link>
                                        </p>
                                    )
                                })
                            }
                        </div>
                        <hr className='divider'/>
                        <p className='mt-9 opacity-65 align-middle text-center'>{TEXT.create.label} {year} {TEXT.create.author}</p>
                    </div>
                </div>
            </div>
            <label className='flex items-center justify-center w-8 h-8 bg-(--accent) lg:hidden opacity-70'>
                <input type='checkbox' className="opacity-0 hidden pointer-events-none" data-menu/>
                <span className='menuIconOpen'></span>
                <span className='menuIconClose'></span>
            </label>
        </header>
    )
}

export default Header