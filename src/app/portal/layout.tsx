import { redirect } from 'next/navigation';
import Link from 'next/link';
import { getAuthUser } from '@/lib/auth';
import { api } from '@/lib/api';
import { Role, User } from '@/types';
import NavLink from '@/components/portal/NavLink';
import SignOutButton from '@/components/portal/SignOutButton';

type NavItem = {
  label: string;
  href: string;
  roles: Role[];
  badge?: number;
};

const FRONT_DESK: Role[] = ['super_admin', 'clinic_manager', 'receptionist'];

function getRoleLabel(user: User): string {
  const labels: Record<string, string> = {
    super_admin: 'Super Admin',
    clinic_manager: 'Clinic Manager',
    doctor: 'Doctor',
    receptionist: 'Receptionist',
    patient: 'Patient',
  };
  return labels[user.role] ?? user.role;
}

// The badge is a convenience: a failure here must never break the whole portal
async function getUnreadMessages(): Promise<number> {
  try {
    const res = await api.get<{ count: number }>('/api/contact-messages/unread-count');
    return res.count;
  } catch {
    return 0;
  }
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const unreadMessages = FRONT_DESK.includes(user.role) ? await getUnreadMessages() : 0;

  // Nav items and which roles can see them (the API enforces the real permissions)
  const navItems: NavItem[] = [
    {
      label: 'Dashboard',
      href: '/portal',
      roles: ['super_admin', 'clinic_manager', 'doctor', 'receptionist', 'patient'],
    },
    {
      label: 'Appointments',
      href: '/portal/appointments',
      roles: ['super_admin', 'clinic_manager', 'doctor', 'receptionist', 'patient'],
    },
    {
      label: 'Patients',
      href: '/portal/patients',
      roles: ['super_admin', 'clinic_manager', 'doctor', 'receptionist'],
    },
    ...(user.role === 'patient' && user.patient_id
      ? [
          {
            label: 'My Records',
            href: `/portal/patients/${user.patient_id}/records`,
            roles: ['patient'] as Role[],
          },
        ]
      : []),
    {
      label: 'Invoices',
      href: '/portal/invoices',
      roles: ['super_admin', 'clinic_manager', 'receptionist', 'patient'],
    },
    {
      label: 'Messages',
      href: '/portal/messages',
      roles: FRONT_DESK,
      badge: unreadMessages,
    },
    {
      label: 'Staff',
      href: '/portal/staff',
      roles: ['super_admin', 'clinic_manager'],
    },
    {
      label: 'Settings',
      href: '/portal/settings',
      roles: ['super_admin', 'clinic_manager'],
    },
    {
      label: 'Profile',
      href: '/portal/profile',
      roles: ['super_admin', 'clinic_manager', 'doctor', 'receptionist', 'patient'],
    },
  ];

  const visibleNavItems = navItems.filter((item) => item.roles.includes(user.role));

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-600">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            🦷
          </div>
          <Link href="/" className="text-white font-semibold text-base">DentalCare</Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNavItems.map((item) => (
            <NavLink key={item.href} href={item.href} label={item.label} badge={item.badge} />
          ))}
        </nav>

        {/* User info at bottom */}
        <div className="px-4 py-4 border-t border-blue-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm font-semibold shrink-0">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-white text-sm font-medium truncate">{user.name}</p>
              <p className="text-blue-300 text-xs truncate">{getRoleLabel(user)}</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-gray-800">
              Welcome back, {user.name.split(' ')[0]}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {new Date().toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: 'Europe/Amsterdam',
              })}
            </p>
          </div>

          <SignOutButton />
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}