'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api, getErrorMessage } from '@/lib/api';
import { Patient, Role, Service, User } from '@/types';
import { useQuery } from '@tanstack/react-query';

interface Props {
  services: Service[];
  doctors: User[];     // staff only
  patients: Patient[]; // staff and doctors
  role: Role;
  currentUserId: number;
}

type FormState = {
  patient_id: string;
  service_id: string;
  doctor_id: string; // '' = any available doctor
  date: string;
  time: string;
  notes: string;
};

const initialState: FormState = {
  patient_id: '',
  service_id: '',
  doctor_id: '',
  date: '',
  time: '',
  notes: '',
};

const inputClass =
  'w-full border text-black border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white';

export default function BookAppointmentForm({ services, doctors, patients, role, currentUserId }: Props) {
  const router = useRouter();
  const isStaff = role === 'clinic_manager' || role === 'super_admin' || role === 'receptionist';
  const needsPatient = role !== 'patient';

  const [form, setForm] = useState<FormState>(initialState);
  const [patientFilter, setPatientFilter] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Doctors always book with themselves
  const availabilityDoctorId = role === 'doctor' ? String(currentUserId) : form.doctor_id;

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      // changing anything that affects availability clears the chosen time
      ...(['service_id', 'doctor_id', 'date'].includes(name) ? { time: '' } : {}),
    }));
  }

  // Free times for the chosen service, day and doctor
  const slotsQuery = useQuery({
    queryKey: ['availability', form.date, form.service_id, availabilityDoctorId],
    queryFn: async () => {
      const params = new URLSearchParams({ date: form.date, service_id: form.service_id });
      if (availabilityDoctorId) params.set('doctor_id', availabilityDoctorId);

      const res = await api.get<{ data: string[] }>(`/api/availability?${params.toString()}`);
      return res.data;
    },
    enabled: Boolean(form.service_id && form.date),
    gcTime: 0, // never show a cached list: slots can be taken by someone else at any moment
  });

const slots = slotsQuery.data ?? [];

  const visiblePatients = useMemo(() => {
    const q = patientFilter.trim().toLowerCase();
    if (!q) return patients;
    return patients.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        String(p.id) === form.patient_id
    );
  }, [patients, patientFilter, form.patient_id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.time) {
      setError('Please choose one of the available times.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.post('/api/appointments', {
        service_id: Number(form.service_id),
        scheduled_at: `${form.date}T${form.time}:00`,
        notes: form.notes || null,
        ...(needsPatient ? { patient_id: Number(form.patient_id) } : {}),
        ...(isStaff && form.doctor_id ? { doctor_id: Number(form.doctor_id) } : {}),
      });

      router.push(role === 'patient' ? '/portal' : '/portal/appointments');
      router.refresh();
    } catch (err) {
      setError(getErrorMessage(err, 'Could not book the appointment. Please try again.'));
    } finally {
      setLoading(false);
    }
  }

  // Local date (not UTC) so "today" is correct late in the evening
  const today = new Date().toLocaleDateString('en-CA');

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Patient selector: staff and doctors */}
      {needsPatient && (
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-5 space-y-3">
          <p className="text-xs font-semibold text-blue-700 uppercase tracking-wide">Patient</p>
          {role === 'doctor' && (
            <p className="text-xs text-gray-500">You can book follow-ups for your own patients.</p>
          )}
          <input
            type="text"
            value={patientFilter}
            onChange={(e) => setPatientFilter(e.target.value)}
            placeholder="Search by name or email..."
            className={inputClass}
          />
          <select
            name="patient_id"
            value={form.patient_id}
            onChange={handleChange}
            required
            className={inputClass}
          >
            <option value="">Select a patient</option>
            {visiblePatients.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} — {p.email}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Service */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Service <span className="text-red-500">*</span>
        </label>
        <select name="service_id" value={form.service_id} onChange={handleChange} required className={inputClass}>
          <option value="">Select a service</option>
          {services.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} — {s.duration_minutes} min
            </option>
          ))}
        </select>
      </div>

      {/* Doctor: staff only */}
      {isStaff && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Doctor</label>
          <select name="doctor_id" value={form.doctor_id} onChange={handleChange} className={inputClass}>
            <option value="">Any available doctor</option>
            {doctors.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Date */}
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
          className={inputClass}
        />
      </div>

      {/* Free times */}
      {form.service_id && form.date && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Available times <span className="text-red-500">*</span>
          </label>

          {slotsQuery.isFetching ? (
            <p className="text-sm text-gray-400">Loading available times...</p>
          ) : slotsQuery.isError ? (
            <p className="text-sm text-red-600">
              {getErrorMessage(slotsQuery.error, 'Could not load available times.')}
            </p>
          ) : slots.length === 0 ? (
            <p className="text-sm text-gray-500">No free times on this day. Try another date.</p>
          ) : (
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
              {slots.map((slot) => (
                <button
                  key={slot}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, time: slot }))}
                  className={`text-sm py-2 rounded-lg border font-medium transition-colors ${
                    form.time === slot
                      ? 'bg-blue-700 text-white border-blue-700'
                      : 'border-gray-300 text-gray-700 hover:border-blue-700 hover:text-blue-700'
                  }`}
                >
                  {slot}
                </button>
              ))}
            </div>
          )}
        </div>
      )}

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
          className={`${inputClass} resize-none`}
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

      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={loading || !form.time}
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