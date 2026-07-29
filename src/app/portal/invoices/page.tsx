import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Invoice } from '@/types';
import InvoicesClient from '@/components/portal/invoices/InvoicesClient';

async function getInvoices(userId?: number): Promise<Invoice[]> {
  try {
    const url = userId
      ? `${process.env.NEXT_PUBLIC_API_URL}/api/invoices?patient_id=${userId}`
      : `${process.env.NEXT_PUBLIC_API_URL}/api/invoices`;
    const res = await fetch(url, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    const mockInvoices: Invoice[] = [
      {
        id: 1,
        patient_id: 1,
        appointment_id: 1,
        amount: 80,
        status: 'paid',
        issued_at: '2025-06-15T10:00:00',
        paid_at: '2025-06-15T10:30:00',
        patient: { id: 1, user_id: 1, name: 'Emma Johnson', email: 'emma@example.com', phone: '+31 6 11111111', date_of_birth: '1990-04-15', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
      {
        id: 2,
        patient_id: 2,
        appointment_id: 2,
        amount: 150,
        status: 'pending',
        issued_at: '2025-07-20T09:00:00',
        paid_at: null,
        patient: { id: 2, user_id: 2, name: 'Liam Patel', email: 'liam@example.com', phone: '+31 6 22222222', date_of_birth: '1985-09-23', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
      {
        id: 3,
        patient_id: 3,
        appointment_id: null,
        amount: 600,
        status: 'pending',
        issued_at: '2025-08-01T11:00:00',
        paid_at: null,
        patient: { id: 3, user_id: null, name: 'Sofia Müller', email: 'sofia@example.com', phone: '+31 6 33333333', date_of_birth: '1998-01-07', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
      {
        id: 4,
        patient_id: 1,
        appointment_id: 3,
        amount: 50,
        status: 'cancelled',
        issued_at: '2025-05-10T14:00:00',
        paid_at: null,
        patient: { id: 1, user_id: 1, name: 'Emma Johnson', email: 'emma@example.com', phone: '+31 6 11111111', date_of_birth: '1990-04-15', created_at: '', updated_at: '' },
        created_at: '',
        updated_at: '',
      },
    ];

    // Scope to patient's own invoices in mock too
    if (userId) {
      return mockInvoices.filter((inv) => inv.patient_id === userId);
    }
    return mockInvoices;
  }
}

export default async function InvoicesPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'doctor') redirect('/portal');

  const isPatient = user.role === 'patient';
  const invoices = await getInvoices(isPatient ? user.id : undefined);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isPatient ? 'Your billing history.' : 'All clinic invoices — display only, payment handled in person.'}
        </p>
      </div>

      <InvoicesClient invoices={invoices} isPatient={isPatient} />
    </div>
  );
}