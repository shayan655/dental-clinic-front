import { DashboardData } from '@/types'
import StatCard from './StatCard'
import AppointmentsTable from './AppointmentsTable'

export default function ManagerDashboard({ data }: { data: DashboardData }) {
  const { stats, todaysAppointments } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Here`s what`s happening at the clinic today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Today's Appointments" value={stats.appointmentsToday} icon="📅" accent="blue"   />
        <StatCard label="Total Patients" value={stats.totalPatients} icon="👥" accent="green"  />
        <StatCard label="Pending Invoices" value={stats.pendingInvoices} icon="📄" accent="amber"  />
        <StatCard label="Doctors on Duty" value={stats.doctorsOnDuty} icon="🦷" accent="indigo" />
      </div>

      <AppointmentsTable appointments={todaysAppointments} />
    </div>
  )
}