import type { QuestionsBlob } from "@/assets/data/constants"

const BASE = process.env.PROD_SITE_URL
const TOKEN = process.env.DEV_READ_TOKEN

export async function getQuestions(): Promise<QuestionsBlob | null> {
  if (!BASE || !TOKEN) {
    console.error("Missing PROD_SITE_URL or DEV_READ_TOKEN")
    return null
  }

  const res = await fetch(`${BASE}/.netlify/functions/get-questions`, {
    headers: {
      "x-dev-token": TOKEN,
    },
    cache: "no-store",
  })

  if (!res.ok) {
    console.error("Failed to fetch questions:", res.status)
    return null
  }

  try {
    return (await res.json()) as QuestionsBlob
  } catch {
    return null
  }
} 