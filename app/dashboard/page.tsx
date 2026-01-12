import { getDashboardStats, DashboardView } from '@/features/dashboard';
import { Navigation } from '@/components/layout';

export default async function HomePage() {
  const stats = await getDashboardStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <DashboardView {...stats} />
      </main>
    </div>
  );
}
