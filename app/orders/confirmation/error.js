"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle } from "lucide-react"

export default function Error({ error, reset }) {
  const router = useRouter()

  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold">Order Confirmation</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
        <div className="bg-white rounded-lg shadow p-6 max-w-md w-full text-center">
          <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
          <p className="text-gray-600 mb-6">We encountered an error while loading your order confirmation.</p>
          <div className="space-y-3">
            <button onClick={() => reset()} className="w-full py-3 bg-primary text-white rounded-lg font-medium">
              Try again
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium"
            >
              Return to Home
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

