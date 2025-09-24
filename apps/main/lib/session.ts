// lib/session.ts
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Cookie configuration
const SESSION_COOKIE_NAME = 'session';
const TOKEN_COOKIE_NAME = 'auth_token';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

interface UserSession {
  id: string;
  email: string;
  name: string;
  [key: string]: any;
}

interface SessionPayload {
  user: UserSession;
  token: string;
  expires: number;
  iat: number;
  exp: number;
}

// Store session with backend token
export async function login(token: string, user: UserSession): Promise<void> {
  const expires = new Date(Date.now() + SESSION_MAX_AGE * 1000);
  const expiresISO = expires.toISOString();
  
  // Get cookies instance
  const cookieStore = await cookies();
  
  // Store session data
  cookieStore.set(SESSION_COOKIE_NAME, JSON.stringify({ 
    user,
    expires: expiresISO 
  }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });

  // Store the actual token separately
  cookieStore.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

// Logout function
export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_COOKIE_NAME);
  cookieStore.delete(TOKEN_COOKIE_NAME);
  redirect('/sign-in');
}

// Get current session (server-side only)
export async function getSession(): Promise<SessionPayload | null> {
  try {
    const cookieStore = await cookies();
    const sessionData = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    const token = cookieStore.get(TOKEN_COOKIE_NAME)?.value;
    
    if (!sessionData || !token) {
      console.log('No session data or token found');
      return null;
    }

    const { user, expires: expiresISO } = JSON.parse(sessionData);
    const expires = new Date(expiresISO).getTime();
    const now = Date.now();
    
    // Check if session is expired
    if (expires < now) {
      console.log('Session expired');
      return null;
    }

    return { 
      user, 
      token, 
      expires,
      iat: now - (SESSION_MAX_AGE * 1000), // Issued at (current time - session max age)
      exp: expires // Expiration time
    };
  } catch (error) {
    console.error('Session error:', error);
    return null;
  }
}

// Get current user (server-side only)
export async function getCurrentUser(): Promise<UserSession | null> {
  const session = await getSession();
  return session?.user || null;
}

// Get auth token for API requests (server-side only)
export async function getAuthToken(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(TOKEN_COOKIE_NAME)?.value || null;
}





