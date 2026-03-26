
import ResultContent from '@/components/quiz/result-content';

type SearchParams = Promise<{ [key:string]: string | undefined }> 
type Props = {
    searchParams: SearchParams
}


export const metadata = {
  title: 'Result - QodeQuiz',
  description: 'page for result quiz',
};

const ResultPage = async ({ searchParams }: Props)=>{
    const query = await searchParams
    return <ResultContent query={query}/>
}


export default ResultPage