'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Patient } from '@/types';

export default function CreateLoginPanel({ patientId }: { patientId: number }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  async function handleCreate() {
    if (!confirm('Create a login for this patient?')) return;

    setLoading(true);
    setError(null);
    try {
      const res = await api.post<{ data: Patient; temporary_password: string }>(
        `/api/patients/${patientId}/account`
      );
      setPassword(res.temporary_password);
    } catch (err) {
      setError(getErrorMessage(err, 'Could not create the login.'));
    } finally {
      setLoading(false);
    }
  }

  async function handleCopy() {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  // The password is shown once: the page only refreshes after staff confirm they have noted it
  if (password) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-xl px-6 py-5 space-y-3">
        <p className="text-sm font-semibold text-green-800">Login created</p>
        <p className="text-sm text-green-800">
          Give this temporary password to the patient and ask them to change it under
          <span className="font-medium"> My Profile</span>. It will not be shown again.
        </p>
        <div className="flex items-center gap-3">
          <code className="bg-white border border-green-200 rounded-lg px-3 py-2 text-base font-mono text-gray-900 select-all">
            {password}
          </code>
          <button
            onClick={handleCopy}
            className="text-sm text-green-800 hover:text-green-900 font-medium px-3 py-1.5 rounded-lg hover:bg-green-100 transition-colors"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
        <button
          onClick={() => router.refresh()}
          className="bg-green-700 hover:bg-green-800 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
        >
          Done, I have noted the password
        </button>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-6 py-5 space-y-3">
      <p className="text-sm font-semibold text-amber-900">No login yet</p>
      <p className="text-sm text-amber-900">
        This patient cannot sign in or book online. Create a login using the email on this profile,
        and a temporary password will be generated for you to pass on.
      </p>
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">{error}</div>
      )}
      <button
        onClick={handleCreate}
        disabled={loading}
        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
      >
        {loading ? 'Creating...' : 'Create login'}
      </button>
    </div>
  );
}