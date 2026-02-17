import type { AuthResponse, User } from '@/types/auth';
import { http } from '@/api/http';

export async function apiLogin(payload: { email: string; password: string }): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/login', payload);
  return data;
}

export async function apiRegister(payload: { email: string; password: string; displayName: string }): Promise<AuthResponse> {
  const { data } = await http.post<AuthResponse>('/auth/register', payload);
  return data;
}

export async function apiMe(): Promise<User> {
  const { data } = await http.get<User>('/auth/me');
  return data;
}

export async function apiUpdateProfile(displayName: string): Promise<User> {
  const { data } = await http.patch<User>('/profile', { displayName });
  return data;
}

export async function apiUploadAvatar(file: File): Promise<User> {
  const formData = new FormData();
  formData.append('file', file);
  const { data } = await http.post<User>('/profile/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
}

