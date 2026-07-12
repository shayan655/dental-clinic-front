import { Appointment } from '@/types'
import AppointmentStatusBadge from '@/components/portal/dashboard/AppointmentStatusBadge'
import Link from 'next/link'

type Props = {
  appointments: Appointment[]
}

function formatDateTime(scheduledAt: string) {
  const date = new Date(scheduledAt)
  return {
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function AppointmentsTable({ appointments }: Props) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50 text-left">
            <th className="px-6 py-3 font-medium text-gray-500">Date & Time</th>
            <th className="px-6 py-3 font-medium text-gray-500">Patient</th>
            <th className="px-6 py-3 font-medium text-gray-500">Doctor</th>
            <th className="px-6 py-3 font-medium text-gray-500">Service</th>
            <th className="px-6 py-3 font-medium text-gray-500">Duration</th>
            <th className="px-6 py-3 font-medium text-gray-500">Status</th>
            <th className="px-6 py-3 font-medium text-gray-500"></th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {appointments.map(apt => {
            const { date, time } = formatDateTime(apt.scheduled_at)
            return (
              <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <p className="font-medium text-gray-900">{time}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{date}</p>
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {apt.patient?.name ?? '—'}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {apt.doctor?.name ?? '—'}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {apt.service?.name ?? '—'}
                </td>
                <td className="px-6 py-4 text-gray-700">
                  {apt.duration_minutes} min
                </td>
                <td className="px-6 py-4">
                  <AppointmentStatusBadge status={apt.status} />
                </td>
                <td className="px-6 py-4">
                  <Link
                    href={`/portal/appointments/${apt.id}`}
                    className="text-blue-700 hover:underline text-xs font-medium"
                  >
                    View
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}