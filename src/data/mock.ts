import type { Project, Theme, CardSet, Test, TestAttempt } from '@/types/project';

export const mockThemes: Theme[] = [
  { id: 't1', title: 'Введение в философию. Предмет и методы', order: 1 },
  { id: 't2', title: 'Античная философия: Сократ, Платон, Аристотель', order: 2 },
  { id: 't3', title: 'Средневековая философия и схоластика', order: 3 },
  { id: 't4', title: 'Философия Нового времени: рационализм и эмпиризм', order: 4 },
  { id: 't5', title: 'Немецкая классическая философия', order: 5 },
];

export const mockProjects: Project[] = [];

export const mockTests: Test[] = [
  {
    id: 'test1',
    themeId: 't1',
    createdAt: '2025-02-10T16:00:00Z',
    questions: [
      { id: 'q1', question: 'Что такое философия?', options: ['Наука о природе', 'Форма познания общих вопросов бытия', 'Искусство спора'], correctIndex: 1 },
      { id: 'q2', question: 'Какой метод не относится к философии?', options: ['Диалектика', 'Герменевтика', 'Эксперимент'], correctIndex: 2 },
      { id: 'q3', question: 'Что изучает онтология?', options: ['Знание', 'Бытие', 'Этику'], correctIndex: 1 },
    ],
  },
];

export function getProjectById(id: string): Project | undefined {
  return mockProjects.find((p) => p.id === id);
}

export function getThemeById(projectId: string, themeId: string): Theme | undefined {
  const project = getProjectById(projectId);
  return project?.themes.find((t) => t.id === themeId);
}

export function getCardSetByTheme(projectId: string, themeId: string): CardSet | undefined {
  const project = getProjectById(projectId);
  return project?.cardSets.find((cs) => cs.themeId === themeId);
}

export function getTestByTheme(themeId: string): Test | undefined {
  return mockTests.find((t) => t.themeId === themeId);
}

export function getTestAttempts(projectId: string, themeId: string): TestAttempt[] {
  const project = getProjectById(projectId);
  return project?.tests.filter((t) => t.themeId === themeId) ?? [];
}
