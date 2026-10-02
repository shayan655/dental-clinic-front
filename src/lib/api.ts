const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://api.clinic.test';

// Error that keeps the HTTP status and Laravel's field errors
export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(message: string, status: number, errors?: Record<string, string[]>) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

// Call once before login so Laravel sets the XSRF-TOKEN cookie
export async function ensureCsrfCookie(): Promise<void> {
  await fetch(`${API_BASE_URL}/sanctum/csrf-cookie`, {
    credentials: 'include',
  });
}

async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const method = (options.method ?? 'GET').toUpperCase();
  const needsCsrf = method !== 'GET' && method !== 'HEAD';
  const xsrfToken = needsCsrf ? getCookie('XSRF-TOKEN') : null;

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...(xsrfToken ? { 'X-XSRF-TOKEN': xsrfToken } : {}),
      ...options.headers,
    },
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new ApiError(
      error.message ?? `API error: ${response.status}`,
      response.status,
      error.errors
    );
  }

  // 204 No Content (e.g. logout) has no body to parse
  if (response.status === 204) return undefined as T;

  return response.json() as Promise<T>;
}

// api = { get, post, put, delete } stays exactly as you have it

export const api = {
  get<T>(endpoint: string) {
    return apiFetch<T>(endpoint);
  },

  post<T>(endpoint: string, body?: unknown) {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  },

  put<T>(endpoint: string, body: unknown) {
    return apiFetch<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  delete<T>(endpoint: string) {
    return apiFetch<T>(endpoint, {
      method: 'DELETE',
    });
  },
};