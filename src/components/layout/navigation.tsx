'use client';

import { ROUTES } from '@/lib/routes';
import { NavLink } from './nav-link';
import { LogoutButton } from './logout-button';
import { useRole } from '@/features/auth';

export function Navigation() {
  const { isAdmin } = useRole();

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex space-x-8">
            <NavLink href={ROUTES.PROTECTED.DASHBOARD}>Dashboard</NavLink>
            <NavLink href={ROUTES.PROTECTED.PRODUCTS}>Products</NavLink>
            {isAdmin && <NavLink href={ROUTES.PROTECTED.ORDERS}>Orders</NavLink>}
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
