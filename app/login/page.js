"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User, ShieldCheck } from "lucide-react"
import Link from "next/link"

export default function Login() {
  const [data, setData] = useState({
    username: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [selectedRole, setSelectedRole] = useState("") // "" | "admin" | "client"
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!selectedRole) {
      setError("Please select a role (Admin or Customer)")
      return
    }

    setIsLoading(true)
    setError("")

    try {
      // Get users from localStorage (in a real app, this would be an API call)
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      const user = users.find(
        (u) => u.username === data.username && u.password === data.password && u.role === selectedRole,
      )

      if (!user) {
        // For demo purposes, allow login with predefined credentials
        if (selectedRole === "admin" && data.username === "admin" && data.password === "admin123") {
          localStorage.setItem("auth-token", "admin-token-123")
          localStorage.setItem("user-role", "admin")
          localStorage.setItem(
            "user-data",
            JSON.stringify({
              fullName: "Admin User",
              email: "admin@example.com",
              username: "admin",
            }),
          )
          router.push("/admin/dashboard")
          return
        } else if (selectedRole === "client" && data.username === "user" && data.password === "user123") {
          localStorage.setItem("auth-token", "user-token-123")
          localStorage.setItem("user-role", "client")
          localStorage.setItem(
            "user-data",
            JSON.stringify({
              fullName: "Demo User",
              email: "user@example.com",
              username: "user",
            }),
          ) 
          router.push("/")
          return
        }

        throw new Error(`Invalid ${selectedRole} credentials`)
      }

      // Store user data
      localStorage.setItem("auth-token", `${selectedRole}-token-${user.id}`)
      localStorage.setItem("user-role", selectedRole)
      localStorage.setItem(
        "user-data",
        JSON.stringify({
          fullName: user.fullName,
          email: user.email,
          username: user.username,
        }),
      )

      // Redirect based on role
      if (selectedRole === "admin") {
        router.push("/admin/dashboard")
      } else {
        router.push("/")
      }
    } catch (error) {
      setError(error.message)
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
          <h1 className="text-2xl font-bold text-gray-900">Welcome to TuckMate</h1>
          <p className="text-gray-600 mt-2">Sign in to continue</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {/* Role Selection */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setSelectedRole("client")}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
              selectedRole === "client"
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <User className={`h-8 w-8 mb-2 ${selectedRole === "client" ? "text-primary" : "text-gray-600"}`} />
            <span className="font-medium text-black">Customer</span>
            <span className="text-xs text-gray-700 mt-1">Shop for products</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedRole("admin")}
            className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${
              selectedRole === "admin"
                ? "border-primary bg-primary/10"
                : "border-gray-300 hover:border-primary hover:bg-primary/5"
            }`}
          >
            <ShieldCheck className={`h-8 w-8 mb-2 ${selectedRole === "admin" ? "text-primary" : "text-gray-600"}`} />
            <span className="font-medium text-black">Admin</span>
            <span className="text-xs text-gray-700 mt-1">Manage the shop</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
              Username
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
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                placeholder="Enter your username"
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
                className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-medium text-primary hover:text-primary-dark">
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !selectedRole}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
            >
              {isLoading
                ? "Signing in..."
                : selectedRole
                  ? `Sign in as ${selectedRole === "admin" ? "Admin" : "Customer"}`
                  : "Select a role to continue"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:text-primary-dark">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

