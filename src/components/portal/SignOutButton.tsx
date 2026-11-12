'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, ensureCsrfCookie } from '@/lib/api';

export default function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleSignOut() {
    setLoading(true);
    try {
      await ensureCsrfCookie();
      await api.post('/api/logout');
    } catch {
      // If the session already expired there is nothing left to end: just go to the login page
    } finally {
      router.push('/login');
      router.refresh();
    }
  }

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="text-xs text-gray-500 hover:text-red-500 transition font-medium disabled:opacity-50"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}