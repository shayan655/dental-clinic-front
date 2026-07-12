'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Service, User } from '@/types';

interface Props {
  services: Service[];
  doctors: User[];
  isStaff: boolean;
  currentUserId: number;
}

type FormState = {
  patient_name: string;
  patient_email: string;
  service_id: string;
  doctor_id: string;
  date: string;
  time: string;
  notes: string;
};

const initialState: FormState = {
  patient_name: '',
  patient_email: '',
  service_id: '',
  doctor_id: '',
  date: '',
  time: '',
  notes: '',
};

export default function BookAppointmentForm({ services, doctors, isStaff, currentUserId }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormState>(initialState);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // CSRF cookie
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sanctum/csrf-cookie`, {
        credentials: 'include',
      });

      const payload = {
        service_id: Number(form.service_id),
        doctor_id: Number(form.doctor_id),
        scheduled_at: `${form.date}T${form.time}:00`,
        notes: form.notes || null,
        ...(isStaff
          ? { patient_name: form.patient_name, patient_email: form.patient_email }
          : { patient_id: currentUserId }),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.message ?? 'Something went wrong. Please try again.');
      }

      router.push('/portal/appointments');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  // Minimum date = today
  const today = new Date().toISOString().split('T')[0];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Patient fields — staff only */}
      {isStaff && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-4">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Patient Details
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="patient_name"
                value={form.patient_name}
                onChange={handleChange}
                required={isStaff}
                placeholder="e.g. Jane Smith"
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="patient_email"
                value={form.patient_email}
                onChange={handleChange}
                required={isStaff}
                placeholder="jane@example.com"
                className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </div>
      )}

      {/* Service */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service <span className="text-red-500">*</span>
        </label>
        <select
          name="service_id"
          value={form.service_id}
          onChange={handleChange}
          required
          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.duration_minutes} min
            </option>
          ))}
        </select>
      </div>

      {/* Doctor */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Doctor <span className="text-red-500">*</span>
        </label>
        <select
          name="doctor_id"
          value={form.doctor_id}
          onChange={handleChange}
          required
          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
        >
          <option value="">Select a doctor</option>
          {doctors.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      {/* Date & Time */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            min={today}
            className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="time"
            value={form.time}
            onChange={handleChange}
            required
            className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Notes <span className="text-gray-400 font-normal">(optional)</span>
        </label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows={3}
          placeholder="Any relevant details for the appointment..."
          className="w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Error */}
      {error && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
          <svg className="w-4 h-4 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
          </svg>
          {error}
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-700 hover:bg-blue-800 disabled:opacity-60 disabled:cursor-not-allowed text-white text-sm font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          {loading ? 'Booking...' : 'Book Appointment'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2.5 rounded-lg hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}