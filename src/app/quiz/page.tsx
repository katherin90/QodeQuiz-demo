import QuizContent from '@/components/quiz/quiz-content'

type SearchParams = Promise<{ [key:string]: string | undefined }> 
type Props = {
    searchParams: SearchParams
}

import { TECH_MAP } from '@/assets/data/constants'


export async function generateMetadata({ searchParams }: Props) {
    const queryRes = await searchParams
    const tech = queryRes.tech
    const techLabel = tech ? TECH_MAP[tech] : 'Quiz'
    const level = queryRes.difficulty ?? "Random";

    return {
        title: `${techLabel} – ${level} | QodeQuiz`,
        description: `Test your ${techLabel} knowledge on ${level} difficulty.`
    };
}

const QuizPage = async ({ searchParams }: Props)=>{
    const query = await searchParams
    return <QuizContent query={query}/>
}


export default QuizPage