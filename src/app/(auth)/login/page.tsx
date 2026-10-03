'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ApiError, ensureCsrfCookie } from '@/lib/api';
import { User } from '@/types';
import AuthBrandPanel from '@/components/ui/AuthBrandPanel';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await ensureCsrfCookie();
      await api.post<{ data: User }>('/api/login', { email, password });
      router.push('/portal');
      router.refresh();
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setError('Invalid email or password. Please try again.');
      } else if (err instanceof ApiError && err.status === 429) {
        setError('Too many attempts. Please wait a minute and try again.');
      } else {
        console.error(err);
        setError('Could not sign in. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel — branding */}
      <AuthBrandPanel 
        headline={'Your smile is our \n top priority.'}
        subtext='Manage appointments, patient records, and clinic operations — all in one place.'
        items={
          [
            { icon: '🦷', text: 'Your patients are waiting for you' },
            { icon: '📅', text: 'View and manage today\'s schedule' },
            { icon: '📋', text: 'Stay on top of billing and records' },
          ]
        }
      />

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-8">
            <div className="w-9 h-9 bg-blue-700 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C8 2 5 5 5 8c0 2.5 1 4.5 2.5 6L9 22h6l1.5-8C18 12.5 19 10.5 19 8c0-3-3-6-7-6z" />
              </svg>
            </div>
            <span className="text-blue-700 font-semibold text-lg">DentalCare</span>
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-1">Welcome back</h2>
          <p className="text-gray-500 text-sm mb-8">
            Sign in to access your clinic portal
          </p>

          {error && (
            <div className="mb-6 flex items-start gap-3 p-4 bg-red-50 border border-red-100 rounded-xl">
              <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm-.75-11.25a.75.75 0 011.5 0v4.5a.75.75 0 01-1.5 0v-4.5zm.75 7.5a.75.75 0 100-1.5.75.75 0 000 1.5z" clipRule="evenodd" />
              </svg>
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@clinic.com"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <a href="#" className="text-xs text-blue-600 hover:underline">
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-700 hover:bg-blue-800 text-white py-2.5 rounded-xl text-sm font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            New patient?{' '}
            <a href="/register" className="text-blue-600 font-medium hover:underline">
              Create an account
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}