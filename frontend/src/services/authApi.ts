export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export const BACKEND_API_URL =
  import.meta.env.VITE_BACKEND_API_URL ||
  import.meta.env.VITE_VOICE_API_URL ||
  'http://localhost:5000';

async function parseJson(res: Response) {
  return res.json().catch(() => null);
}

export const authApi = {
  // POST /api/auth/register
  async register(name: string, email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ name, email, password }),
    });
    const data = await parseJson(res);
    if (!res.ok) throw new Error(data?.message || 'Registration failed');
    return data.user;
  },

  // POST /api/auth/login
  async login(email: string, password: string): Promise<AuthUser> {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });
    const data = await parseJson(res);
    if (!res.ok) throw new Error(data?.message || 'Invalid email or password');
    return data.user;
  },

  // GET /api/auth/me
  async me(): Promise<AuthUser | null> {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/me`, {
      credentials: 'include',
    });
    if (res.status === 401) return null;
    const data = await parseJson(res);
    if (!res.ok) return null;
    return data?.user ?? null;
  },

  // POST /api/auth/logout
  async logout(): Promise<void> {
    const res = await fetch(`${BACKEND_API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    if (!res.ok) {
      const data = await parseJson(res);
      throw new Error(data?.message || 'Logout failed');
    }
  },
};
