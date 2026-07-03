import { api } from '@/lib/api'
import { getAuthUser } from '@/lib/auth'
import { AppointmentStatus } from '@/types'

// --- Types (local to this file for now) ---
type DashboardAppointment = {
  id: number
  patientName: string
  time: string
  service: string
  status: AppointmentStatus
}

type DashboardStats = {
  appointmentsToday: number
  totalPatients: number
  pendingInvoices: number
  doctorsOnDuty: number
}

type DashboardData = {
  stats: DashboardStats
  todaysAppointments: DashboardAppointment[]
}

type DoctorStats = {
  myAppointmentsToday: number
  myTotalPatients: number
  completedToday: number
  pendingToday: number
}

type DoctorDashboardData = {
  stats: DoctorStats
  todaysAppointments: DashboardAppointment[]
}

type ReceptionistStats = {
  appointmentsToday: number
  checkedInCount: number
  pendingInvoices: number
  newPatientsToday: number
}

type ReceptionistDashboardData = {
  stats: ReceptionistStats
  todaysAppointments: DashboardAppointment[]
}

type PatientUpcomingAppointment = {
  id: number
  date: string
  time: string
  service: string
  doctorName: string
  status: AppointmentStatus
}

type PatientRecentVisit = {
  id: number
  date: string
  service: string
  notes: string
}

type PatientDashboardData = {
  nextAppointment: PatientUpcomingAppointment | null
  recentVisits: PatientRecentVisit[]
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

async function getDoctorDashboardData(): Promise<DoctorDashboardData> {
  try {
    return await api.get('/api/dashboard/doctor')
  } catch {
    return {
      stats: {
        myAppointmentsToday: 5,
        myTotalPatients: 48,
        completedToday: 2,
        pendingToday: 3,
      },
      todaysAppointments: [
        { id: 1, patientName: 'Sarah Johnson', time: '09:00', service: 'Cleaning',   status: 'completed'   },
        { id: 2, patientName: 'Mark Ellis',    time: '10:30', service: 'Root Canal', status: 'in_progress' },
        { id: 3, patientName: 'Lina Bauer',    time: '12:00', service: 'Checkup',   status: 'confirmed'   },
        { id: 4, patientName: 'Tom Nguyen',    time: '14:00', service: 'Filling',   status: 'confirmed'   },
        { id: 5, patientName: 'Emma Clarke',   time: '15:30', service: 'Whitening', status: 'pending'     },
      ],
    }
  }
}

async function getReceptionistDashboardData(): Promise<ReceptionistDashboardData> {
  try {
    return await api.get('/api/dashboard/receptionist')
  } catch {
    return {
      stats: {
        appointmentsToday: 8,
        checkedInCount: 3,
        pendingInvoices: 5,
        newPatientsToday: 2,
      },
      todaysAppointments: [
        { id: 1, patientName: 'Sarah Johnson', time: '09:00', service: 'Cleaning',   status: 'completed'   },
        { id: 2, patientName: 'Mark Ellis',    time: '10:30', service: 'Root Canal', status: 'in_progress' },
        { id: 3, patientName: 'Lina Bauer',    time: '12:00', service: 'Checkup',   status: 'confirmed'   },
        { id: 4, patientName: 'Tom Nguyen',    time: '14:00', service: 'Filling',   status: 'pending'     },
      ],
    }
  }
}

async function getPatientDashboardData(): Promise<PatientDashboardData> {
  try {
    return await api.get('/api/dashboard/patient')
  } catch {
    return {
      nextAppointment: {
        id: 1,
        date: 'Monday, 7 July 2025',
        time: '10:30',
        service: 'Routine Checkup',
        doctorName: 'Dr. Ahmed',
        status: 'confirmed',
      },
      recentVisits: [
        { id: 1, date: '12 Jun 2025', service: 'Cleaning',      notes: 'Good condition, follow up in 6 months.' },
        { id: 2, date: '3 Mar 2025',  service: 'Filling',       notes: 'Lower left molar filled successfully.'  },
        { id: 3, date: '10 Jan 2025', service: 'Consultation',  notes: 'X-ray taken, no issues found.'          },
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

function AppointmentStatusBadge({ status }: { status: AppointmentStatus }) {
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

function ManagerDashboard({ data }: { data: DashboardData }) {
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

function DoctorDashboard({ data }: { data: DoctorDashboardData }) {
  const { stats, todaysAppointments } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Your schedule and patients for today.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My Appointments Today" value={stats.myAppointmentsToday} icon="📅" accent="blue"   />
        <StatCard label="My Total Patients" value={stats.myTotalPatients} icon="👥" accent="green"  />
        <StatCard label="Completed Today" value={stats.completedToday} icon="✅" accent="indigo" />
        <StatCard label="Pending Today" value={stats.pendingToday} icon="⏳" accent="amber"  />
      </div>

      <AppointmentsTable appointments={todaysAppointments} />
    </div>
  )
}

function ReceptionistDashboard({ data }: { data: ReceptionistDashboardData }) {
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

function PatientDashboard({ data }: { data: PatientDashboardData }) {
  const { nextAppointment, recentVisits } = data
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Health Portal</h1>
        <p className="text-sm text-gray-500 mt-1">Your upcoming appointments and visit history.</p>
      </div>

      {/* Next appointment */}
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
      </div>

      {/* Recent visits */}
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

function AppointmentsTable({ appointments }: { appointments: DashboardAppointment[] }) {
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
                <td className="px-6 py-4"><AppointmentStatusBadge status={apt.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

// --- Page ---
export default async function DashboardPage() {
  const user = await getAuthUser()
  const role = user?.role ?? 'patient'

  if (role === 'doctor') {
    const data = await getDoctorDashboardData()
    return <DoctorDashboard data={data} />
  }

  if (role === 'receptionist') {
    const data = await getReceptionistDashboardData()
    return <ReceptionistDashboard data={data} />
  }

  if (role === 'patient') {
    const data = await getPatientDashboardData()
    return <PatientDashboard data={data} />
  }

  // manager + super_admin fall through to here
  const data = await getDashboardData()
  return <ManagerDashboard data={data} />
}