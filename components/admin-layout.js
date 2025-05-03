"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Image from "next/image"
import { LayoutDashboard, Package, ShoppingBag, BarChart, Users, Settings, LogOut, Menu, X, User } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({ children }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [adminData, setAdminData] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
  })
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Get admin data from localStorage
    try {
      const storedUserData = JSON.parse(localStorage.getItem("user-data") || "{}")
      if (storedUserData && storedUserData.fullName) {
        setAdminData((prev) => ({
          ...prev,
          ...storedUserData,
        }))
      }
    } catch (error) {
      console.error("Failed to parse admin data:", error)
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth-token")
    localStorage.removeItem("user-role")
    localStorage.removeItem("user-data")
    router.push("/login")
  }

  const navItems = [
    {
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      href: "/admin/dashboard",
      active: pathname === "/admin/dashboard",
    },
    {
      name: "Barcode Scanner",
      icon: <BarChart className="h-5 w-5" />,
      href: "/admin/scanner",
      active: pathname === "/admin/scanner",
      highlight: true,
    },
    {
      name: "Products",
      icon: <Package className="h-5 w-5" />,
      href: "/admin/products",
      active: pathname.startsWith("/admin/products"),
    },
    {
      name: "Orders",
      icon: <ShoppingBag className="h-5 w-5" />,
      href: "/admin/orders",
      active: pathname.startsWith("/admin/orders"),
    },
    {
      name: "Customers",
      icon: <Users className="h-5 w-5" />,
      href: "/admin/customers",
      active: pathname.startsWith("/admin/customers"),
    },
    {
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      href: "/admin/settings",
      active: pathname === "/admin/settings",
    },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar for desktop */}
      <aside className="bg-gray-800 text-white w-64 hidden md:block">
        <div className="p-4 flex items-center">
          <Image
            src="/placeholder.svg?height=40&width=40"
            alt="TuckMate Logo"
            width={40}
            height={40}
            className="mr-2"
          />
          <span className="font-bold text-xl">TuckMate Admin</span>
        </div>

        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
              <User className="h-6 w-6 text-gray-300" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">{adminData.fullName}</p>
              <p className="text-xs text-gray-400">{adminData.email}</p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <nav className="space-y-1 px-2">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                  item.active ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                } ${item.highlight ? "border-l-4 border-green-500" : ""}`}
              >
                <div className="mr-3">{item.icon}</div>
                <span>{item.name}</span>
              </Link>
            ))}
          </nav>
        </div>
        <div className="absolute bottom-0 w-64 p-4">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
          >
            <LogOut className="h-5 w-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile menu */}
      <div className="md:hidden">
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
        )}

        <div
          className={`fixed inset-y-0 left-0 z-50 w-64 bg-gray-800 transform ${
            isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/placeholder.svg?height=40&width=40"
                alt="TuckMate Logo"
                width={40}
                height={40}
                className="mr-2"
              />
              <span className="font-bold text-xl text-white">TuckMate</span>
            </div>
            <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center mr-3">
                <User className="h-6 w-6 text-gray-300" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">{adminData.fullName}</p>
                <p className="text-xs text-gray-400">{adminData.email}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <nav className="space-y-1 px-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center px-4 py-3 text-sm font-medium rounded-md ${
                    item.active ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  } ${item.highlight ? "border-l-4 border-green-500" : ""}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <div className="mr-3">{item.icon}</div>
                  <span>{item.name}</span>
                </Link>
              ))}
            </nav>
          </div>
          <div className="absolute bottom-0 w-full p-4">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-4 py-3 text-sm font-medium rounded-md text-gray-300 hover:bg-gray-700 hover:text-white"
            >
              <LogOut className="h-5 w-5" />
              <span className="ml-3">Logout</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white shadow-sm z-10">
          <div className="px-4 py-4 flex items-center justify-between">
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-4 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-auto bg-gray-100">{children}</main>
      </div>
    </div>
  )
}

