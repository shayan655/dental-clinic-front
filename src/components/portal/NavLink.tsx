'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface Props {
  href: string;
  label: string;
  badge?: number;
}

export default function NavLink({ href, label, badge = 0 }: Props) {
  const pathname = usePathname();

  // The dashboard only matches exactly, everything else also matches its sub-pages
  const isActive =
    href === '/portal' ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
        isActive
          ? 'bg-blue-600 text-white font-medium'
          : 'text-blue-100 hover:bg-blue-600 hover:text-white'
      }`}
    >
      <span>{label}</span>
      {badge > 0 && (
        <span className="bg-white text-blue-700 text-xs font-semibold rounded-full min-w-5 h-5 px-1.5 flex items-center justify-center">
          {badge > 99 ? '99+' : badge}
        </span>
      )}
    </Link>
  );
}