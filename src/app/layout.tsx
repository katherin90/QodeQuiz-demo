import "./globals.css";
import {poppins, firaCode} from '@/app/fonts'

import Header from "@/components/header";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  
  return (
    <html lang="en" className={`${poppins.variable} ${firaCode.variable}`}>
      <body>
        <Header/>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
