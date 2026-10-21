import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { Patient, Service, User } from '@/types';
import BookAppointmentForm from '@/components/portal/appointments/BookAppointmentForm';

export default async function NewAppointmentPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  const isStaff =
    user.role === 'clinic_manager' ||
    user.role === 'super_admin' ||
    user.role === 'receptionist';

  const [services, doctors, patients] = await Promise.all([
    api.get<{ data: Service[] }>('/api/services').then((r) => r.data),
    // only staff choose a doctor; everyone else gets "any available doctor" or themselves
    isStaff ? api.get<{ data: User[] }>('/api/doctors').then((r) => r.data) : Promise.resolve([] as User[]),
    // patients book for themselves, so they don't need the list
    user.role === 'patient'
      ? Promise.resolve([] as Patient[])
      : api.get<{ data: Patient[] }>('/api/patients').then((r) => r.data),
  ]);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Choose a service and day, then pick one of the free times.
        </p>
      </div>

      <BookAppointmentForm
        services={services}
        doctors={doctors}
        patients={patients}
        role={user.role}
        currentUserId={user.id}
      />
    </div>
  );
}