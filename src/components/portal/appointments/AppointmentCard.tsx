import { Appointment } from '@/types'
import AppointmentStatusBadge from '@/components/portal/dashboard/AppointmentStatusBadge'
import Link from 'next/link'

type Props = {
  appointment: Appointment
}

function formatDateTime(scheduledAt: string) {
  const date = new Date(scheduledAt)
  return {
    date: date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    time: date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function AppointmentCard({ appointment: apt }: Props) {
  const { date, time } = formatDateTime(apt.scheduled_at)

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3">

      {/* Top row — time + status */}
      <div className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-gray-900">{time}</p>
          <p className="text-xs text-gray-400 mt-0.5">{date}</p>
        </div>
        <AppointmentStatusBadge status={apt.status} />
      </div>

      {/* Details */}
      <div className="space-y-1 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-500">Patient</span>
          <span className="text-gray-900 font-medium">{apt.patient?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Doctor</span>
          <span className="text-gray-900">{apt.doctor?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Service</span>
          <span className="text-gray-900">{apt.service?.name ?? '—'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-500">Duration</span>
          <span className="text-gray-900">{apt.duration_minutes} min</span>
        </div>
      </div>

      {/* Notes */}
      {apt.notes && (
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-2">
          {apt.notes}
        </p>
      )}

      {/* View link */}
      <Link
        href={`/portal/appointments/${apt.id}`}
        className="block text-center text-xs font-medium text-blue-700 hover:underline border-t border-gray-100 pt-2"
      >
        View details →
      </Link>

    </div>
  )
}