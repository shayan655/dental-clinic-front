import { redirect, notFound } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Patient, Appointment } from '@/types';
import PatientProfile from '@/components/portal/patients/PatientProfile';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

async function getPatient(id: string): Promise<Patient | null> {
  try {
    const res = await api.get<{ data: Patient }>(`/api/patients/${id}`);
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && (err.status === 403 || err.status === 404)) return null;
    throw err;
  }
}

async function getPatientAppointments(id: string): Promise<Appointment[]> {
  try {
    const res = await api.get<{ data: Appointment[] }>(`/api/appointments?patient_id=${id}`);
    return res.data;
  } catch {
    return []; // this endpoint arrives with the appointments step
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
  if (user.role === 'patient' && user.patient_id !== Number(id)) redirect('/portal');

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
          <Link href="/portal/patients" className="hover:text-blue-700 transition-colors">
            Patients
          </Link>
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