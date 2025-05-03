"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Search, Filter, ArrowUp, ArrowDown, CheckCircle, Clock, XCircle, Package, Eye } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useOrders } from "@/contexts/order-context"

export default function AdminOrders() {
  const { orders, loading: isLoading, updateOrderStatus } = useOrders()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState("date")
  const [sortDirection, setSortDirection] = useState("desc")
  const [statusFilter, setStatusFilter] = useState("all")
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/login")
      return
    }
  }, [router])

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />
      default:
        return <Package className="h-5 w-5 text-gray-500" />
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "processing":
        return "Processing"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatus(orderId, newStatus)
  }

  // Filter and sort orders
  const filteredOrders = orders
    .filter(
      (order) =>
        (statusFilter === "all" || order.status === statusFilter) &&
        (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer.toLowerCase().includes(searchTerm.toLowerCase())),
    )
    .sort((a, b) => {
      if (sortField === "total") {
        return sortDirection === "asc" ? a.total - b.total : b.total - a.total
      } else if (sortField === "date") {
        return sortDirection === "asc" ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date)
      } else {
        // Sort by ID
        return sortDirection === "asc" ? a.id.localeCompare(b.id) : b.id.localeCompare(a.id)
      }
    })

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders by ID or customer..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
              >
                <option value="all">All Statuses</option>
                <option value="processing">Processing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("id")}
                    >
                      <div className="flex items-center">
                        Order ID
                        {sortField === "id" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("date")}
                    >
                      <div className="flex items-center">
                        Date
                        {sortField === "date" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort("total")}
                    >
                      <div className="flex items-center">
                        Total
                        {sortField === "total" &&
                          (sortDirection === "asc" ? (
                            <ArrowUp className="h-4 w-4 ml-1" />
                          ) : (
                            <ArrowDown className="h-4 w-4 ml-1" />
                          ))}
                      </div>
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredOrders.length > 0 ? (
                    filteredOrders.map((order) => (
                      <tr key={order.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.customer}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.date).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${order.total.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value)}
                            className="border border-gray-300 rounded-md px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                          >
                            <option value="pending">Pending</option>
                            <option value="processing">Processing</option>
                            <option value="ready">Ready for Pickup</option>
                            <option value="completed">Completed</option>
                            <option value="cancelled">Cancelled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => router.push(`/admin/orders/${order.id}`)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <Eye className="h-5 w-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        No orders found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

