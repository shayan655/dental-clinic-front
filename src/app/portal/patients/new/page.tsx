import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import NewPatientForm from '@/components/portal/patients/NewPatientForm';

export default async function NewPatientPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'patient') redirect('/portal');
  if (user.role === 'doctor') redirect('/portal/patients');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
          <a href="/portal/patients" className="hover:text-blue-700 transition-colors">
            Patients
          </a>
          <span>/</span>
          <span className="text-gray-900 font-medium">New Patient</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Register New Patient</h1>
        <p className="text-sm text-gray-500 mt-1">
          Create a patient profile on their behalf. They can claim this account later when they register.
        </p>
      </div>

      <NewPatientForm />
    </div>
  );
}