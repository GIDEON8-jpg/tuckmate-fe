export default function Loading() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <div className="h-6 w-6 bg-white/30 rounded-full animate-pulse mr-4"></div>
          <div className="h-6 w-48 bg-white/30 rounded animate-pulse"></div>
        </div>
      </header>

      {/* Main Content Skeleton */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4 max-w-md mx-auto">
          <div className="flex flex-col items-center">
            <div className="h-16 w-16 bg-gray-200 rounded-full animate-pulse mb-4"></div>
            <div className="h-8 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
            <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="w-full border-t border-b py-4 my-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-40 bg-gray-200 rounded animate-pulse"></div>
                </div>
                <div className="flex justify-between">
                  <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                </div>
              </div>
            </div>

            <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-3"></div>
            <div className="h-64 w-64 bg-gray-200 rounded animate-pulse mb-6"></div>

            <div className="space-y-3 w-full">
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
              <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

