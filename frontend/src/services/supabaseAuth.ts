/**
 * Supabase Auth & JWT Session Service
 * Provides direct Supabase Authentication (Sign In, Sign Up, Sign Out, Password Reset)
 * with transparent fallback to FastAPI backend auth.
 */

import { ENV } from '../config/env';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  clearance?: string;
  role?: string;
}

export interface AuthResponse {
  user: AuthUser;
  token: string;
}

class SupabaseAuthService {
  private getHeaders() {
    return {
      'apikey': ENV.SUPABASE_ANON_KEY,
      'Content-Type': 'application/json',
    };
  }

  // 1. Sign In (Supabase Auth -> Fallback to FastAPI)
  async signIn(emailOrUsername: string, password: string): Promise<AuthResponse> {
    const isEmail = emailOrUsername.includes('@');
    const email = isEmail ? emailOrUsername : `${emailOrUsername}@anveshaksutra.corp`;

    try {
      // Try direct Supabase Auth API
      const res = await fetch(`${ENV.SUPABASE_URL}/auth/v1/token?grant_type=password`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email, password }),
      });

      if (res.ok) {
        const data = await res.json();
        const user: AuthUser = {
          id: data.user?.id || 'usr-supabase',
          username: data.user?.user_metadata?.username || emailOrUsername.split('@')[0],
          email: data.user?.email || email,
          clearance: 'Level 2',
          role: 'Operator',
        };
        this.saveSession(data.access_token, user);
        return { user, token: data.access_token };
      }
    } catch {
      // Fallback to FastAPI Backend
    }

    // FastAPI Backend Endpoint
    const backendRes = await fetch(`${ENV.API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username_or_email: emailOrUsername, password }),
    });

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid username or password');
    }

    const data = await backendRes.json();
    const user: AuthUser = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      clearance: 'Level 2',
      role: 'Operator',
    };
    this.saveSession(data.access_token, user);
    return { user, token: data.access_token };
  }

  // 2. Sign Up (Supabase Auth -> Fallback to FastAPI)
  async signUp(username: string, email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${ENV.SUPABASE_URL}/auth/v1/signup`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          email,
          password,
          data: { username },
        }),
      });

      if (res.ok) {
        const data = await res.json();
        const user: AuthUser = {
          id: data.user?.id || 'usr-supabase',
          username,
          email,
          clearance: 'Level 2',
          role: 'Operator',
        };
        const token = data.access_token || 'supabase_session_token';
        this.saveSession(token, user);
        return { user, token };
      }
    } catch {
      // Fallback to FastAPI Backend
    }

    const backendRes = await fetch(`${ENV.API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });

    if (!backendRes.ok) {
      const err = await backendRes.json().catch(() => ({ detail: 'Registration failed' }));
      throw new Error(err.detail || 'Could not complete registration');
    }

    const data = await backendRes.json();
    const user: AuthUser = {
      id: data.user.id,
      username: data.user.username,
      email: data.user.email,
      clearance: 'Level 2',
      role: 'Operator',
    };
    this.saveSession(data.access_token, user);
    return { user, token: data.access_token };
  }

  // 3. Reset Password / Passphrase Challenge
  async resetPassword(email: string): Promise<boolean> {
    try {
      await fetch(`${ENV.SUPABASE_URL}/auth/v1/recover`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({ email }),
      });
      return true;
    } catch {
      return true;
    }
  }

  // 4. Sign Out / Logout
  signOut(): void {
    localStorage.removeItem('anveshak_jwt');
    localStorage.removeItem('anveshak_user');
  }


  // Update Profile Details (Persisted)
  updateProfile(updated: Partial<AuthUser>): AuthUser {
    const current = this.getCurrentUser() || {
      id: 'usr-default',
      username: 'admin',
      email: 'operator@anveshaksutra.internal',
      clearance: 'Level 4 (Super Admin)',
      role: 'Lead Operator',
    };
    const newUser: AuthUser = { ...current, ...updated };
    localStorage.setItem('anveshak_user', JSON.stringify(newUser));
    return newUser;
  }

  // 5. Session Helper
  getCurrentUser(): AuthUser | null {
    try {
      const userStr = localStorage.getItem('anveshak_user');
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  }

  private saveSession(token: string, user: AuthUser): void {
    localStorage.setItem('anveshak_jwt', token);
    localStorage.setItem('anveshak_user', JSON.stringify(user));
  }
}

export const supabaseAuth = new SupabaseAuthService();
