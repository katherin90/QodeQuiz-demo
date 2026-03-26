'use client'
import React from 'react'
import { useProgressStore } from '@/store/useProgressStore'

import Button from '../ui/button'

const TEXT = {
    content: 'Are you sure you want to reset your statistics? This action cannot be undone.',
    okBtn: { text: 'Reset' },
    cancelBtn: {text: 'Cancel'}
}

type PropsType = { isOpen: boolean, onChange: (value:boolean)=>void}

const ResetModal:React.FC<PropsType> = ({isOpen, onChange}) => {
    const resetStor = useProgressStore((s)=>s.resetStor)
    const modalRef = React.useRef<HTMLDialogElement | null>(null)

    const closeModal = ()=> onChange(false)
    
    React.useEffect(() => {
        if (isOpen) {
            modalRef.current?.showModal()
        } else {
            modalRef.current?.close()
        }
    }, [isOpen])
    
    const handlerOkBtn = () => {
        resetStor()
        closeModal()
    }


    
    return (
        <dialog onClose={closeModal} ref={modalRef} closedby='any' className='fixed inset-0 m-auto max-w-125 w-[calc(100%-40px)] p-7 elementBg noAnswerModal'>
            <div>
                <button onClick={closeModal} className='absolute top-3 right-3 w-8 h-8 closeModal'></button>
                <div>
                    <p className='text-[18px]'>{TEXT.content}</p>
                    <p className='mt-5 flex items-center justify-center gap-4'>
                        <Button text={TEXT.okBtn.text} handler={handlerOkBtn}/>
                        <Button text={TEXT.cancelBtn.text} handler={closeModal} className='border-none bg-transparent shadow-none hover:scale-[1.05] transition-transform duration-300'/>
                    </p>
                </div>
            </div>
        </dialog>
    )
}

export default ResetModal