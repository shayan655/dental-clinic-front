'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Role, User } from '@/types';

interface Props {
  staff: User[];
  isSuperAdmin: boolean;
}

type StaffForm = {
  name: string;
  email: string;
  role: Role;
  password: string;
  password_confirmation: string;
};

const emptyForm = (isSuperAdmin: boolean): StaffForm => ({
  name: '',
  email: '',
  role: 'doctor',
  password: '',
  password_confirmation: '',
});

const ROLE_LABELS: Partial<Record<Role, string>> = {
  doctor: 'Doctor',
  receptionist: 'Receptionist',
  clinic_manager: 'Clinic Manager',
};

const ROLE_STYLES: Partial<Record<Role, string>> = {
  doctor: 'bg-blue-100 text-blue-700',
  receptionist: 'bg-indigo-100 text-indigo-700',
  clinic_manager: 'bg-purple-100 text-purple-700',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function StaffClient({ staff, isSuperAdmin }: Props) {
  const router = useRouter();

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<StaffForm>(emptyForm(isSuperAdmin));
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Partial<StaffForm>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);

  const availableRoles: { value: Role; label: string }[] = isSuperAdmin
    ? [
        { value: 'doctor', label: 'Doctor' },
        { value: 'receptionist', label: 'Receptionist' },
        { value: 'clinic_manager', label: 'Clinic Manager' },
      ]
    : [
        { value: 'doctor', label: 'Doctor' },
        { value: 'receptionist', label: 'Receptionist' },
      ];

  function canManage(member: User): boolean {
    if (isSuperAdmin) return true;
    // Manager cannot manage other managers
    return member.role !== 'clinic_manager';
  }

  function handleCreateChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleEditChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEditing(member: User) {
    setEditingId(member.id);
    setEditForm({
      name: member.name,
      email: member.email,
      role: member.role,
      password: '',
      password_confirmation: '',
    });
    setError(null);
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

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff`,
        'POST',
        createForm
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to create staff member.');
      }
      setShowCreateForm(false);
      setCreateForm(emptyForm(isSuperAdmin));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleEditSubmit(e: React.FormEvent, memberId: number) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const payload: Partial<StaffForm> = {
        name: editForm.name,
        email: editForm.email,
        role: editForm.role,
      };
      // Only include password if filled in
      if (editForm.password) {
        payload.password = editForm.password;
        payload.password_confirmation = editForm.password_confirmation;
      }
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${memberId}`,
        'PUT',
        payload
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update staff member.');
      }
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(memberId: number) {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/staff/${memberId}`,
        {
          method: 'DELETE',
          headers: { Accept: 'application/json' },
          credentials: 'include',
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to delete staff member.');
      }
      setDeleteConfirmId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Create form toggle */}
      {!showCreateForm ? (
        <button
          onClick={() => { setShowCreateForm(true); setError(null); }}
          className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
        >
          + New Staff Member
        </button>
      ) : (
        <div className="bg-white border border-blue-200 rounded-xl px-6 py-5">
          <p className="text-sm font-semibold text-gray-700 mb-4">New Staff Member</p>
          <form onSubmit={handleCreateSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={createForm.name}
                  onChange={handleCreateChange}
                  required
                  placeholder="e.g. Dr. Sarah Mitchell"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={createForm.email}
                  onChange={handleCreateChange}
                  required
                  placeholder="sarah@clinic.com"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role <span className="text-red-500">*</span>
              </label>
              <select
                name="role"
                value={createForm.role}
                onChange={handleCreateChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {availableRoles.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password"
                  value={createForm.password}
                  onChange={handleCreateChange}
                  required
                  placeholder="Min. 8 characters"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="password_confirmation"
                  value={createForm.password_confirmation}
                  onChange={handleCreateChange}
                  required
                  placeholder="Repeat password"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                </svg>
                {error}
              </div>
            )}

            <div className="flex items-center gap-3 pt-1">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {loading ? 'Creating...' : 'Create Staff Member'}
              </button>
              <button
                type="button"
                onClick={() => { setShowCreateForm(false); setCreateForm(emptyForm(isSuperAdmin)); setError(null); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Staff list */}
      <div className="space-y-3">
        {staff.map((member) => {
          const isEditing = editingId === member.id;
          const isConfirmingDelete = deleteConfirmId === member.id;
          const manageable = canManage(member);

          return (
            <div key={member.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">

              {/* View row */}
              {!isEditing && (
                <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{member.name}</p>
                      <p className="text-xs text-gray-500">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${ROLE_STYLES[member.role] ?? 'bg-gray-100 text-gray-600'}`}>
                      {ROLE_LABELS[member.role] ?? member.role}
                    </span>
                    <span className="text-xs text-gray-400 hidden sm:block">
                      Joined {formatDate(member.created_at)}
                    </span>
                    {manageable && (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => startEditing(member)}
                          className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Edit
                        </button>
                        {!isConfirmingDelete ? (
                          <button
                            onClick={() => setDeleteConfirmId(member.id)}
                            className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors"
                          >
                            Delete
                          </button>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Sure?</span>
                            <button
                              onClick={() => handleDelete(member.id)}
                              disabled={loading}
                              className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            >
                              {loading ? 'Deleting...' : 'Yes, delete'}
                            </button>
                            <button
                              onClick={() => setDeleteConfirmId(null)}
                              className="text-sm text-gray-500 hover:text-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Edit form */}
              {isEditing && (
                <div className="px-6 py-5">
                  <form onSubmit={(e) => handleEditSubmit(e, member.id)} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Full Name <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={editForm.name ?? ''}
                          onChange={handleEditChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={editForm.email ?? ''}
                          onChange={handleEditChange}
                          required
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                      <select
                        name="role"
                        value={editForm.role ?? 'doctor'}
                        onChange={handleEditChange}
                        className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                      >
                        {availableRoles.map((r) => (
                          <option key={r.value} value={r.value}>{r.label}</option>
                        ))}
                      </select>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          New Password <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="password"
                          name="password"
                          value={editForm.password ?? ''}
                          onChange={handleEditChange}
                          placeholder="Leave blank to keep current"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Confirm Password <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <input
                          type="password"
                          name="password_confirmation"
                          value={editForm.password_confirmation ?? ''}
                          onChange={handleEditChange}
                          placeholder="Repeat new password"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    {error && (
                      <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                        <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                        {error}
                      </div>
                    )}

                    <div className="flex items-center gap-3 pt-1">
                      <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setEditingId(null); setError(null); }}
                        className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        Discard
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}