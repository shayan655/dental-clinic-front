import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import ProfileClient from '@/components/portal/profile/ProfileClient';

export default async function ProfilePage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account information and password.
        </p>
      </div>

      <ProfileClient user={user} />
    </div>
  );
}