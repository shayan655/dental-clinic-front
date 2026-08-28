'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Role } from '@/types';

interface Props {
  user: User;
}

type InfoForm = {
  name: string;
  email: string;
};

type PasswordForm = {
  current_password: string;
  password: string;
  password_confirmation: string;
};

const ROLE_LABELS: Record<Role, string> = {
  super_admin: 'Super Admin',
  clinic_manager: 'Clinic Manager',
  doctor: 'Doctor',
  receptionist: 'Receptionist',
  patient: 'Patient',
};

const ROLE_STYLES: Record<Role, string> = {
  super_admin: 'bg-red-100 text-red-700',
  clinic_manager: 'bg-purple-100 text-purple-700',
  doctor: 'bg-blue-100 text-blue-700',
  receptionist: 'bg-indigo-100 text-indigo-700',
  patient: 'bg-green-100 text-green-700',
};

export default function ProfileClient({ user }: Props) {
  const router = useRouter();

  // Personal info state
  const [editingInfo, setEditingInfo] = useState(false);
  const [infoForm, setInfoForm] = useState<InfoForm>({
    name: user.name,
    email: user.email,
  });
  const [infoLoading, setInfoLoading] = useState(false);
  const [infoError, setInfoError] = useState<string | null>(null);
  const [infoSaved, setInfoSaved] = useState(false);

  // Password state
  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    current_password: '',
    password: '',
    password_confirmation: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  function handleInfoChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInfoForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handlePasswordChange(e: React.ChangeEvent<HTMLInputElement>) {
    setPasswordForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function csrfThenFetch(url: string, method: string, body: object) {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
      credentials: 'include',
    });
    return fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      credentials: 'include',
      body: JSON.stringify(body),
    });
  }

  async function handleInfoSubmit(e: React.FormEvent) {
    e.preventDefault();
    setInfoLoading(true);
    setInfoError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile`,
        'PUT',
        infoForm
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update profile.');
      }
      setEditingInfo(false);
      setInfoSaved(true);
      setTimeout(() => setInfoSaved(false), 3000);
      router.refresh();
    } catch (err) {
      setInfoError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setInfoLoading(false);
    }
  }

  async function handlePasswordSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (passwordForm.password !== passwordForm.password_confirmation) {
      setPasswordError('New passwords do not match.');
      return;
    }

    setPasswordLoading(true);
    setPasswordError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/profile/password`,
        'PUT',
        passwordForm
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update password.');
      }
      setPasswordForm({
        current_password: '',
        password: '',
        password_confirmation: '',
      });
      setPasswordSaved(true);
      setTimeout(() => setPasswordSaved(false), 3000);
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setPasswordLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* ── Account Info Card ── */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Personal Information</p>
          <div className="flex items-center gap-3">
            {infoSaved && (
              <span className="text-sm text-green-600 font-medium">Saved.</span>
            )}
            {!editingInfo && (
              <button
                onClick={() => { setEditingInfo(true); setInfoError(null); }}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                Edit
              </button>
            )}
          </div>
        </div>

        {/* View mode */}
        {!editingInfo && (
          <dl className="divide-y divide-gray-100">
            <Row label="Full Name">{user.name}</Row>
            <Row label="Email">{user.email}</Row>
            <Row label="Role">
              <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[user.role]}`}>
                {ROLE_LABELS[user.role]}
              </span>
            </Row>
            <Row label="Member Since">
              {new Date(user.created_at).toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              })}
            </Row>
          </dl>
        )}

        {/* Edit mode */}
        {editingInfo && (
          <form onSubmit={handleInfoSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={infoForm.name}
                onChange={handleInfoChange}
                required
                className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={infoForm.email}
                onChange={handleInfoChange}
                required
                className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Role is display only */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[user.role]}`}>
                  {ROLE_LABELS[user.role]}
                </span>
                <span className="text-xs text-gray-400">Cannot be changed here.</span>
              </div>
            </div>

            {infoError && <ErrorBox message={infoError} />}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={infoLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {infoLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setEditingInfo(false);
                  setInfoForm({ name: user.name, email: user.email });
                  setInfoError(null);
                }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </section>

      {/* ── Change Password ── */}
      <section className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Change Password</p>
          {passwordSaved && (
            <span className="text-sm text-green-600 font-medium">Password updated.</span>
          )}
        </div>

        <form onSubmit={handlePasswordSubmit} className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="current_password"
              value={passwordForm.current_password}
              onChange={handlePasswordChange}
              required
              placeholder="Enter your current password"
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={passwordForm.password}
              onChange={handlePasswordChange}
              required
              placeholder="Min. 8 characters"
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password_confirmation"
              value={passwordForm.password_confirmation}
              onChange={handlePasswordChange}
              required
              placeholder="Repeat new password"
              className="w-full border border-gray-300 text-black rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {passwordError && <ErrorBox message={passwordError} />}

          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={passwordLoading}
              className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {passwordLoading ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>

    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-3 flex items-center justify-between gap-4">
      <dt className="text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
      <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
      </svg>
      {message}
    </div>
  );
}