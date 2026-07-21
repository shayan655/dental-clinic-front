'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Appointment, MedicalRecord } from '@/types';

interface Props {
  records: MedicalRecord[];
  appointments: Appointment[];
  isDoctor: boolean;
  currentDoctorId: number | null;
  patientId: number;
}

type RecordForm = {
  appointment_id: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes: string;
};

const emptyForm: RecordForm = {
  appointment_id: '',
  diagnosis: '',
  treatment: '',
  prescription: '',
  notes: '',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function formatAppointmentLabel(apt: Appointment) {
  const date = new Date(apt.scheduled_at).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
  return `${date} — ${apt.service?.name ?? 'Appointment'}`;
}

export default function MedicalRecords({
  records,
  appointments,
  isDoctor,
  currentDoctorId,
  patientId,
}: Props) {
  const router = useRouter();

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<RecordForm>(emptyForm);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [createForm, setCreateForm] = useState<RecordForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleEditFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleCreateFormChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setCreateForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function startEditing(record: MedicalRecord) {
    setEditingId(record.id);
    setExpandedId(record.id);
    setEditForm({
      appointment_id: String(record.appointment_id ?? ''),
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      prescription: record.prescription ?? '',
      notes: record.notes ?? '',
    });
    setError(null);
  }

  function cancelEditing() {
    setEditingId(null);
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

  async function handleEditSubmit(e: React.FormEvent, recordId: number) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}/records/${recordId}`,
        'PUT',
        {
          appointment_id: editForm.appointment_id ? Number(editForm.appointment_id) : null,
          diagnosis: editForm.diagnosis,
          treatment: editForm.treatment,
          prescription: editForm.prescription || null,
          notes: editForm.notes || null,
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to update record.');
      }
      setEditingId(null);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await csrfThenFetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${patientId}/records`,
        'POST',
        {
          appointment_id: createForm.appointment_id ? Number(createForm.appointment_id) : null,
          diagnosis: createForm.diagnosis,
          treatment: createForm.treatment,
          prescription: createForm.prescription || null,
          notes: createForm.notes || null,
        }
      );
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Failed to create record.');
      }
      setShowCreateForm(false);
      setCreateForm(emptyForm);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">

      {/* Read-only notice for patients */}
      {!isDoctor && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-sm text-blue-700">
          These are your medical records. You can view them but cannot make changes.
        </div>
      )}

      {/* Create new record — doctors only */}
      {isDoctor && (
        <div>
          {!showCreateForm ? (
            <button
              onClick={() => { setShowCreateForm(true); setError(null); }}
              className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
            >
              + New Record
            </button>
          ) : (
            <div className="bg-white border border-blue-200 rounded-xl px-6 py-5 space-y-4">
              <p className="text-sm font-semibold text-gray-700">New Medical Record</p>
              <form onSubmit={handleCreateSubmit} className="space-y-4">

                {/* Appointment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Linked Appointment
                  </label>
                  <select
                    name="appointment_id"
                    value={createForm.appointment_id}
                    onChange={handleCreateFormChange}
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                  >
                    <option value="">None</option>
                    {appointments.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {formatAppointmentLabel(apt)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Diagnosis */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Diagnosis <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="diagnosis"
                    value={createForm.diagnosis}
                    onChange={handleCreateFormChange}
                    required
                    rows={2}
                    placeholder="Clinical findings and diagnosis..."
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Treatment */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Treatment <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="treatment"
                    value={createForm.treatment}
                    onChange={handleCreateFormChange}
                    required
                    rows={2}
                    placeholder="Treatment performed..."
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Prescription */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Prescription <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="prescription"
                    value={createForm.prescription}
                    onChange={handleCreateFormChange}
                    rows={2}
                    placeholder="Medications prescribed..."
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes <span className="text-gray-400 font-normal">(optional)</span>
                  </label>
                  <textarea
                    name="notes"
                    value={createForm.notes}
                    onChange={handleCreateFormChange}
                    rows={2}
                    placeholder="Additional clinical notes..."
                    className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                    {loading ? 'Saving...' : 'Save Record'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowCreateForm(false); setCreateForm(emptyForm); setError(null); }}
                    className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    Discard
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* Records list */}
      {records.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-xl px-6 py-12 text-center text-sm text-gray-400">
          No medical records found for this patient.
        </div>
      ) : (
        <div className="space-y-3">
          {records.map((record) => {
            const isExpanded = expandedId === record.id;
            const isEditing = editingId === record.id;
            const canEditThis = isDoctor && currentDoctorId === record.doctor_id;

            return (
              <div
                key={record.id}
                className="bg-white border border-gray-200 rounded-xl overflow-hidden"
              >
                {/* Record header */}
                <button
                  onClick={() => {
                    if (isEditing) return;
                    setExpandedId(isExpanded ? null : record.id);
                  }}
                  className="w-full px-6 py-4 flex items-center justify-between gap-4 hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <svg className="w-4 h-4 text-blue-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {formatDate(record.created_at)}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                        {record.diagnosis}
                      </p>
                    </div>
                  </div>
                  <svg
                    className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Expanded — view mode */}
                {isExpanded && !isEditing && (
                  <div className="border-t border-gray-100 px-6 py-5 space-y-4">
                    <RecordField label="Diagnosis">{record.diagnosis}</RecordField>
                    <RecordField label="Treatment">{record.treatment}</RecordField>
                    {record.prescription && (
                      <RecordField label="Prescription">{record.prescription}</RecordField>
                    )}
                    {record.notes && (
                      <RecordField label="Notes">{record.notes}</RecordField>
                    )}
                    {canEditThis && (
                      <div className="pt-2">
                        <button
                          onClick={() => startEditing(record)}
                          className="text-sm text-blue-700 hover:text-blue-900 font-medium px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                          Edit Record
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Expanded — edit mode */}
                {isExpanded && isEditing && (
                  <div className="border-t border-gray-100 px-6 py-5">
                    <form onSubmit={(e) => handleEditSubmit(e, record.id)} className="space-y-4">

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Linked Appointment
                        </label>
                        <select
                          name="appointment_id"
                          value={editForm.appointment_id}
                          onChange={handleEditFormChange}
                          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="">None</option>
                          {appointments.map((apt) => (
                            <option key={apt.id} value={apt.id}>
                              {formatAppointmentLabel(apt)}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Diagnosis <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="diagnosis"
                          value={editForm.diagnosis}
                          onChange={handleEditFormChange}
                          required
                          rows={2}
                          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Treatment <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="treatment"
                          value={editForm.treatment}
                          onChange={handleEditFormChange}
                          required
                          rows={2}
                          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Prescription <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                          name="prescription"
                          value={editForm.prescription}
                          onChange={handleEditFormChange}
                          rows={2}
                          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Notes <span className="text-gray-400 font-normal">(optional)</span>
                        </label>
                        <textarea
                          name="notes"
                          value={editForm.notes}
                          onChange={handleEditFormChange}
                          rows={2}
                          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
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
                          onClick={cancelEditing}
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
      )}
    </div>
  );
}

function RecordField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-sm text-gray-800 whitespace-pre-line">{children}</p>
    </div>
  );
}