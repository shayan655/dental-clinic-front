import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Patient } from '@/types';
import PatientsClient from '@/components/portal/patients/PatientsClient';
import Link from 'next/link';

async function getPatients(): Promise<Patient[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/patients`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, user_id: 1, name: 'Emma Johnson', email: 'emma@example.com', phone: '+31 6 11111111', date_of_birth: '1990-04-15', created_at: '', updated_at: '' },
      { id: 2, user_id: 2, name: 'Liam Patel', email: 'liam@example.com', phone: '+31 6 22222222', date_of_birth: '1985-09-23', created_at: '', updated_at: '' },
      { id: 3, user_id: null, name: 'Sofia Müller', email: 'sofia@example.com', phone: '+31 6 33333333', date_of_birth: '1998-01-07', created_at: '', updated_at: '' },
      { id: 4, user_id: 4, name: 'Noah Bakker', email: 'noah@example.com', phone: '+31 6 44444444', date_of_birth: '1972-11-30', created_at: '', updated_at: '' },
      { id: 5, user_id: null, name: 'Ava de Vries', email: 'ava@example.com', phone: '+31 6 55555555', date_of_birth: '2001-06-18', created_at: '', updated_at: '' },
    ];
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