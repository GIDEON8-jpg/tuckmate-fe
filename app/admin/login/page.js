"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail } from "lucide-react"
import Link from "next/link"

export default function AdminLogin() {
  const [data, setData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // This would be replaced with your actual API endpoint
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // For demo purposes, hardcoded admin credentials
      if (data.username === "admin" && data.password === "admin123") {
        localStorage.setItem("admin-token", "admin-token-123")
        router.push("/admin/dashboard")
      } else {
        throw new Error("Invalid admin credentials")
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDemoLogin = () => {
    setIsLoading(true)
    // Set a demo admin token
    localStorage.setItem("admin-token", "admin-token-123")
    // Redirect to admin dashboard after a short delay
    setTimeout(() => {
      router.push("/admin/dashboard")
    }, 1000)
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 p-4">
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
          <h1 className="text-2xl font-bold text-gray-900">TuckMate Admin</h1>
          <p className="text-gray-600 mt-2">Sign in to manage your tuck shop</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={data.username}
                onChange={(e) => setData((d) => ({ ...d, username: e.target.value }))}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-black"
                placeholder="Enter admin username"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700 block">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={data.password}
                onChange={(e) => setData((d) => ({ ...d, password: e.target.value }))}
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-gray-500 focus:border-gray-500 text-black"
                placeholder="Enter your password"
              />
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-800 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50"
            >
              {isLoading ? "Signing in..." : "Sign in as Admin"}
            </button>
          </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-gray-500">Or</span>
          </div>
        </div>

        <button
          onClick={handleDemoLogin}
          className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
        >
          Continue as Demo Admin
        </button>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Not an admin?{" "}
            <Link href="/login" className="font-medium text-gray-800 hover:text-gray-900">
              Go to Customer Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

