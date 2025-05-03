export default function Loading() {
  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse mr-4"></div>
        <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-4"></div>
        <div className="h-4 w-full bg-gray-200 rounded animate-pulse mb-8"></div>

        <div className="w-full h-64 bg-gray-200 rounded-lg animate-pulse mb-4"></div>

        <div className="h-12 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  )
}

