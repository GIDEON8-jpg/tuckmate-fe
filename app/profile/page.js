"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, LogOut, User, Settings, ShoppingBag, CreditCard, Lock, Eye, EyeOff, Save } from "lucide-react"

export default function Profile() {
  const [userData, setUserData] = useState({
    fullName: "",
    email: "",
    username: "",
  })
  const [activeTab, setActiveTab] = useState("info") // 'info', 'password', 'settings'
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth-token")
    const userRole = localStorage.getItem("user-role")

    if (!token) {
      router.push("/login")
      return
    }

    if (userRole !== "client") {
      router.push("/admin/dashboard")
      return
    }

    // Get user data from localStorage
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user-data") || "{}")
      if (storedUserData && storedUserData.fullName) {
        setUserData((prev) => ({
          ...prev,
          ...storedUserData,
        }))
      }
    } catch (error) {
      console.error("Failed to parse user data:", error)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    router.push("/login")
  }

  const handleInfoChange = (e) => {
    const { name, value } = e.target
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handlePasswordChange = (e) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const saveUserInfo = () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      // In a real app, this would be an API call
      // For now, just update localStorage
      localStorage.setItem("user-data", JSON.stringify(userData))
      setSuccess("Profile information updated successfully!")
    } catch (error) {
      setError("Failed to update profile information.")
    } finally {
      setIsLoading(false)
    }
  }

  const changePassword = () => {
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match.")
      setIsLoading(false)
      return
    }

    if (passwordData.newPassword.length < 6) {
      setError("Password must be at least 6 characters long.")
      setIsLoading(false)
      return
    }

    try {
      // Get the username from user data
      const username = userData.username

      // Get all users from localStorage
      const users = JSON.parse(localStorage.getItem("users") || "[]")

      // Find the current user
      const userIndex = users.findIndex((user) => user.username === username)

      if (userIndex === -1) {
        // If user not found in the users array, check if it's a demo user
        if (username === "user") {
          // For demo user, just show success message
          setSuccess("Password changed successfully!")
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          })
          setIsLoading(false)
          return
        }

        throw new Error("User not found")
      }

      // Verify current password
      if (users[userIndex].password !== passwordData.currentPassword) {
        setError("Current password is incorrect")
        setIsLoading(false)
        return
      }

      // Update password
      users[userIndex].password = passwordData.newPassword

      // Save updated users array
      localStorage.setItem("users", JSON.stringify(users))

      setSuccess("Password changed successfully!")
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      setError(error.message || "Failed to change password.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">My Profile</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow mb-4">
          <div className="flex items-center p-6 border-b">
            <div className="relative">
              <Image
                src="/placeholder.svg?height=80&width=80"
                alt="Profile Picture"
                width={80}
                height={80}
                className="rounded-full"
              />
            </div>
            <div className="ml-4">
              <h2 className="text-xl font-semibold text-black">{userData.fullName || "User"}</h2>
              <p className="text-gray-600">{userData.email || "user@example.com"}</p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab("info")}
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "info" ? "text-primary border-b-2 border-primary" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Personal Info
            </button>
            <button
              onClick={() => setActiveTab("password")}
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "password"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Change Password
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`flex-1 py-3 font-medium text-sm ${
                activeTab === "settings"
                  ? "text-primary border-b-2 border-primary"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Settings
            </button>
          </div>

          {/* Tab Content */}
          <div className="p-6">
            {error && (
              <div
                className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
              </div>
            )}

            {success && (
              <div
                className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
                role="alert"
              >
                <span className="block sm:inline">{success}</span>
              </div>
            )}

            {activeTab === "info" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={userData.fullName}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={userData.email}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>

                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={userData.username}
                    onChange={handleInfoChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>

                <button
                  onClick={saveUserInfo}
                  disabled={isLoading}
                  className="w-full py-2 bg-primary text-white rounded-md font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-5 w-5 mr-2" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "password" && (
              <div className="space-y-4">
                <div>
                  <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Current Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="currentPassword"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm New Password
                  </label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>

                <button
                  onClick={changePassword}
                  disabled={isLoading}
                  className="w-full py-2 bg-primary text-white rounded-md font-medium flex items-center justify-center disabled:opacity-50"
                >
                  {isLoading ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Changing Password...
                    </>
                  ) : (
                    <>
                      <Lock className="h-5 w-5 mr-2" />
                      Change Password
                    </>
                  )}
                </button>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="space-y-4">
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Receive order notifications</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Receive promotional emails</span>
                  </label>
                </div>

                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <span className="ml-2 text-sm text-gray-700">Enable dark mode</span>
                  </label>
                </div>

                <div>
                  <label htmlFor="language" className="block text-sm font-medium text-gray-700 mb-1">
                    Language
                  </label>
                  <select
                    id="language"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  >
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="es">Spanish</option>
                  </select>
                </div>

                <button className="w-full py-2 bg-primary text-white rounded-md font-medium flex items-center justify-center">
                  <Save className="h-5 w-5 mr-2" />
                  Save Settings
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="space-y-4">
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-black">Account</h3>
              <div className="space-y-2">
                <button
                  onClick={() => setActiveTab("info")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <User className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-black">Personal Information</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button
                  onClick={() => setActiveTab("settings")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <Settings className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-black">Settings</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <h3 className="font-medium mb-3 text-black">Orders</h3>
              <div className="space-y-2">
                <button
                  onClick={() => router.push("/orders")}
                  className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100"
                >
                  <div className="flex items-center">
                    <ShoppingBag className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-black">Order History</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
                <button className="w-full flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100">
                  <div className="flex items-center">
                    <CreditCard className="h-5 w-5 text-gray-500 mr-3" />
                    <span className="text-black">Payment Methods</span>
                  </div>
                  <span className="text-gray-400">›</span>
                </button>
              </div>
            </div>

            <div className="border-t pt-4">
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center p-3 text-red-600 hover:bg-red-50 rounded-lg"
              >
                <LogOut className="h-5 w-5 mr-2" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

