export type ProjectStatus = 'processing' | 'ready';

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  createdAt: string;
  themes: Theme[];
  summaries: Summary[];
  cardSets: CardSet[];
  tests: TestAttempt[];
}

export interface Theme {
  id: string;
  title: string;
  order: number;
}

export interface Summary {
  id: string;
  themeId: string;
  content: string;
  createdAt: string;
}

export interface CardSet {
  id: string;
  themeId: string;
  cards: Flashcard[];
  createdAt: string;
}

export type CardStatus = 'not_viewed' | 'studied';

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  status: CardStatus;
}

export interface Test {
  id: string;
  themeId: string;
  questions: TestQuestion[];
  createdAt: string;
}

export interface TestQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
}

export interface TestAttempt {
  id: string;
  testId: string;
  themeId: string;
  answers: number[];
  score: number;
  totalQuestions: number;
  createdAt: string;
  wrongQuestionIds: string[];
}

export const CREDITS = {
  summary: 2,
  cards: 5,
  test: 3,
} as const;
