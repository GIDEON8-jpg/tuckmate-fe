export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center">
          <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse mr-4"></div>
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div className="flex space-x-2">
          <div className="h-10 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-10 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>

      {/* Form Skeleton */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {[...Array(6)].map((_, index) => (
            <div key={index}>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>

        <div>
          <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-32 w-full bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    </div>
  )
}

