'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, AppointmentStatus, Service, User } from '@/types';
import AppointmentStatusBadge from '@/components/portal/dashboard/AppointmentStatusBadge';

interface Props {
  appointment: Appointment;
  services: Service[];
  doctors: User[];
  canEdit: boolean;
  canCancel: boolean;
  canUpdateNotes: boolean;
  isPatient: boolean;
}

const STATUS_FLOW: AppointmentStatus[] = ['pending', 'confirmed', 'in_progress', 'completed'];

function formatDateTime(iso: string) {
  const d = new Date(iso);
  return {
    date: d.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  };
}

export default function AppointmentDetail({
  appointment,
  services,
  doctors,
  canEdit,
  canCancel,
  canUpdateNotes,
  isPatient,
}: Props) {
  const router = useRouter();
  const { date, time } = formatDateTime(appointment.scheduled_at);

  // Edit form state
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    service_id: String(appointment.service_id),
    doctor_id: String(appointment.doctor_id),
    date: appointment.scheduled_at.split('T')[0],
    time: appointment.scheduled_at.split('T')[1]?.slice(0, 5) ?? '',
  });

  // Notes state
  const [notes, setNotes] = useState(appointment.notes ?? '');
  const [savingNotes, setSavingNotes] = useState(false);
  const [notesError, setNotesError] = useState<string | null>(null);
  const [notesSaved, setNotesSaved] = useState(false);

  // General action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const isCancelled = appointment.status === 'cancelled';
  const isCompleted = appointment.status === 'completed';
  const isLocked = isCancelled || isCompleted;

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

  // Edit handlers
  function handleEditChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleEditSubmit(e: React.FormEvent) {
    e.preventDefault();
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment.id}`,
        'PUT',
        {
          service_id: Number(editForm.service_id),
          doctor_id: Number(editForm.doctor_id),
          scheduled_at: `${editForm.date}T${editForm.time}:00`,
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update appointment.');
      }
      setEditing(false);
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  }

  // Status update
  async function handleStatusChange(status: AppointmentStatus) {
    setActionLoading(true);
    setActionError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment.id}`,
        'PUT',
        { status }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update status.');
      }
      router.refresh();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setActionLoading(false);
    }
  }

  // Cancel
  async function handleCancel() {
    if (!confirm('Are you sure you want to cancel this appointment?')) return;
    await handleStatusChange('cancelled');
  }

  // Notes save
  async function handleSaveNotes() {
    setSavingNotes(true);
    setNotesError(null);
    setNotesSaved(false);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${appointment.id}`,
        'PUT',
        { notes }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to save notes.');
      }
      setNotesSaved(true);
      setTimeout(() => setNotesSaved(false), 3000);
    } catch (err) {
      setNotesError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setSavingNotes(false);
    }
  }

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-6">

      {/* Status banner for cancelled/completed */}
      {isCancelled && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 font-medium">
          This appointment has been cancelled.
        </div>
      )}
      {isCompleted && (
        <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-700 font-medium">
          This appointment has been completed.
        </div>
      )}

      {/* Main detail card */}
      <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">

        {/* Header row — status + actions */}
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          <AppointmentStatusBadge status={appointment.status} />
          <div className="flex items-center gap-2">
            {canEdit && !isLocked && (
              <button
                onClick={() => setEditing((v) => !v)}
                className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
              >
                {editing ? 'Discard' : 'Edit'}
              </button>
            )}
            {canCancel && !isCancelled && !isCompleted && (
              <button
                onClick={handleCancel}
                disabled={actionLoading}
                className="text-sm text-red-600 hover:text-red-800 font-medium px-3 py-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
              >
                Cancel Appointment
              </button>
            )}
          </div>
        </div>

        {/* Detail rows — view mode */}
        {!editing && (
          <dl className="divide-y divide-gray-100">
            <Row label="Date">{date}</Row>
            <Row label="Time">{time}</Row>
            <Row label="Service">{appointment.service?.name ?? '—'}</Row>
            <Row label="Duration">{appointment.duration_minutes} min</Row>
            <Row label="Doctor">{appointment.doctor?.name ?? '—'}</Row>
          </dl>
        )}

        {/* Edit form — staff only */}
        {editing && canEdit && (
          <form onSubmit={handleEditSubmit} className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                name="service_id"
                value={editForm.service_id}
                onChange={handleEditChange}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {services.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} — {s.duration_minutes} min
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
              <select
                name="doctor_id"
                value={editForm.doctor_id}
                onChange={handleEditChange}
                required
                className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              >
                {doctors.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={editForm.date}
                  onChange={handleEditChange}
                  required
                  min={today}
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={editForm.time}
                  onChange={handleEditChange}
                  required
                  className="w-full text-black border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            {actionError && (
              <p className="text-sm text-red-600">{actionError}</p>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="submit"
                disabled={actionLoading}
                className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {actionLoading ? 'Saving...' : 'Save Changes'}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Discard
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Status progression — staff only */}
      {canEdit && !isLocked && (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <p className="text-sm font-medium text-gray-700 mb-3">Update Status</p>
          <div className="flex flex-wrap gap-2">
            {STATUS_FLOW.map((s) => {
              const isCurrent = appointment.status === s;
              return (
                <button
                  key={s}
                  onClick={() => handleStatusChange(s)}
                  disabled={isCurrent || actionLoading}
                  className={`text-sm px-4 py-1.5 rounded-full border font-medium transition-colors ${
                    isCurrent
                      ? 'bg-blue-700 text-white border-blue-700 cursor-default'
                      : 'border-gray-300 text-gray-600 hover:border-blue-700 hover:text-blue-700'
                  }`}
                >
                  {s.replace('_', ' ')}
                </button>
              );
            })}
          </div>
          {actionError && (
            <p className="mt-3 text-sm text-red-600">{actionError}</p>
          )}
        </div>
      )}

      {/* Patient card — hidden from patient role */}
      {!isPatient && (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Patient</p>
          <dl className="space-y-2">
            <InfoRow label="Name">{appointment.patient?.name ?? '—'}</InfoRow>
            <InfoRow label="Email">{appointment.patient?.email ?? '—'}</InfoRow>
            <InfoRow label="Phone">{appointment.patient?.phone ?? '—'}</InfoRow>
            <InfoRow label="Date of birth">
              {appointment.patient?.date_of_birth
                ? new Date(appointment.patient.date_of_birth).toLocaleDateString('en-GB', {
                    day: 'numeric', month: 'long', year: 'numeric',
                  })
                : '—'}
            </InfoRow>
          </dl>
        </div>
      )}

      {/* Notes */}
      {canUpdateNotes && (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-5">
          <p className="text-sm font-medium text-gray-700 mb-2">Notes</p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={4}
            placeholder="Add notes about this appointment..."
            disabled={isLocked}
            className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none disabled:bg-gray-50 disabled:text-gray-400"
          />
          {notesError && <p className="mt-1 text-sm text-red-600">{notesError}</p>}
          {notesSaved && <p className="mt-1 text-sm text-green-600">Notes saved.</p>}
          {!isLocked && (
            <button
              onClick={handleSaveNotes}
              disabled={savingNotes}
              className="mt-3 bg-blue-700 hover:bg-blue-800 disabled:opacity-60 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
            >
              {savingNotes ? 'Saving...' : 'Save Notes'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}

// Small helper sub-components to keep JSX clean
function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-3 flex items-center justify-between gap-4">
      <dt className="text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}

function InfoRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-sm text-gray-500 shrink-0">{label}</dt>
      <dd className="text-sm font-medium text-gray-900 text-right">{children}</dd>
    </div>
  );
}