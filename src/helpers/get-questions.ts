import type { QuestionType } from "@/assets/data/constants"

export async function fetchQuestions(ids: number[]): Promise<QuestionType[]> {
  const res = await fetch("/api/questions", {
    method: "POST",
    headers: { "content-type": "application/json; charset=utf-8" },
    body: JSON.stringify({ ids }),
  });

  if (!res.ok) throw new Error("Failed to load questions");
  return res.json();
}