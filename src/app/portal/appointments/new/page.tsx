import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { Service, User } from '@/types';
import BookAppointmentForm from '@/components/portal/appointments/BookAppointmentForm';

async function getServices(): Promise<Service[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/services`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'General Checkup', description: null, duration_minutes: 30, price: '50.00', created_at: '', updated_at: '' },
      { id: 2, name: 'Teeth Cleaning', description: null, duration_minutes: 45, price: '80.00', created_at: '', updated_at: '' },
      { id: 3, name: 'Tooth Extraction', description: null, duration_minutes: 60, price: '150.00', created_at: '', updated_at: '' },
      { id: 4, name: 'Root Canal', description: null, duration_minutes: 90, price: '600.00', created_at: '', updated_at: '' },
      { id: 5, name: 'Teeth Whitening', description: null, duration_minutes: 60, price: '200.00', created_at: '', updated_at: '' },
    ];
  }
}

async function getDoctors(): Promise<User[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/doctors`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { id: 1, name: 'Dr. Sarah Mitchell', email: 'sarah@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
      { id: 2, name: 'Dr. James Okafor', email: 'james@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
      { id: 3, name: 'Dr. Priya Nair', email: 'priya@clinic.com', role: 'doctor', created_at: '', updated_at: '' },
    ];
  }
}

export default async function NewAppointmentPage() {
  const user = await getAuthUser();

  if (!user) redirect('/login');

  const [services, doctors] = await Promise.all([getServices(), getDoctors()]);

  const isStaff =
    user.role === 'clinic_manager' ||
    user.role === 'super_admin' ||
    user.role === 'doctor' ||
    user.role === 'receptionist';

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Book Appointment</h1>
        <p className="text-sm text-gray-500 mt-1">
          Fill in the details below to schedule a new appointment.
        </p>
      </div>

      <BookAppointmentForm
        services={services}
        doctors={doctors}
        isStaff={isStaff}
        currentUserId={user.id}
      />
    </div>
  );
}