import { redirect, notFound } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Appointment, Service, User } from '@/types';
import AppointmentDetail from '@/components/portal/appointments/AppointmentDetail';
import Link from 'next/link';

async function getAppointment(id: string): Promise<Appointment | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/appointments/${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    // Mock fallback
    return {
      id: Number(id),
      patient_id: 1,
      doctor_id: 1,
      service_id: 2,
      duration_minutes: 45,
      status: 'pending',
      scheduled_at: '2025-08-10T10:30:00',
      notes: 'Patient requested morning slot.',
      patient: {
        id: 1,
        user_id: 1,
        name: 'Emma Johnson',
        email: 'emma@example.com',
        phone: '+31 6 12345678',
        date_of_birth: '1990-04-15',
        created_at: '',
        updated_at: '',
      },
      doctor: {
        id: 1,
        name: 'Dr. Sarah Mitchell',
        email: 'sarah@clinic.com',
        role: 'doctor',
        created_at: '',
        updated_at: '',
      },
      service: {
        id: 2,
        name: 'Teeth Cleaning',
        description: null,
        duration_minutes: 45,
        price: '80.00',
        created_at: '',
        updated_at: '',
      },
      created_at: '',
      updated_at: '',
    };
  }
}

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'General Checkup', description: null, duration_minutes: 30, price: '50.00', created_at: '', updated_at: '' },
      { id: 2, name: 'Teeth Cleaning', description: null, duration_minutes: 45, price: '80.00', created_at: '', updated_at: '' },
      { id: 3, name: 'Tooth Extraction', description: null, duration_minutes: 60, price: '150.00', created_at: '', updated_at: '' },
      { id: 4, name: 'Root Canal', description: null, duration_minutes: 90, price: '600.00', created_at: '', updated_at: '' },
      { id: 5, name: 'Teeth Whitening', description: null, duration_minutes: 60, price: '200.00', created_at: '', updated_at: '' },
    ];
  }
}

async function getDoctors(): Promise<User[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
      { id: 2, name: 'Dr. James Okafor', email: 'james@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
      { id: 3, name: 'Dr. Priya Nair', email: 'priya@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
    ];
  }
}

export default async function AppointmentDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const appointment = await getAppointment(params.id);
  if (!appointment) notFound();

  // Access guards
  if (user.role === 'patient' && appointment.patient_id !== user.id) {
    redirect('/portal/appointments');
  }
  if (user.role === 'doctor' && appointment.doctor_id !== user.id) {
    redirect('/portal/appointments');
  }

  const isStaff =
    user.role === 'clinic_manager' ||
    user.role === 'super_admin' ||
    user.role === 'receptionist';

  const canEdit = isStaff;
  const canCancel = isStaff || user.role === 'patient';
  const canUpdateNotes = isStaff || user.role === 'doctor';

  // Only prefetch services + doctors if the user can edit
  const [services, doctors] = canEdit
    ? await Promise.all([getServices(), getDoctors()])
    : [[], []];

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