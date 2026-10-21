import { redirect, notFound } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { api, ApiError } from '@/lib/api';
import { Appointment, MedicalRecord, Patient } from '@/types';
import MedicalRecords from '@/components/portal/patients/MedicalRecords';

async function loadPage(id: string) {
  try {
    const [patient, records, appointments] = await Promise.all([
      api.get<{ data: Patient }>(`/api/patients/${id}`).then((r) => r.data),
      api.get<{ data: MedicalRecord[] }>(`/api/patients/${id}/records`).then((r) => r.data),
      api.get<{ data: Appointment[] }>(`/api/appointments?patient_id=${id}`).then((r) => r.data),
    ]);
    return { patient, records, appointments };
  } catch (err) {
    if (err instanceof ApiError && (err.status === 403 || err.status === 404)) return null;
    throw err;
  }
}

export default async function MedicalRecordsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const user = await getAuthUser();
  if (!user) redirect('/login');

  if (
    user.role === 'receptionist' ||
    user.role === 'clinic_manager' ||
    user.role === 'super_admin'
  ) {
    redirect('/portal');
  }

  if (user.role === 'patient' && user.patient_id !== Number(id)) {
    redirect('/portal');
  }

  const data = await loadPage(id);
  if (!data) notFound();

  const { patient, records, appointments } = data;
  const isDoctor = user.role === 'doctor';

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <Link href="/portal/patients" className="hover:text-blue-700 transition-colors">
            Patients
          </Link>
          <span>/</span>
          <Link href={`/portal/patients/${id}`} className="hover:text-blue-700 transition-colors">
            {patient.name}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Medical Records</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-sm text-gray-500 mt-1">{patient.name}</p>
      </div>

      <MedicalRecords
        records={records}
        appointments={appointments}
        isDoctor={isDoctor}
        currentDoctorId={isDoctor ? user.id : null}
        patientId={Number(id)}
      />
    </div>
  );
}