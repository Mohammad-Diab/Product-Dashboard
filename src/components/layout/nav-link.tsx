'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavLinkProps = {
  href: string;
  children: React.ReactNode;
};

export function NavLink({ href, children }: NavLinkProps) {
  const pathname = usePathname();
  
  // Handle dashboard routes (both / and /dashboard should be active together)
  const isDashboard = href === '/' || href === '/dashboard';
  const isOnDashboard = pathname === '/' || pathname === '/dashboard';
  
  // For dashboard links, active if on either dashboard route
  // For other links, active if exact match or starts with href/ (to avoid root path conflict)
  const isActive = isDashboard 
    ? isOnDashboard
    : pathname === href || pathname.startsWith(href + '/');

  return (
    <Link
      href={href}
      className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors ${
        isActive
          ? 'text-blue-600 border-blue-200'
          : 'text-gray-700 hover:text-blue-600'
      }`}
    >
      {children}
    </Link>
  );
}
