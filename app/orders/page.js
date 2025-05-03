"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Clock, Package, XCircle, ChevronRight } from "lucide-react"
import { useOrders } from "@/contexts/order-context"

export default function Orders() {
  const { orders, loading: isLoading } = useOrders()
  const router = useRouter()

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("auth-token")
    if (!token) {
      router.push("/login")
      return
    }
  }, [router])

  const getStatusIcon = (status) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "processing":
        return <Clock className="h-5 w-5 text-yellow-500" />
      case "pending":
        return <Clock className="h-5 w-5 text-blue-500" />
      case "ready":
        return <Package className="h-5 w-5 text-purple-500" />
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
      case "pending":
        return "Pending"
      case "ready":
        return "Ready for Pickup"
      case "cancelled":
        return "Cancelled"
      default:
        return status
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800"
      case "processing":
        return "bg-yellow-100 text-yellow-800"
      case "pending":
        return "bg-blue-100 text-blue-800"
      case "ready":
        return "bg-purple-100 text-purple-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleString()
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">My Orders</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 bg-white rounded-lg shadow p-6">
            <Package className="h-16 w-16 text-gray-400 mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">No Orders Yet</h2>
            <p className="text-gray-500 mb-6 text-center">
              You haven't placed any orders yet. Start shopping to place your first order.
            </p>
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-primary text-white rounded-lg">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold text-black">{order.id}</h3>
                      <p className="text-sm text-gray-600">{formatDate(order.date)}</p>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                      {getStatusText(order.status)}
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Order Items</h4>
                    <div className="space-y-2">
                      {order.items.map((item) => (
                        <div key={`${order.id}-${item.id}`} className="flex justify-between text-sm">
                          <span className="text-black">
                            {item.name} x {item.quantity}
                          </span>
                          <span className="text-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t">
                    <div>
                      <span className="text-sm text-gray-600">Total</span>
                      <p className="font-bold text-black">${order.total.toFixed(2)}</p>
                    </div>
                    <button
                      onClick={() => router.push(`/orders/${order.id}`)}
                      className="flex items-center text-primary"
                    >
                      <span className="text-sm font-medium">View Details</span>
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </button>
                  </div>
                </div>

                {/* Order Status Tracker */}
                {order.status !== "cancelled" && (
                  <div className="px-4 pb-4">
                    <div className="relative pt-4">
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "pending" || order.status === "processing" || order.status === "ready" || order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs mt-1">Ordered</span>
                        </div>

                        <div className="flex-1 mx-2 h-1 bg-gray-200">
                          <div
                            className={`h-full ${order.status === "processing" || order.status === "ready" || order.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                            style={{ width: "100%" }}
                          ></div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "processing" || order.status === "ready" || order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                          >
                            <Clock className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs mt-1">Processing</span>
                        </div>

                        <div className="flex-1 mx-2 h-1 bg-gray-200">
                          <div
                            className={`h-full ${order.status === "ready" || order.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                            style={{ width: "100%" }}
                          ></div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "ready" || order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                          >
                            <Package className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs mt-1">Ready</span>
                        </div>

                        <div className="flex-1 mx-2 h-1 bg-gray-200">
                          <div
                            className={`h-full ${order.status === "completed" ? "bg-green-500" : "bg-gray-200"}`}
                            style={{ width: "100%" }}
                          ></div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center ${order.status === "completed" ? "bg-green-500" : "bg-gray-300"}`}
                          >
                            <CheckCircle className="h-4 w-4 text-white" />
                          </div>
                          <span className="text-xs mt-1">Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

