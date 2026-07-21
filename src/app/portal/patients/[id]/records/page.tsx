import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { MedicalRecord, Appointment } from '@/types';
import MedicalRecords from '@/components/portal/patients/MedicalRecords';
import Link from 'next/link';

async function getPatientName(id: string): Promise<string> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data.name;
  } catch {
    return 'Emma Johnson';
  }
}

async function getMedicalRecords(id: string): Promise<MedicalRecord[]> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/patients/${id}/records`,
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
        appointment_id: 1,
        diagnosis: 'Mild gingivitis with early-stage plaque buildup.',
        treatment: 'Professional cleaning performed. Scaling and polishing completed.',
        prescription: 'Chlorhexidine mouthwash 0.12% — twice daily for 2 weeks.',
        notes: 'Patient advised to improve flossing technique. Follow-up in 6 months.',
        created_at: '2025-06-15T09:45:00',
        updated_at: '2025-06-15T09:45:00',
      },
      {
        id: 2,
        patient_id: Number(id),
        doctor_id: 2,
        appointment_id: 2,
        diagnosis: 'Routine checkup — no issues found.',
        treatment: 'Examination and X-rays taken. No cavities detected.',
        prescription: null,
        notes: null,
        created_at: '2025-08-20T11:30:00',
        updated_at: '2025-08-20T11:30:00',
      },
    ];
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
        status: 'completed',
        scheduled_at: '2025-08-20T11:00:00',
        notes: null,
        service: { id: 1, name: 'General Checkup', description: null, duration_minutes: 30, price: '50.00', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
    ];
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

  if (user.role === 'patient' && String(user.id) !== id) {
    console.log(user.role, user.id, (await params).id)
    redirect('/portal');
  }

  const [patientName, records, appointments] = await Promise.all([
    getPatientName(id),
    getMedicalRecords(id),
    getPatientAppointments(id),
  ]);

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
            {patientName}
          </Link>
          <span>/</span>
          <span className="text-gray-900 font-medium">Medical Records</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Medical Records</h1>
        <p className="text-sm text-gray-500 mt-1">{patientName}</p>
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