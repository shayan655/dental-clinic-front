import DoctorDashboard from '@/components/portal/dashboard/DoctorDashboard'
import ManagerDashboard from '@/components/portal/dashboard/ManagerDashboard'
import PatientDashboard from '@/components/portal/dashboard/PatientDashboard'
import ReceptionistDashboard from '@/components/portal/dashboard/ReceptionistDashboard'
import { api } from '@/lib/api'
import { getAuthUser } from '@/lib/auth'
import { DashboardData, DoctorDashboardData, PatientDashboardData, ReceptionistDashboardData } from '@/types'

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
        { id: 1, date: '12 Jun 2025', service: 'Cleaning', notes: 'Good condition, follow up in 6 months.' },
        { id: 2, date: '3 Mar 2025', service: 'Filling', notes: 'Lower left molar filled successfully.' },
        { id: 3, date: '10 Jan 2025', service: 'Consultation', notes: 'X-ray taken, no issues found.' },
      ],
    }
  }
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