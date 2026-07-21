'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, Patient } from '@/types';
import AppointmentStatusBadge from '@/components/portal/dashboard/AppointmentStatusBadge';
import Link from 'next/link';

interface Props {
  patient: Patient;
  appointments: Appointment[];
  canEdit: boolean;
}

type EditForm = {
  name: string;
  email: string;
  phone: string;
  date_of_birth: string;
};

function formatDOB(dob: string) {
  return new Date(dob).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function PatientProfile({ patient, appointments, canEdit }: Props) {
  const router = useRouter();

  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState<EditForm>({
    name: patient.name,
    email: patient.email,
    phone: patient.phone,
    date_of_birth: patient.date_of_birth,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patient.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          credentials: 'include',
          body: JSON.stringify(editForm),
        }
      );

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update patient.');
      }

      setEditing(false);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  const maxDOB = new Date();
  maxDOB.setDate(maxDOB.getDate() - 1);
  const maxDOBString = maxDOB.toISOString().split('T')[0];

  return (
    <div className="space-y-6">

      {/* Profile card */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">

        {/* Card header */}
        <div className="px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Profile Information</p>
          {canEdit && (
            <button
              onClick={() => { setEditing((v) => !v); setError(null); }}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
            >
              {editing ? 'Discard' : 'Edit'}
            </button>
          )}
        </div>

        {/* View mode */}
        {!editing && (
          <dl className="divide-y divide-gray-100">
            <Row label="Full Name">{patient.name}</Row>
            <Row label="Email">{patient.email}</Row>
            <Row label="Phone">{patient.phone}</Row>
            <Row label="Date of Birth">{formatDOB(patient.date_of_birth)}</Row>
            <Row label="Account Status">
              {patient.user_id ? (
                <span className="text-xs bg-green-100 text-green-700 font-medium px-2 py-0.5 rounded-full">
                  Registered
                </span>
              ) : (
                <span className="text-xs bg-amber-100 text-amber-700 font-medium px-2 py-0.5 rounded-full">
                  No account
                </span>
              )}
            </Row>
          </dl>
        )}

        {/* Edit mode */}
        {editing && canEdit && (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={editForm.name}
                onChange={handleChange}
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
                value={editForm.email}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={editForm.phone}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="date_of_birth"
                value={editForm.date_of_birth}
                onChange={handleChange}
                required
                max={maxDOBString}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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
                onClick={() => { setEditing(false); setError(null); }}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Appointment history */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-700">Appointment History</p>
          <span className="text-xs text-gray-400">{appointments.length} total</span>
        </div>

        {appointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-sm text-gray-400">
            No appointments found for this patient.
          </div>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Date & Time</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Service</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Doctor</th>
                    <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wide px-6 py-3">Status</th>
                    <th className="px-6 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {appointments.map((apt) => {
                    const { date, time } = formatDateTime(apt.scheduled_at);
                    return (
                      <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                          <p className="font-medium text-gray-900">{date}</p>
                          <p className="text-gray-500 text-xs mt-0.5">{time}</p>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{apt.service?.name ?? '—'}</td>
                        <td className="px-6 py-4 text-gray-600">{apt.doctor?.name ?? '—'}</td>
                        <td className="px-6 py-4">
                          <AppointmentStatusBadge status={apt.status} />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <Link
                            href={`/portal/appointments/${apt.id}`}
                            className="text-blue-700 hover:text-blue-900 font-medium transition-colors"
                          >
                            View →
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-gray-100">
              {appointments.map((apt) => {
                const { date, time } = formatDateTime(apt.scheduled_at);
                return (
                  <div key={apt.id} className="px-4 py-4 space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{date}</p>
                        <p className="text-xs text-gray-500">{time}</p>
                      </div>
                      <AppointmentStatusBadge status={apt.status} />
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Service</span>
                        <span className="text-gray-900">{apt.service?.name ?? '—'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Doctor</span>
                        <span className="text-gray-900">{apt.doctor?.name ?? '—'}</span>
                      </div>
                    </div>
                     <Link
                      href={`/portal/appointments/${apt.id}`}
                      className="block text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
                    >
                      View appointment →
                    </Link>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

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