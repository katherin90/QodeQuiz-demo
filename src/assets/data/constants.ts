export type TechKey = (typeof TECH_LIST)[number]['key'];
export type Tech = (typeof TECH_LIST)[number];
export type difficultyType = 'Easy' | 'Medium' | 'Hard'

export type AnswerKey = "answer_a" | "answer_b" | "answer_c" | "answer_d" | "answer_e" | "answer_f";

export type Question = {
  id: number;
  question: string;
  description?: string | null;
  answers: Partial<Record<AnswerKey, string | null>>;
  multiple_correct_answers?: "true" | "false";
  correct_answers?: Partial<Record<`${AnswerKey}_correct`, "true" | "false">>;
  explanation?: string | null;
  difficulty?: string;
  category?: string;
  tags?: string[];
};
export type QuestionsBlob = {
  version: 1;
  questionsById: Record<string, Question>;
  indexByTech: Record<TechKey, number[]>;
  lockedTech: Record<TechKey, boolean>;
  meta: { createdAt: string; updatedAt: string; runs: number };
};

export const MENU = [
    {text:'Home', link: '/'},
    {text:'Statistics', link: '/statistics'},
]
export const TECH_LIST = [
  { key: 'react', label: 'React' },
  { key: 'next', label: 'Next.js' },
  { key: 'vue', label: 'VueJS' },
  { key: 'html', label: 'HTML' },
  { key: 'js', label: 'JavaScript' },
  { key: 'php', label: 'PHP' },
  { key: 'laravel', label: 'Laravel' },
  { key: 'wordpress', label: 'WordPress' },
] as const;

export const DIFFICULTY = ['Easy', 'Medium', 'Hard'] 




