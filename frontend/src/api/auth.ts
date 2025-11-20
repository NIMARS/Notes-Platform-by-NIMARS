import { api } from "./client";

export interface AuthUser {
  id: number;
  email: string;
  name?: string | null;
}

export interface AuthResponse {
  token: string;
  user: AuthUser;
}

export interface RegisterDto {
  email: string;
  password: string;
  name?: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export async function registerUser(data: RegisterDto): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/register", data);
  return res.data;
}

export async function loginUser(data: LoginDto): Promise<AuthResponse> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  return res.data;
}

export async function getCurrentUser(): Promise<AuthUser> {
  const res = await api.get<AuthUser>("/auth/me");
  return res.data;
}