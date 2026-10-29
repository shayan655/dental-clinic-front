import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { User } from '@/types';
import StaffClient from '@/components/portal/staff/StaffClient';

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

  const staff = (await api.get<{ data: User[] }>('/api/staff')).data;
  const isSuperAdmin = user.role === 'super_admin';
  const activeCount = staff.filter((s) => s.is_active !== false).length;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Staff</h1>
        <p className="text-sm text-gray-500 mt-1">
          {activeCount} active staff member{activeCount === 1 ? '' : 's'}
        </p>
      </div>

      <StaffClient staff={staff} isSuperAdmin={isSuperAdmin} />
    </div>
  );
}