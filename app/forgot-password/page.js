"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Mail, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function ForgotPassword() {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // This would be replaced with your actual API endpoint
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful password reset request
      setSuccess(true)
    } catch (error) {
      setError("Failed to send reset link. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-primary to-primary-dark p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-6 space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <Image
              src="/placeholder.svg?height=80&width=80"
              alt="TuckMate Logo"
              width={80}
              height={80}
              className="mb-2"
            />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
          <p className="text-gray-600 mt-2">Enter your email to receive a password reset link</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Reset Link Sent!</h2>
            <p className="text-gray-600 mb-6">
              We've sent a password reset link to your email. Please check your inbox and follow the instructions.
            </p>
            <Link
              href="/login"
              className="w-full inline-block py-3 bg-primary text-white rounded-lg font-medium text-center"
            >
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700 block">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? "Sending..." : "Send Reset Link"}
              </button>
            </div>

            <div className="text-center text-sm">
              <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

