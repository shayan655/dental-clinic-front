import { redirect } from 'next/navigation'
import DoctorDashboard from '@/components/portal/dashboard/DoctorDashboard'
import ManagerDashboard from '@/components/portal/dashboard/ManagerDashboard'
import PatientDashboard from '@/components/portal/dashboard/PatientDashboard'
import ReceptionistDashboard from '@/components/portal/dashboard/ReceptionistDashboard'
import { api } from '@/lib/api'
import { getAuthUser } from '@/lib/auth'
import {
  DashboardData,
  DoctorDashboardData,
  PatientDashboardData,
  ReceptionistDashboardData,
} from '@/types'

export default async function DashboardPage() {
  const user = await getAuthUser()
  if (!user) redirect('/login')

  if (user.role === 'doctor') {
    const data = await api.get<DoctorDashboardData>('/api/dashboard/doctor')
    return <DoctorDashboard data={data} />
  }

  if (user.role === 'receptionist') {
    const data = await api.get<ReceptionistDashboardData>('/api/dashboard/receptionist')
    return <ReceptionistDashboard data={data} />
  }

  if (user.role === 'patient') {
    const data = await api.get<PatientDashboardData>('/api/dashboard/patient')
    return <PatientDashboard data={data} patientId={user.patient_id ?? 0} />
  }

  // manager + super_admin
  const data = await api.get<DashboardData>('/api/dashboard/manager')
  return <ManagerDashboard data={data} />
}