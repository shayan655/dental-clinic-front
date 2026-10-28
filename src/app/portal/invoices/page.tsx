import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { Invoice, Patient } from '@/types';
import InvoicesClient from '@/components/portal/invoices/InvoicesClient';

export default async function InvoicesPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');
  if (user.role === 'doctor') redirect('/portal');

  const isPatient = user.role === 'patient';

  // The API already limits a patient to their own invoices
  const [invoices, patients] = await Promise.all([
    api.get<{ data: Invoice[] }>('/api/invoices').then((r) => r.data),
    isPatient
      ? Promise.resolve([] as Patient[])
      : api.get<{ data: Patient[] }>('/api/patients').then((r) => r.data),
  ]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Invoices</h1>
        <p className="text-sm text-gray-500 mt-1">
          {isPatient
            ? 'Your billing history.'
            : 'Clinic invoices. Payments are taken in person and recorded here.'}
        </p>
      </div>

      <InvoicesClient invoices={invoices} isPatient={isPatient} patients={patients} />
    </div>
  );
}