import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { api, ApiError } from '@/lib/api';
import { Appointment, Service, User } from '@/types';
import AppointmentDetail from '@/components/portal/appointments/AppointmentDetail';

async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const res = await api.get<{ data: Appointment }>(`/api/appointments/${id}`);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 403 || err.status === 404)) return null;
    throw err;
  }
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const appointment = await getAppointment(id);
  if (!appointment) notFound();

  // Same rules as the API, so the page doesn't render for the wrong person
  if (user.role === 'patient' && appointment.patient_id !== user.patient_id) notFound();
  if (user.role === 'doctor' && appointment.doctor_id !== user.id) notFound();

  const isStaff =
    user.role === 'clinic_manager' ||
    user.role === 'super_admin' ||
    user.role === 'receptionist';

  const canEdit = isStaff;
  const canCancel = isStaff || user.role === 'patient';
  const canUpdateNotes = isStaff || user.role === 'doctor';

  const [services, doctors] = canEdit
    ? await Promise.all([
        api.get<{ data: Service[] }>('/api/services').then((r) => r.data),
        api.get<{ data: User[] }>('/api/doctors').then((r) => r.data),
      ])
    : [[] as Service[], [] as User[]];

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/portal/appointments" className="hover:text-blue-700 transition-colors">
            Appointments
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">#{appointment.id}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Appointment Details</h1>
      </div>

      <AppointmentDetail
        appointment={appointment}
        services={services}
        doctors={doctors}
        canEdit={canEdit}
        canCancel={canCancel}
        canUpdateNotes={canUpdateNotes}
        isPatient={user.role === 'patient'}
      />
    </div>
  );
}