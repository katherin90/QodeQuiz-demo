'use client'
import React from 'react'
import { poppins } from '@/app/fonts'

const TEXT = {
    headline: 'Technical challenge',
    description: 'Single answer. Results after submission.',
    questionCountText: 'questions'
}

import { QueryType, QuestionType } from '@/assets/data/constants'
import { fetchQuestions } from '@/helpers/get-questions'
type Props = {query: QueryType}

const QuizContent:React.FC<Props> = ({query}) => {
    
    const ids = [2,3]
    const [questions, setQuestions] = React.useState<QuestionType[]>([]);

  React.useEffect(() => {
    if (!ids?.length) {
      setQuestions([]);
      return;
    }

    fetchQuestions(ids)
      .then(setQuestions)
      .catch(() => setQuestions([]));
  }, [ids]);
    
    // let list:QuestionType[] = (!query.tech && !query.difficulty) ? useQuestionsStore.getState().getRandomQuestions() : useQuestionsStore.getState().getQuestionsByTech(query)
    // const questionCount = list.length

    return (
        <>
            <section>
                <div className="content">
                    <h1 className={`text-[clamp(32px,3.4vw,58px)] ${poppins.className} font-bold`}>{TEXT.headline}</h1>
                    <p className='mt-5'>{TEXT.description} <span className='text-(--secondary)'> {TEXT.questionCountText}</span></p>
                </div>
            </section>
            <span className="sectionDivider"></span>
            <section>
                <div className="content flex flex-2 flex-wrap justify-between gap-10">
                {/* {list.map(item => <p key={item.id} className='flex-[1_1_39%]'>{item.question}</p>)} */}
                </div>
            </section>
        </>
    )
}

export default QuizContent