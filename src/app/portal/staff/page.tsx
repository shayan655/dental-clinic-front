import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { User } from '@/types';
import StaffClient from '@/components/portal/staff/StaffClient';

async function getStaff(): Promise<User[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/staff`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@clinic.com', role: 'doctor', created_at: '2024-01-10T08:00:00', updated_at: '' },
      { id: 2, name: 'Dr. James Okafor', email: 'james@clinic.com', role: 'doctor', created_at: '2024-02-14T08:00:00', updated_at: '' },
      { id: 3, name: 'Dr. Priya Nair', email: 'priya@clinic.com', role: 'doctor', created_at: '2024-03-01T08:00:00', updated_at: '' },
      { id: 4, name: 'Nina Bakker', email: 'nina@clinic.com', role: 'receptionist', created_at: '2024-01-15T08:00:00', updated_at: '' },
      { id: 5, name: 'Tom de Vries', email: 'tom@clinic.com', role: 'receptionist', created_at: '2024-04-20T08:00:00', updated_at: '' },
      { id: 6, name: 'Laura Smits', email: 'laura@clinic.com', role: 'clinic_manager', created_at: '2023-11-01T08:00:00', updated_at: '' },
    ];
  }
}

export default async function StaffPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  if (
    user.role === 'patient' ||
    user.role === 'doctor' ||
    user.role === 'receptionist'
  ) {
    redirect('/portal');
  }

  const staff = await getStaff();
  const isSuperAdmin = user.role === 'super_admin';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <p className="text-sm text-gray-500 mt-1">{staff.length} staff members</p>
      </div>

      <StaffClient
        staff={staff}
        isSuperAdmin={isSuperAdmin}
      />
    </div>
  );
}