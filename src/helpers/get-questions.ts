import type { QuestionsBlobType } from "@/assets/data/constants"

export async function getQuestions(): Promise<QuestionsBlobType> {
  const TOKEN = process.env.DEV_READ_TOKEN
  const BASE = process.env.PROD_SITE_URL
  if (!BASE || !TOKEN) {
    throw new Error("Missing PROD_SITE_URL or DEV_READ_TOKEN");
  }

  const res = await fetch(`${BASE}/.netlify/functions/get-questions`, {
    headers: {
      "x-dev-token": TOKEN,
    },
    cache: "force-cache",
    next: { revalidate: 60 * 60 * 24 },
  })

  if (!res.ok) {
    throw new Error(`Failed to fetch questions: ${res.status}`);
  }

  const data = await res.json();
  return data as QuestionsBlobType;
} 