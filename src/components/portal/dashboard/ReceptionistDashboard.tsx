import { ReceptionistDashboardData } from '@/types'
import StatCard from './StatCard'
import AppointmentsTable from './AppointmentsTable'

export default function ReceptionistDashboard({ data }: { data: ReceptionistDashboardData }) {
  const { stats, todaysAppointments } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Front Desk</h1>
        <p className="text-sm text-gray-500 mt-1">Today`s check-ins and appointments at a glance.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Appointments Today" value={stats.appointmentsToday} icon="📅" accent="blue"   />
        <StatCard label="Checked In" value={stats.checkedInCount} icon="✅" accent="green"  />
        <StatCard label="Pending Invoices" value={stats.pendingInvoices} icon="📄" accent="amber"  />
        <StatCard label="New Patients Today" value={stats.newPatientsToday} icon="🆕" accent="indigo" />
      </div>

      <AppointmentsTable appointments={todaysAppointments} />
    </div>
  )
}