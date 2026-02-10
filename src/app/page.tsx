import Hero from "@/components/home/hero";
import HowWork from "@/components/home/how-work";
import AboutSection from "@/components/home/about";


export const metadata = {
  title: "QodeQuiz",
  description: "QodeQuiz demo website",
};

export default async function Home() {
  
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

