import { http } from '@/api/http';

export interface ProjectDto {
  id: number;
  name: string;
  createdAt: string;
}

export async function apiGetProjects(): Promise<ProjectDto[]> {
  const { data } = await http.get<ProjectDto[]>('/projects');
  return data;
}

export async function apiGetProject(id: string | number): Promise<ProjectDto> {
  const { data } = await http.get<ProjectDto>(`/projects/${id}`);
  return data;
}

export async function apiCreateProject(name: string): Promise<ProjectDto> {
  const { data } = await http.post<ProjectDto>('/projects', { name });
  return data;
}

export async function apiDeleteProject(id: string | number): Promise<void> {
  await http.delete(`/projects/${id}`);
}
