import { DashboardAppointment } from '@/types'
import AppointmentStatusBadge from './AppointmentStatusBadge'

export default function AppointmentsTable({ appointments }: { appointments: DashboardAppointment[] }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200">
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-base font-semibold text-gray-900">Today`s Appointments</h2>
        <p className="text-sm text-gray-500 mt-0.5">All scheduled visits for today</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50 text-left">
              <th className="px-6 py-3 font-medium text-gray-500">Time</th>
              <th className="px-6 py-3 font-medium text-gray-500">Patient</th>
              <th className="px-6 py-3 font-medium text-gray-500">Service</th>
              <th className="px-6 py-3 font-medium text-gray-500">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {appointments.map((apt) => (
              <tr key={apt.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 font-medium text-gray-900">{apt.time}</td>
                <td className="px-6 py-4 text-gray-700">{apt.patientName}</td>
                <td className="px-6 py-4 text-gray-700">{apt.service}</td>
                <td className="px-6 py-4">
                  <AppointmentStatusBadge status={apt.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}