import "./globals.css";
import {poppins, firaCode} from '@/app/fonts'
import { getQuestions } from "@/helpers/get-questions";

import Header from "@/components/header";
import QuestionProvider from "@/components/questions-provider";



export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const data = await getQuestions()
  
  return (
    <html lang="en" className={`${poppins.variable} ${firaCode.variable}`}>
      <body>
        <QuestionProvider data={data}/>
        <Header/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
