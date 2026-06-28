// Base URL for the Laravel API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://api.clinic.test';

// The core fetch wrapper
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    },
    // Critical for Sanctum SPA cookie mode:
    // tells the browser to include the session cookie on every request
    credentials: 'include',
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message ?? `API error: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

// Convenience methods
export const api = {
  get<T>(endpoint: string) {
    return apiFetch<T>(endpoint);
  },

  post<T>(endpoint: string, body: unknown) {
    return apiFetch<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
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