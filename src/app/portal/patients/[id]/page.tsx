import { redirect, notFound } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Patient, Appointment } from '@/types';
import PatientProfile from '@/components/portal/patients/PatientProfile';
import Link from 'next/link';

async function getPatient(id: string): Promise<Patient | null> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data;
  } catch {
    return {
      id: Number(id),
      user_id: 1,
      name: 'Emma Johnson',
      email: 'emma@example.com',
      phone: '+31 6 11111111',
      date_of_birth: '1990-04-15',
      created_at: '',
      updated_at: '',
    };
  }
}

async function getPatientAppointments(id: string): Promise<Appointment[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/appointments?patient_id=${id}`,
      { credentials: 'include', cache: 'no-store' }
    );
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      {
        id: 1,
        patient_id: Number(id),
        doctor_id: 1,
        service_id: 2,
        duration_minutes: 45,
        status: 'completed',
        scheduled_at: '2025-06-15T09:00:00',
        notes: null,
        doctor: { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 2, name: 'Teeth Cleaning', description: null, duration_minutes: 45, price: '80.00', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
      {
        id: 2,
        patient_id: Number(id),
        doctor_id: 2,
        service_id: 1,
        duration_minutes: 30,
        status: 'confirmed',
        scheduled_at: '2025-08-20T11:00:00',
        notes: null,
        doctor: { id: 2, name: 'Dr. James Okafor', email: 'james@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
        service: { id: 1, name: 'General Checkup', description: null, duration_minutes: 30, price: '50.00', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
    ];
  }
}

export default async function PatientProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'patient' && String(user.id) !== id) redirect('/portal');

  const [patient, appointments] = await Promise.all([
    getPatient(id),
    getPatientAppointments(id),
  ]);

  if (!patient) notFound();

  const canEdit =
    user.role === 'receptionist' ||
    user.role === 'clinic_manager' ||
    user.role === 'super_admin';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/portal/patients" className="hover:text-blue-700 transition-colors">
            Patients
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">{patient.name}</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{patient.name}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {patient.user_id ? 'Registered account' : 'Staff-created profile — no account yet'}
            </p>
          </div>
          {user.role === 'doctor' && (
            <Link
              href={`/portal/patients/${id}/records`}
              className="text-sm text-blue-700 hover:text-blue-900 font-medium px-4 py-2 rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors shrink-0"
            >
              Medical Records
            </Link>
          )}
        </div>
      </div>

      <PatientProfile
        patient={patient}
        appointments={appointments}
        canEdit={canEdit}
      />
    </div>
  );
}