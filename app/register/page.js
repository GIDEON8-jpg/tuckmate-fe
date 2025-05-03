"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Lock, Mail, User } from "lucide-react"
import Link from "next/link"

export default function Register() {
  const [data, setData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "client", // Default role is client
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    // Validate passwords match
    if (data.password !== data.confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }

    try {
      // This would be replaced with your actual API endpoint
      // For demo purposes, we'll simulate a successful registration
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Store user data in localStorage for demo purposes
      // In a real app, this would be handled by your backend
      const users = JSON.parse(localStorage.getItem("users") || "[]")
      users.push({
        id: Date.now(),
        fullName: data.fullName,
        email: data.email,
        username: data.username,
        password: data.password, // In a real app, never store plain passwords
        role: data.role,
      })
      localStorage.setItem("users", JSON.stringify(users))

      // Show success message
      setSuccess(true)

      // Redirect to login page after 2 seconds
      setTimeout(() => {
        router.push("/login")
      }, 2000)
    } catch (error) {
      setError("Registration failed. Please try again.")
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
          <h1 className="text-2xl font-bold text-gray-900">Create an Account</h1>
          <p className="text-gray-600 mt-2">Join TuckMate to start ordering</p>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">Registration successful! Redirecting to login page...</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="fullName" className="text-sm font-medium text-gray-700 block">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={data.fullName}
                  onChange={(e) => setData((d) => ({ ...d, fullName: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

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
                  value={data.email}
                  onChange={(e) => setData((d) => ({ ...d, email: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                  placeholder="Enter your email"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="username" className="text-sm font-medium text-gray-700 block">
                Username
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={data.username}
                  onChange={(e) => setData((d) => ({ ...d, username: e.target.value }))}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                  placeholder="Choose a username"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="role" className="text-sm font-medium text-gray-700 block">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={data.role}
                onChange={(e) => setData((d) => ({ ...d, role: e.target.value }))}
                className="block w-full pl-3 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                required
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
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
                  placeholder="Create a password"
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

            <div className="space-y-2">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 block">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  required
                  value={data.confirmPassword}
                  onChange={(e) => setData((d) => ({ ...d, confirmPassword: e.target.value }))}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary text-black"
                  placeholder="Confirm your password"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50"
              >
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>
            </div>
          </form>
        )}

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-primary hover:text-primary-dark">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

