export type TechKeyType = (typeof TECH_LIST)[number]['key'];
export type TechType = (typeof TECH_LIST)[number];

export type AnswerKeyType = "answer_a" | "answer_b" | "answer_c" | "answer_d" | "answer_e" | "answer_f";
export type DifficultyKeyType = 'medium' | 'hard' | 'easy'

export type QuestionType = {
  id: number;
  question: string;
  description?: string | null;
  answers: Partial<Record<AnswerKeyType, string | null>>;
  multiple_correct_answers?: "true" | "false";
  correct_answers?: Partial<Record<`${AnswerKeyType}_correct`, "true" | "false">>;
  explanation?: string | null;
  difficulty?: string;
  category?: string;
  tags?: string[];
};
export type QuestionsBlobType = {
  version: 1;
  questionsById: Record<string, QuestionType>;
  indexByTech: Record<TechKeyType, number[]>;
  lockedTech: Record<TechKeyType, boolean>;
  meta: { createdAt: string; updatedAt: string; runs: number };
};

export type QueryType = {tech?: TechKeyType, difficulty?: DifficultyKeyType}

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

export const TECH_MAP = Object.fromEntries(TECH_LIST.map((tech) => [tech.key, tech.label]))


export const DIFFICULTY = ['Random', 'Medium', 'Hard', 'Easy'] 




