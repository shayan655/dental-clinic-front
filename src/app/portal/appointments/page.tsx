import { api } from '@/lib/api'
import { Appointment, AppointmentsPageData } from '@/types'
import AppointmentsClient from '@/components/portal/appointments/AppointmentsClient'
import Link from 'next/link'

async function getAppointments(): Promise<AppointmentsPageData> {
  try {
    return await api.get('/api/appointments')
  } catch {
    const mock: Appointment[] = [
      {
        id: 1,
        patient_id: 1,
        doctor_id: 1,
        service_id: 1,
        duration_minutes: 60,
        status: 'confirmed',
        scheduled_at: '2025-07-07T09:00:00',
        notes: null,
        created_at: '2025-07-01T00:00:00',
        updated_at: '2025-07-01T00:00:00',
        patient: { id: 1, user_id: 1, name: 'Sarah Johnson', email: 'sarah@example.com', phone: '555-0001', date_of_birth: '1990-01-01', created_at: '', updated_at: '' },
        doctor:  { id: 1, name: 'Dr. Ahmed', email: 'ahmed@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 1, name: 'Cleaning', description: null, duration_minutes: 60, price: '80', created_at: '', updated_at: '' },
      },
      {
        id: 2,
        patient_id: 2,
        doctor_id: 1,
        service_id: 2,
        duration_minutes: 90,
        status: 'in_progress',
        scheduled_at: '2025-07-07T10:30:00',
        notes: 'Patient requested morning slot',
        created_at: '2025-07-01T00:00:00',
        updated_at: '2025-07-01T00:00:00',
        patient: { id: 2, user_id: 2, name: 'Mark Ellis', email: 'mark@example.com', phone: '555-0002', date_of_birth: '1985-05-15', created_at: '', updated_at: '' },
        doctor:  { id: 1, name: 'Dr. Ahmed', email: 'ahmed@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 2, name: 'Root Canal', description: null, duration_minutes: 90, price: '600', created_at: '', updated_at: '' },
      },
      {
        id: 3,
        patient_id: 3,
        doctor_id: 2,
        service_id: 1,
        duration_minutes: 60,
        status: 'pending',
        scheduled_at: '2025-07-07T12:00:00',
        notes: null,
        created_at: '2025-07-01T00:00:00',
        updated_at: '2025-07-01T00:00:00',
        patient: { id: 3, user_id: 3, name: 'Lina Bauer', email: 'lina@example.com', phone: '555-0003', date_of_birth: '1992-08-22', created_at: '', updated_at: '' },
        doctor:  { id: 2, name: 'Dr. Smith', email: 'smith@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 1, name: 'Checkup', description: null, duration_minutes: 60, price: '50', created_at: '', updated_at: '' },
      },
      {
        id: 4,
        patient_id: 4,
        doctor_id: 2,
        service_id: 3,
        duration_minutes: 45,
        status: 'completed',
        scheduled_at: '2025-07-06T14:00:00',
        notes: 'Follow up in 3 months',
        created_at: '2025-07-01T00:00:00',
        updated_at: '2025-07-01T00:00:00',
        patient: { id: 4, user_id: 4, name: 'Tom Nguyen', email: 'tom@example.com', phone: '555-0004', date_of_birth: '1978-03-10', created_at: '', updated_at: '' },
        doctor:  { id: 2, name: 'Dr. Smith', email: 'smith@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 3, name: 'Filling', description: null, duration_minutes: 45, price: '150', created_at: '', updated_at: '' },
      },
      {
        id: 5,
        patient_id: 5,
        doctor_id: 1,
        service_id: 4,
        duration_minutes: 30,
        status: 'cancelled',
        scheduled_at: '2025-07-06T15:30:00',
        notes: 'Patient cancelled last minute',
        created_at: '2025-07-01T00:00:00',
        updated_at: '2025-07-01T00:00:00',
        patient: { id: 5, user_id: 5, name: 'Emma Clarke', email: 'emma@example.com', phone: '555-0005', date_of_birth: '1995-11-30', created_at: '', updated_at: '' },
        doctor:  { id: 1, name: 'Dr. Ahmed', email: 'ahmed@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 4, name: 'Whitening', description: null, duration_minutes: 30, price: '200', created_at: '', updated_at: '' },
      },
    ]

    return { appointments: mock }
  }
}

export default async function AppointmentsPage() {
  const { appointments } = await getAppointments()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and track all clinic appointments.</p>
        </div>
        <Link
          href="/portal/appointments/new"
          className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors"
        >
          + New Appointment
        </Link>
      </div>

      <AppointmentsClient appointments={appointments} />
    </div>
  )
}