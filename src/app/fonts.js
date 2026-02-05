import { Poppins, Fira_Code, Sora } from "next/font/google";

export const poppins = Poppins({
  weight: ['700','400'],
  variable: "--poppins",
  subsets: ["latin"],
  display: "swap",
});

export const firaCode = Fira_Code({
  weight: ['400', '600', '700'],
  variable: "--firaCode",
  subsets: ["latin"],
  display: 'swap',
});
export const sora = Sora({
  weight: ['600','800'],
  variable: "--sora",
  subsets: ["latin"],
  display: "swap",
});