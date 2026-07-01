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
        { id: 2, patientName: 'Mark Ellis',    time: '10:30', service: 'Root Canal', status: 'pending'},
        { id: 3, patientName: 'Lina Bauer',    time: '12:00', service: 'Checkup', status: 'pending'},
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

function AppoinmentStatusBadge({ status }: { status: AppointmentStatus }) {
  const styles: Record<AppointmentStatus, string> = {
    pending: 'bg-amber-50 text-amber-700',
    confirmed: 'bg-blue-50 text-blue-700',
    in_progress: 'bg-indigo-50 text-indigo-700',
    completed: 'bg-green-50 text-green-700',
    cancelled: 'bg-red-50 text-red-700',
  }

  const labels: Record<AppointmentStatus, string> = {
    pending: 'pending',
    confirmed: 'confirmed',
    in_progress: 'in_progress',
    completed: 'completed',
    cancelled: 'cancelled',
  }

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}>
      {labels[status]}
    </span>
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

          {/* Today's Appointments */}
          <div className=' bg-white rounded-xl border border-gray-200'>
            <div className='px-6 py-4 border-b border-gray-100'>
              <h2 className='text-base font-semibold text-gray-900'>Today`s Appointments</h2>
              <p className='text-sm text-gray-500 mt-0.5'>All scheduled visits for today</p>
            </div>

            <div className='overflow-x-auto'>
              <table className='w-full text-sm'>
                <thead>
                  <tr className='border-b border-gray-100 bg-gray-50 text-left'>
                    <th className="px-6 py-3 font-medium text-gray-500">Time</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Patient</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Service</th>
                    <th className="px-6 py-3 font-medium text-gray-500">Status</th>
                  </tr>
                </thead>
                <tbody className='divide-y divide-gray-100'>
                  {todaysAppointments.map((apt) => (
                    <tr key={apt.id} className='hover:bg-gray-50 transition-colors'>
                      <td className='px-6 py-4 font-medium text-gray-900'>{apt.time}</td>
                      <td className='px-6 py-4 text-gray-700'>{apt.patientName}</td>
                      <td className='px-6 py-4 text-gray-700'>{apt.service}</td>
                      <td className='px-6 py-4'>
                        <AppoinmentStatusBadge status={apt.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
    </div>
  )
}