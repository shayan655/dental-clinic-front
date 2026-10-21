import { api } from '@/lib/api'
import { Appointment } from '@/types'
import AppointmentsClient from '@/components/portal/appointments/AppointmentsClient'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { getAuthUser } from '@/lib/auth'

async function getAppointments(): Promise<Appointment[]> {
  const res = await api.get<{ data: Appointment[] }>('/api/appointments')
  return res.data
}

export default async function AppointmentsPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const appointments = await getAppointments()

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