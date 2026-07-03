import { redirect } from 'next/navigation';
import { getAuthUser } from '@/lib/auth';
import { User } from '@/types';
import Link from 'next/link';

// Nav items and which roles can see them
const navItems = [
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
  {
    label: 'Invoices',
    href: '/portal/invoices',
    roles: ['super_admin', 'clinic_manager', 'receptionist', 'patient'],
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

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getAuthUser();

  if (!user) {
    redirect('/login');
  }

  const visibleNavItems = navItems.filter((item) =>
    item.roles.includes(user.role)
  );

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-blue-700 flex flex-col">
        {/* Logo */}
        <div className="flex items-center gap-3 px-6 py-5 border-b border-blue-600">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center shrink-0">
            🦷
          </div>
          <Link href='/' className="text-white font-semibold text-base">DentalCare</Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1">
          {visibleNavItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-blue-100 hover:bg-blue-600 hover:text-white transition"
            >
              {item.label}
            </a>
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
              })}
            </p>
          </div>

          <a
            href="/api/logout"
            className="text-xs text-gray-500 hover:text-red-500 transition font-medium"
          >
            Sign out
          </a>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
}