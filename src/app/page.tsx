import Hero from "@/components/home/hero";
import HowWork from "@/components/home/how-work";
import TopicsSection from "@/components/home/topics";
import AboutSection from "@/components/home/about";

import { sora } from "./fonts";




export default function Home() {
  return (
    <>
       {/* <div className="fixed top-0 left-0 bottom-0 right-0 flex justify-center items-center bg-linear-to-r from-(--accent) from-0% to-(--secondary) to-70%"> 
        <div className={`text-(--bg-dark) ${sora.className} text-6xl font-bold text-center`}>
          <p>QodeQuiz</p>
          <p className="mt-5">Coming soon</p>
        </div>
      </div> */}
      
      <Hero/>
      <span className="sectionDivider"></span>
      <HowWork/>
      <span className="sectionDivider"></span>
      <TopicsSection/>
      <span className="sectionDivider"></span>
      <AboutSection/>
    </>
    
  )
}

