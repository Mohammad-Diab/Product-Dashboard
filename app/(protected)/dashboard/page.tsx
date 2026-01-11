export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Product Management</h1>
        <p className="mt-2 text-gray-600">
          Welcome to your product management dashboard
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Total Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-blue-600">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Active Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-green-600">0</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Inactive Products
          </h3>
          <p className="mt-2 text-3xl font-bold text-gray-600">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Quick Actions
        </h2>
        <div className="space-y-3">
          <p className="text-gray-600">
            • View and manage your products from the products page
          </p>
          <p className="text-gray-600">
            • Create new products to expand your catalog
          </p>
          <p className="text-gray-600">
            • Update product details and pricing
          </p>
        </div>
      </div>
    </div>
  );
}
