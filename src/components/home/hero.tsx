import React from 'react'
import { poppins, sora } from '@/app/fonts'
import Button from '../ui/button'
import Flow from '../ui/flow'

const TEXT = {
    slogan: 'Check your frontend skills',
    description: `Short technical quizzes covering JavaScript, React, HTML and core web topics. <br>Real-world questions with explanations after each answer.`,
    buttons: [
        {
            label: 'Start Random Quiz',
            href:  '/quiz'
        },
         {
            label: 'Choose a category',
            href:  '#categories'
        },
    ],
    flow: ['explore', 'test', 'learn']
}


const Hero:React.FC = () => {
    return (
        <section className='pt-[clamp(60px,8vw,150px)] pb-[clamp(15px,1.6vw,30px)]'>
            <div className="max-w-190 mx-auto text-center">
                <h1 className={`w-fit mx-auto text-[clamp(32px,3.4vw,64px)] ${sora.className} font-bold gradientText leading-none`}>QodeQuiz</h1>
                <p className={`text-[clamp(14px,1.5vw,20px)] mt-2 ${poppins.className}`}>{TEXT.slogan}</p>
                <p className='text-[clamp(16px,1.6vw,24px)] mt-5' dangerouslySetInnerHTML={{ __html: TEXT.description }}></p>
                <div className='mt-[clamp(32px,4.1vw,64px)] flex flex-col sm:flex-row items-center justify-center gap-[clamp(20px,2vw,36px)]'>
                    {
                        TEXT.buttons.map(button => <Button text={button.label} href={button.href} key={button.label}/>)
                    }
                </div>
            </div>
            <div className="content">
                <Flow text={TEXT.flow} classes = 'pt-[clamp(60px,8vw,150px)]'/>
            </div>
        </section>
    )
}

export default Hero