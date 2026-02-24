import { http } from '@/api/http';

export interface LectureDto {
  id: number;
  title: string;
  status: string;
  projectId?: number;
  createdAt?: string;
}

export async function apiGetProjectLectures(projectId: string | number): Promise<LectureDto[]> {
  const { data } = await http.get<LectureDto[]>(`/projects/${projectId}/lectures`);
  return data;
}

export async function apiCreateLecture(projectId: string | number, title: string, files: File[]): Promise<LectureDto> {
  const formData = new FormData();
  formData.append('title', title);
  files.forEach((f) => formData.append('files', f));
  // Не задаём Content-Type — браузер сам выставит multipart/form-data с boundary.
  const { data } = await http.post<LectureDto>(`/projects/${projectId}/lectures`, formData);
  return data;
}

export async function apiGetLecture(lectureId: string | number): Promise<LectureDto> {
  const { data } = await http.get<LectureDto>(`/lectures/${lectureId}`);
  return data;
}

export async function apiGetLectureText(lectureId: string | number): Promise<string> {
  const { data } = await http.get<unknown>(`/lectures/${lectureId}/text`);
  if (typeof data === 'string') return data;
  if (data && typeof data === 'object' && 'text' in data && typeof (data as { text: unknown }).text === 'string') {
    return (data as { text: string }).text;
  }
  return '';
}

export async function apiPostLectureSummary(lectureId: string | number): Promise<{ summary?: string }> {
  const { data } = await http.post<{ summary?: string }>(`/lectures/${lectureId}/summary`);
  return data;
}

export async function apiPostLectureFlashcards(lectureId: string | number): Promise<unknown> {
  const { data } = await http.post<unknown>(`/lectures/${lectureId}/flashcards`);
  return data;
}

export async function apiGetLectureQuiz(lectureId: string | number): Promise<{ locked?: boolean }> {
  const { data } = await http.get<{ locked?: boolean }>(`/lectures/${lectureId}/quiz`);
  return data;
}
