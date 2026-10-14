import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Patient } from '@/types';
import PatientsClient from '@/components/portal/patients/PatientsClient';
import Link from 'next/link';
import { api, ApiError } from '@/lib/api';

async function getPatients(): Promise<Patient[]> {
  try {
    const res = await api.get<{ data: Patient[] }>('/api/patients');
    return res.data;
  } catch (err) {
    if (err instanceof ApiError && err.status === 404) return [];
    throw err;
  }
}

export default async function PatientsPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'patient') redirect('/portal');

  const patients = await getPatients();

  const canCreatePatient =
    user.role === 'receptionist' ||
    user.role === 'clinic_manager' ||
    user.role === 'super_admin';

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
          <p className="text-sm text-gray-500 mt-1">{patients.length} registered patients</p>
        </div>
        {canCreatePatient && (
          <Link
            href="/portal/patients/new"
            className="bg-blue-700 hover:bg-blue-800 text-white text-sm font-medium px-4 py-2.5 rounded-lg transition-colors"
          >
            + New Patient
          </Link>
        )}
      </div>

      <PatientsClient patients={patients} />
    </div>
  );
}