import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import SettingsClient from '@/components/portal/settings/SettingsClient';

export type ClinicSettings = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

export type WorkingDay = {
  day: string;
  is_open: boolean;
  open_time: string;
  close_time: string;
};

export type ClinicService = {
  id: number;
  name: string;
  duration_minutes: number;
  price: string;
};

async function getClinicSettings(): Promise<ClinicSettings> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return {
      name: 'DentalCare Clinic',
      address: 'Hoofdstraat 12, 1234 AB Amsterdam',
      phone: '+31 20 123 4567',
      email: 'info@dentalcare.nl',
    };
  }
}

async function getWorkingHours(): Promise<WorkingDay[]> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings/hours`, {
      credentials: 'include',
      cache: 'no-store',
    });
    if (!res.ok) throw new Error();
    const json = await res.json();
    return json.data;
  } catch {
    return [
      { day: 'Monday',    is_open: true,  open_time: '08:00', close_time: '17:00' },
      { day: 'Tuesday',   is_open: true,  open_time: '08:00', close_time: '17:00' },
      { day: 'Wednesday', is_open: true,  open_time: '08:00', close_time: '17:00' },
      { day: 'Thursday',  is_open: true,  open_time: '08:00', close_time: '17:00' },
      { day: 'Friday',    is_open: true,  open_time: '08:00', close_time: '15:00' },
      { day: 'Saturday',  is_open: false, open_time: '09:00', close_time: '13:00' },
      { day: 'Sunday',    is_open: false, open_time: '09:00', close_time: '13:00' },
    ];
  }
}

async function getServices(): Promise<ClinicService[]> {
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
      { id: 1, name: 'General Checkup',  duration_minutes: 30, price: '50.00'  },
      { id: 2, name: 'Teeth Cleaning',   duration_minutes: 45, price: '80.00'  },
      { id: 3, name: 'Tooth Extraction', duration_minutes: 60, price: '150.00' },
      { id: 4, name: 'Root Canal',       duration_minutes: 90, price: '600.00' },
      { id: 5, name: 'Teeth Whitening',  duration_minutes: 60, price: '200.00' },
    ];
  }
}

export default async function SettingsPage() {
  const user = await getAuthUser();
  if (!user) redirect('/login');

  if (
    user.role === 'patient' ||
    user.role === 'doctor' ||
    user.role === 'receptionist'
  ) {
    redirect('/portal');
  }

  const [settings, workingHours, services] = await Promise.all([
    getClinicSettings(),
    getWorkingHours(),
    getServices(),
  ]);

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage clinic information, working hours, and services.
        </p>
      </div>

      <SettingsClient 
          settings={settings}
          services={services}
          workingHours={workingHours}
      />
    </div>
  );
}