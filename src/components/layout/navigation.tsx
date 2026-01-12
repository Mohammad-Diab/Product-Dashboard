import { ROUTES } from '@/lib/routes';
import { NavLink } from './nav-link';
import { LogoutButton } from './logout-button';

export function Navigation() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-12">
          <div className="flex space-x-8">
            <NavLink href={ROUTES.PROTECTED.DASHBOARD}>Dashboard</NavLink>
            <NavLink href={ROUTES.PROTECTED.PRODUCTS}>Products</NavLink>
            <NavLink href={ROUTES.PROTECTED.ORDERS}>Orders</NavLink>
          </div>
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
