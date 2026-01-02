import { NextResponse } from 'next/server';

const baseCookie = {
  httpOnly: true,
  sameSite: 'lax' as const,
  secure: process.env.NODE_ENV === 'production',
  path: '/',
};
const ACCESS_MAX_AGE = Number(process.env.ACCESS_TOKEN_TTL || 900);
const REFRESH_MAX_AGE = Number(process.env.REFRESH_TOKEN_TTL || 60 * 60 * 24 * 7);

export const setAuthCookies = (res: NextResponse, access: string, refresh: string) => {
  res.cookies.set({
    name: 'access_token',
    value: access,
    maxAge: ACCESS_MAX_AGE,
    ...baseCookie,
  });
  res.cookies.set({
    name: 'refresh_token',
    value: refresh,
    maxAge: REFRESH_MAX_AGE,
    ...baseCookie,
  });
};

export const clearAuthCookies = (res: NextResponse) => {
  res.cookies.set({
    name: 'access_token',
    value: '',
    maxAge: 0,
    ...baseCookie,
  });
  res.cookies.set({
    name: 'refresh_token',
    value: '',
    maxAge: 0,
    ...baseCookie,
  });
};
