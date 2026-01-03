import { apiFetch } from './client';
import { endpoints } from './endpoints';
import { UserDTO } from '../dto';

export type LoginRequest = {
  email?: string;
  password?: string;
  code?: string;
};

export const login = (payload: LoginRequest) =>
  apiFetch<{ user: UserDTO }>(endpoints.auth.login, {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });

export const register = (payload: { name: string; email: string; password: string }) =>
  apiFetch<{ user: UserDTO }>(endpoints.auth.register, {
    method: 'POST',
    body: payload,
    cache: 'no-store',
  });

export const me = () =>
  apiFetch<{ user: UserDTO }>(endpoints.auth.me, {
    method: 'GET',
    cache: 'no-store',
  });

export const refreshSession = () =>
  apiFetch<{ user: UserDTO }>(endpoints.auth.refresh, {
    method: 'POST',
    cache: 'no-store',
  });

export const logout = () =>
  apiFetch<{ success: boolean }>(endpoints.auth.logout, {
    method: 'POST',
    cache: 'no-store',
  });
