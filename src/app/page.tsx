import Hero from "@/components/home/hero";
import HowWork from "@/components/home/how-work";
import AboutSection from "@/components/home/about";
import { getQuestions } from "@/helpers/get-questions";


export const metadata = {
  title: "QodeQuiz",
  description: "QodeQuiz demo website",
};

export default async function Home() {
  const data = await getQuestions() 
  console.log(data);
  
  return (
    <>
      <Hero/>
      <span className="sectionDivider"></span>
      <HowWork/>
      <span className="sectionDivider"></span>
      <AboutSection/>
    </>
    
  )
}

