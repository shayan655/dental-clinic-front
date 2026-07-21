import { PatientDashboardData } from '@/types'
import AppointmentStatusBadge from './AppointmentStatusBadge'
import Link from 'next/link'

export default function PatientDashboard({
  data,
  patientId,
}: {
  data: PatientDashboardData
  patientId: number
}) {
  const { nextAppointment, recentVisits } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Health Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Your upcoming appointments and visit history.</p>
      </div>

      <div>
        <h2 className="text-base font-semibold text-gray-900 mb-3">Next Appointment</h2>
        {nextAppointment ? (
          <div className="bg-blue-700 text-white rounded-xl p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <p className="text-blue-200 text-sm">Upcoming visit</p>
              <p className="text-xl font-bold">{nextAppointment.service}</p>
              <p className="text-blue-100 text-sm">with {nextAppointment.doctorName}</p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-blue-100 text-sm">{nextAppointment.date}</p>
              <p className="text-2xl font-bold">{nextAppointment.time}</p>
              <AppointmentStatusBadge status={nextAppointment.status} />
            </div>
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-6 text-center text-gray-500">
            <p className="text-2xl mb-2">📅</p>
            <p className="font-medium text-gray-700">No upcoming appointments</p>
            <p className="text-sm mt-1">Book one to get started.</p>
          </div>
        )}
        <Link
          href={`/portal/patients/${patientId}/records`}
          className="inline-block mt-3 text-sm text-blue-700 hover:text-blue-900 font-medium transition-colors"
        >
          View my medical records →
        </Link>
      </div>

      <div className="bg-white rounded-xl border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Visits</h2>
        </div>
        <div className="divide-y divide-gray-100">
          {recentVisits.map(visit => (
            <div key={visit.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-1">
              <div>
                <p className="font-medium text-gray-900">{visit.service}</p>
                <p className="text-sm text-gray-500 mt-0.5">{visit.notes}</p>
              </div>
              <p className="text-sm text-gray-400 shrink-0">{visit.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}