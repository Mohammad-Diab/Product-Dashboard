export default function ProductNotFound() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-16">
      <div className="bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="mb-6">
          <h1 className="text-9xl font-bold text-gray-300">404</h1>
        </div>

        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Product Not Found
        </h2>

        <p className="text-gray-600 mb-8">
          The product you're looking for doesn't exist or you don't have permission to view it.
        </p>

        <div className="flex justify-center gap-4">
          <a
            href="/products"
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            View All Products
          </a>
        </div>
      </div>
    </div>
  );
}
