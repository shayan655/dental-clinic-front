import { DoctorDashboardData } from '@/types'
import StatCard from './StatCard'
import AppointmentsTable from './AppointmentsTable'

export default function DoctorDashboard({ data }: { data: DoctorDashboardData }) {
  const { stats, todaysAppointments } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your schedule and patients for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Appointments Today" value={stats.myAppointmentsToday} icon="📅" accent="blue"   />
        <StatCard label="My Total Patients"      value={stats.myTotalPatients}     icon="👥" accent="green"  />
        <StatCard label="Completed Today"        value={stats.completedToday}      icon="✅" accent="indigo" />
        <StatCard label="Pending Today"          value={stats.pendingToday}        icon="⏳" accent="amber"  />
      </div>

      <AppointmentsTable appointments={todaysAppointments} />
    </div>
  )
}