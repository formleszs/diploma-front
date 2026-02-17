export const ACCESS_TOKEN_KEY = 'access_token';

export const MAX_DISPLAY_NAME_LENGTH = 20;

export interface User {
  id: number;
  email: string;
  displayName: string;
  avatarUrl: string | null;
}

export interface AuthResponse {
  token: string;
  user: User;
}
