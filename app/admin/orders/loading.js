export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      {/* Search and Filter Skeleton */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Table Skeleton */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4">
          <div className="h-12 w-full bg-gray-200 rounded animate-pulse mb-4"></div>
          <div className="space-y-4">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="h-16 w-full bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

