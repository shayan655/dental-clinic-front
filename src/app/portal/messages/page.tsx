import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { ContactMessage } from '@/types';
import MessagesClient from '@/components/portal/messages/MessagesClient';

export default async function MessagesPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'patient' || user.role === 'doctor') redirect('/portal');

  const res = await api.get<{ data: ContactMessage[]; unread_count: number }>('/api/contact-messages');
  const canDelete = user.role === 'clinic_manager' || user.role === 'super_admin';

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        <p className="text-sm text-gray-500 mt-1">
          {res.unread_count} unread message{res.unread_count === 1 ? '' : 's'} from the contact form.
        </p>
      </div>

      <MessagesClient messages={res.data} canDelete={canDelete} />
    </div>
  );
}