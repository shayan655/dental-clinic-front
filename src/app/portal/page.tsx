import { api } from '@/lib/api'
import { AppointmentStatus } from '@/types'

// --- Types (local to this file for now) ---
type DashboardStats = {
  appointmentsToday: number
  totalPatients: number
  pendingInvoices: number
  doctorsOnDuty: number
}

type DashboardAppointment = {
  id: number
  patientName: string
  time: string
  service: string
  status: AppointmentStatus
}

type DashboardData = {
  stats: DashboardStats
  todaysAppointments: DashboardAppointment[]
}

// --- Data fetching ---
async function getDashboardData(): Promise<DashboardData> {
  try {
    return await api.get('/api/dashboard/manager')
  } catch {
    return {
      stats: {
        appointmentsToday: 8,
        totalPatients: 124,
        pendingInvoices: 3,
        doctorsOnDuty: 2,
      },
      todaysAppointments: [
        { id: 1, patientName: 'Sarah Johnson', time: '09:00', service: 'Cleaning', status: 'confirmed'},
        { id: 2, patientName: 'Mark Ellis',    time: '10:30', service: 'Root Canal', status: 'checked_in'},
        { id: 3, patientName: 'Lina Bauer',    time: '12:00', service: 'Checkup', status: 'checked_in'},
        { id: 4, patientName: 'Tom Nguyen',    time: '14:00', service: 'Filling', status: 'confirmed'},
      ],
    }
  }
}

// --- Components ---
type AccentColor = 'blue' | 'green' | 'amber' | 'indigo'

const accentClasses: Record<AccentColor, { bg: string; text: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-600'   },
  green:  { bg: 'bg-green-50',  text: 'text-green-600'  },
  amber:  { bg: 'bg-amber-50',  text: 'text-amber-600'  },
  indigo: { bg: 'bg-indigo-50', text: 'text-indigo-600' },
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string
  value: number
  icon: string
  accent: AccentColor
}) {
  const { bg, text } = accentClasses[accent]

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex items-start gap-4 shadow-xl">
      <div className={`${bg} ${text} text-2xl rounded-lg p-2`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
      </div>
    </div>
  )
}

// --- Page ---
export default async function DashboardPage() {
  const { stats, todaysAppointments } = await getDashboardData()

  return (
    <div className="space-y-8">
          <div>
               <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
               <p className="text-sm text-gray-500 mt-1">Here is what is happening at the clinic today.</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
               <StatCard
                    label="Today's Appointments"
                    value={stats.appointmentsToday}
                    icon="📅"
                    accent="blue"
               />
               <StatCard
                    label="Total Patients"
                    value={stats.totalPatients}
                    icon="👥"
                    accent="green"
               />
               <StatCard
                    label="Pending Invoices"
                    value={stats.pendingInvoices}
                    icon="📄"
                    accent="amber"
               />
               <StatCard
                    label="Doctors on Duty"
                    value={stats.doctorsOnDuty}
                    icon="🦷"
                    accent="indigo"
               />
          </div>

          {/* Appointments table — we'll build this after */}
    </div>
  )
}