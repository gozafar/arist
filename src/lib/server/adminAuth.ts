import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { signAccessToken, signRefreshToken, verifyAccessToken, verifyRefreshToken, JwtPayload } from '@/lib/jwt';
import crypto from 'crypto';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const SESSION_ID_COOKIE = 'session_id';
const DEFAULT_ADMIN_CODE = process.env.ADMIN_CODE || 'artist';

// Security constants
const MAX_SESSIONS_PER_ADMIN = 3;
const FAILED_LOGIN_ATTEMPTS_LIMIT = 5;
const FAILED_LOGIN_LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

interface FailedLoginAttempt {
  count: number;
  lastAttempt: number;
  lockedUntil?: number;
}

// In-memory store for failed attempts (in production, use Redis or database)
const failedAttempts = new Map<string, FailedLoginAttempt>();

// In-memory store for active sessions (in production, use Redis or database)
const activeSessions = new Map<
  string,
  {
    sessionId: string;
    userId: string;
    createdAt: number;
    lastAccessed: number;
    refreshToken: string;
  }
>();

export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const store = await cookies();
    const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;
    const sessionId = store.get(SESSION_ID_COOKIE)?.value;

    if (!accessToken || !sessionId) {
      return false;
    }

    // Verify access token
    const payload = verifyAccessToken(accessToken);

    // Check if session exists and is valid
    const session = activeSessions.get(sessionId);
    if (!session || session.userId !== payload.userId) {
      return false;
    }

    // Update last accessed time
    session.lastAccessed = Date.now();
    return true;
  } catch {
    return false;
  }
};

export const getCurrentAdmin = async (): Promise<JwtPayload | null> => {
  try {
    const store = await cookies();
    const accessToken = store.get(ACCESS_TOKEN_COOKIE)?.value;

    if (!accessToken) {
      return null;
    }

    return verifyAccessToken(accessToken);
  } catch {
    return null;
  }
};

export const validateAdminCode = (code: string): boolean => {
  if (!code || typeof code !== 'string') {
    return false;
  }

  const normalizedCode = code.trim().toLowerCase();
  const validCode = DEFAULT_ADMIN_CODE.toLowerCase();

  // Add timing attack protection
  const isValid = normalizedCode === validCode;

  // Constant-time comparison to prevent timing attacks
  if (normalizedCode.length !== validCode.length) {
    return false;
  }

  let result = 0;
  for (let i = 0; i < normalizedCode.length; i++) {
    result |= normalizedCode.charCodeAt(i) ^ validCode.charCodeAt(i);
  }

  return result === 0 && isValid;
};

const checkFailedLoginAttempts = (identifier: string): boolean => {
  const attempt = failedAttempts.get(identifier);

  if (!attempt) {
    return true;
  }

  const now = Date.now();

  // Reset if lockout period has passed
  if (attempt.lockedUntil && now > attempt.lockedUntil) {
    failedAttempts.delete(identifier);
    return true;
  }

  // Check if currently locked out
  if (attempt.lockedUntil && now <= attempt.lockedUntil) {
    return false;
  }

  // Check if exceeded attempt limit
  if (attempt.count >= FAILED_LOGIN_ATTEMPTS_LIMIT) {
    attempt.lockedUntil = now + FAILED_LOGIN_LOCKOUT_DURATION;
    failedAttempts.set(identifier, attempt);
    return false;
  }

  return true;
};

const recordFailedLoginAttempt = (identifier: string): void => {
  const now = Date.now();
  const attempt = failedAttempts.get(identifier) || { count: 0, lastAttempt: 0 };

  attempt.count++;
  attempt.lastAttempt = now;

  // Lock out if exceeded limit
  if (attempt.count >= FAILED_LOGIN_ATTEMPTS_LIMIT) {
    attempt.lockedUntil = now + FAILED_LOGIN_LOCKOUT_DURATION;
  }

  failedAttempts.set(identifier, attempt);
};

const clearFailedLoginAttempts = (identifier: string): void => {
  failedAttempts.delete(identifier);
};

const cleanupOldSessions = (userId: string): void => {
  const userSessions = Array.from(activeSessions.entries())
    .filter(([_, session]) => session.userId === userId)
    .sort(([, a], [, b]) => b.createdAt - a.createdAt);

  // Keep only the most recent MAX_SESSIONS_PER_ADMIN sessions
  if (userSessions.length > MAX_SESSIONS_PER_ADMIN) {
    const sessionsToRemove = userSessions.slice(MAX_SESSIONS_PER_ADMIN);
    sessionsToRemove.forEach(([sessionId]) => {
      activeSessions.delete(sessionId);
    });
  }
};

export const setAdminSession = (): NextResponse => {
  const adminPayload: JwtPayload = {
    userId: 'admin',
    role: 'ADMIN',
  };

  // Generate cryptographically secure session ID
  const sessionId = crypto.randomBytes(32).toString('hex');

  // Sign tokens
  const accessToken = signAccessToken(adminPayload);
  const refreshToken = signRefreshToken(adminPayload);

  // Store session
  activeSessions.set(sessionId, {
    sessionId,
    userId: adminPayload.userId,
    createdAt: Date.now(),
    lastAccessed: Date.now(),
    refreshToken,
  });

  // Clean up old sessions
  cleanupOldSessions(adminPayload.userId);

  const response = NextResponse.json({
    admin: {
      id: adminPayload.userId,
      email: 'admin@example.com',
      role: adminPayload.role,
    },
    accessToken,
    refreshToken,
    sessionId,
    expiresIn: 15 * 60, // 15 minutes in seconds
    tokenType: 'Bearer',
  });

  // Set secure HTTP-only cookies
  const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    path: '/',
  };

  // Access token cookie (15 minutes)
  response.cookies.set({
    name: ACCESS_TOKEN_COOKIE,
    value: accessToken,
    ...cookieOptions,
    maxAge: 15 * 60,
  });

  // Refresh token cookie (7 days)
  response.cookies.set({
    name: REFRESH_TOKEN_COOKIE,
    value: refreshToken,
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });

  // Session ID cookie (7 days)
  response.cookies.set({
    name: SESSION_ID_COOKIE,
    value: sessionId,
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60,
  });

  return response;
};

export const refreshAdminSession = async (): Promise<NextResponse | null> => {
  try {
    const store = await cookies();
    const refreshToken = store.get(REFRESH_TOKEN_COOKIE)?.value;
    const sessionId = store.get(SESSION_ID_COOKIE)?.value;

    if (!refreshToken || !sessionId) {
      return null;
    }

    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check session
    const session = activeSessions.get(sessionId);
    if (!session || session.userId !== payload.userId || session.refreshToken !== refreshToken) {
      return null;
    }

    // Generate new tokens
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    // Update session
    session.refreshToken = newRefreshToken;
    session.lastAccessed = Date.now();

    const response = NextResponse.json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      expiresIn: 15 * 60,
    });

    // Update access token cookie
    response.cookies.set({
      name: ACCESS_TOKEN_COOKIE,
      value: newAccessToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 15 * 60,
    });

    // Update refresh token cookie
    response.cookies.set({
      name: REFRESH_TOKEN_COOKIE,
      value: newRefreshToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Failed to refresh session' }, { status: 500 });
  }
};

export const logoutAdmin = async (): Promise<NextResponse> => {
  try {
    const store = await cookies();
    const sessionId = store.get(SESSION_ID_COOKIE)?.value;

    if (sessionId) {
      activeSessions.delete(sessionId);
    }

    const response = NextResponse.json({ message: 'Logged out successfully' });

    // Clear all auth cookies
    [ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE, SESSION_ID_COOKIE].forEach(cookieName => {
      response.cookies.set({
        name: cookieName,
        value: '',
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 0,
      });
    });

    return response;
  } catch {
    return NextResponse.json({ error: 'Logout failed' }, { status: 500 });
  }
};

export const requireAdmin = async (): Promise<NextResponse | null> => {
  const authed = await isAuthenticated();
  if (!authed) {
    return NextResponse.json(
      {
        error: 'Unauthorized',
        message: 'Authentication required',
      },
      { status: 401 }
    );
  }
  return null;
};

export const checkLoginRateLimit = (identifier: string): { allowed: boolean; error?: string } => {
  if (!checkFailedLoginAttempts(identifier)) {
    const attempt = failedAttempts.get(identifier);
    if (attempt?.lockedUntil) {
      const remainingTime = Math.ceil((attempt.lockedUntil - Date.now()) / 60000);
      return {
        allowed: false,
        error: `Too many failed attempts. Try again in ${remainingTime} minutes.`,
      };
    }
  }
  return { allowed: true };
};

export const recordLoginFailure = (identifier: string): void => {
  recordFailedLoginAttempt(identifier);
};

export const recordLoginSuccess = (identifier: string): void => {
  clearFailedLoginAttempts(identifier);
};
