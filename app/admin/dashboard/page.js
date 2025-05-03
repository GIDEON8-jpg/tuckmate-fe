"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import {
  ShoppingBag,
  Package,
  Users,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Edit,
  Trash2,
  BarChart,
  AlertCircle,
} from "lucide-react"
import AdminLayout from "@/components/admin-layout"

export default function AdminDashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  })
  const [topProducts, setTopProducts] = useState([])
  const [recentProducts, setRecentProducts] = useState([])
  const [lowStockProducts, setLowStockProducts] = useState([])
  const [adminData, setAdminData] = useState({
    fullName: "Admin User",
    email: "admin@example.com",
  })
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("auth-token")
    const userRole = localStorage.getItem("user-role")

    if (!token) {
      router.push("/login")
      return
    }

    if (userRole !== "admin") {
      router.push("/")
      return
    }

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

    // Fetch dashboard data
    const fetchDashboardData = async () => {
      setIsLoading(true)
      try {
        // This would be replaced with your actual API endpoints
        // Simulating API calls with timeout
        await new Promise((resolve) => setTimeout(resolve, 1000))

        // Mock data for dashboard
        setStats({
          totalSales: 1250.75,
          totalOrders: 48,
          totalProducts: 32,
          totalCustomers: 120,
        })

        setTopProducts([
          { id: 1, name: "Chicken Pie", sales: 125, revenue: 312.5, trend: "up" },
          { id: 3, name: "Coca Cola 500ml", sales: 98, revenue: 98.0, trend: "up" },
          { id: 5, name: "Chocolate Bar", sales: 87, revenue: 65.25, trend: "down" },
          { id: 2, name: "Beef Pie", sales: 76, revenue: 209.0, trend: "up" },
          { id: 8, name: "Water 500ml", sales: 65, revenue: 32.5, trend: "down" },
        ])

        // Fetch products for the quick access section
        const response = await fetch("/api/products")
        const products = await response.json()

        // Set recent products
        setRecentProducts(products.slice(0, 4))

        // Set low stock products (less than 7 items)
        const lowStock = products.filter((product) => product.stock > 0 && product.stock < 7)
        setLowStockProducts(lowStock)
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDashboardData()
  }, [router])

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-sm text-gray-500">Welcome back, {adminData.fullName}</p>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-500">Today: {new Date().toLocaleDateString()}</span>
          </div>
        </div>

        {/* Quick Access Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <button
            onClick={() => router.push("/admin/scanner/qr-scanner")}
            className="bg-gray-800 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-gray-700 transition-colors"
          >
            <BarChart className="h-10 w-10 mb-3" />
            <span className="text-lg font-medium">QR Scanner</span>
            <span className="text-xs text-gray-300 mt-1">Process customer orders</span>
          </button>

          <button
            onClick={() => router.push("/admin/products/new")}
            className="bg-green-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-green-500 transition-colors"
          >
            <Plus className="h-10 w-10 mb-3" />
            <span className="text-lg font-medium">Add Product</span>
            <span className="text-xs text-gray-100 mt-1">Create a new product</span>
          </button>

          <button
            onClick={() => router.push("/admin/products")}
            className="bg-blue-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-blue-500 transition-colors"
          >
            <Edit className="h-10 w-10 mb-3" />
            <span className="text-lg font-medium">Manage Products</span>
            <span className="text-xs text-gray-100 mt-1">Edit or delete products</span>
          </button>

          <button
            onClick={() => router.push("/admin/orders")}
            className="bg-purple-600 text-white p-6 rounded-lg shadow-md flex flex-col items-center justify-center hover:bg-purple-500 transition-colors"
          >
            <ShoppingBag className="h-10 w-10 mb-3" />
            <span className="text-lg font-medium">View Orders</span>
            <span className="text-xs text-gray-100 mt-1">Manage customer orders</span>
          </button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Sales</p>
                    <h3 className="text-2xl font-bold text-gray-800">${stats.totalSales.toFixed(2)}</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      8.2% from last week
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-full">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalOrders}</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      5.3% from last week
                    </p>
                  </div>
                  <div className="bg-purple-100 p-3 rounded-full">
                    <ShoppingBag className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Products</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalProducts}</h3>
                    <p className="text-xs text-red-500 mt-1 flex items-center">
                      <ArrowDownRight className="h-3 w-3 mr-1" />
                      2.1% from last week
                    </p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-full">
                    <Package className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Total Customers</p>
                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalCustomers}</h3>
                    <p className="text-xs text-green-500 mt-1 flex items-center">
                      <ArrowUpRight className="h-3 w-3 mr-1" />
                      12.5% from last week
                    </p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-full">
                    <Users className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Low Stock Alert Section */}
            {lowStockProducts.length > 0 && (
              <div className="bg-white rounded-lg shadow mb-6">
                <div className="p-6 border-b bg-red-50">
                  <div className="flex items-center">
                    <AlertCircle className="h-6 w-6 text-red-600 mr-2" />
                    <h2 className="text-lg font-semibold text-red-700">Low Stock Alert</h2>
                  </div>
                  <p className="text-sm text-red-600 mt-1">
                    The following products are running low on stock and need attention
                  </p>
                </div>
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {lowStockProducts.map((product) => (
                      <div key={product.id} className="border border-red-200 rounded-lg overflow-hidden bg-red-50">
                        <div className="p-4 flex items-center">
                          <Image
                            src={product.image || "/placeholder.svg?height=60&width=60"}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="rounded-md mr-3"
                          />
                          <div>
                            <h3 className="font-medium text-gray-900">{product.name}</h3>
                            <p className="text-sm text-red-600 font-medium">Only {product.stock} items left!</p>
                          </div>
                        </div>
                        <div className="bg-white p-2 flex justify-between border-t border-red-200">
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/scanner?barcode=${product.barcode}`)}
                            className="p-2 text-green-600 hover:bg-green-50 rounded"
                          >
                            <BarChart className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                            className="p-2 text-primary hover:bg-primary-50 rounded flex items-center"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            <span className="text-xs">Restock</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Recent Products with Quick Actions */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Recent Products</h2>
                <p className="text-sm text-gray-500">Quick access to manage recent products</p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {recentProducts.map((product) => (
                    <div key={product.id} className="border rounded-lg overflow-hidden">
                      <div className="p-4 flex items-center">
                        <Image
                          src={product.image || "/placeholder.svg?height=60&width=60"}
                          alt={product.name}
                          width={60}
                          height={60}
                          className="rounded-md mr-3"
                        />
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">
                            ${product.price.toFixed(2)} | Stock: {product.stock}
                          </p>
                        </div>
                      </div>
                      <div className="bg-gray-50 p-2 flex justify-between">
                        <button
                          onClick={() => router.push(`/admin/products/edit/${product.id}`)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => router.push(`/admin/scanner?barcode=${product.barcode}`)}
                          className="p-2 text-green-600 hover:bg-green-50 rounded"
                        >
                          <BarChart className="h-4 w-4" />
                        </button>
                        <button className="p-2 text-red-600 hover:bg-red-50 rounded">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b">
                <h2 className="text-lg font-semibold text-gray-800">Top Selling Products</h2>
                <p className="text-sm text-gray-500">Products with the highest sales volume</p>
              </div>
              <div className="p-6">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sales
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Revenue
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Trend
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {topProducts.map((product) => (
                        <tr key={product.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {product.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.sales} units</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            ${product.revenue.toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {product.trend === "up" ? (
                              <span className="text-green-500 flex items-center">
                                <ArrowUpRight className="h-4 w-4 mr-1" />
                                Up
                              </span>
                            ) : (
                              <span className="text-red-500 flex items-center">
                                <ArrowDownRight className="h-4 w-4 mr-1" />
                                Down
                              </span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}

