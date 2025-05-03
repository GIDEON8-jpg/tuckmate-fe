"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Clock, AlertCircle } from "lucide-react"
import StandardQRCode from "@/components/standard-qr-code"
import { useProducts } from "@/contexts/product-context"

export default function CashReceipt() {
  const [order, setOrder] = useState(null)
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [expired, setExpired] = useState(false)
  const router = useRouter()
  const { products, updateProduct } = useProducts()

  useEffect(() => {
    // Get the order from localStorage
    try {
      const savedOrder = JSON.parse(localStorage.getItem("current-order") || "{}")
      if (savedOrder && savedOrder.id) {
        setOrder(savedOrder)
      } else {
        // If no order found, redirect to cart
        router.push("/cart")
      }
    } catch (error) {
      console.error("Failed to load order:", error)
      router.push("/cart")
    }

    // Set up the timer
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          handleExpiration()
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router])

  const handleExpiration = () => {
    setExpired(true)

    if (!order) return

    // Return items to inventory
    order.items.forEach((item) => {
      const product = products.find((p) => p.id === item.id)
      if (product) {
        // Increase stock by the quantity in the order
        updateProduct({
          ...product,
          stock: product.stock + item.quantity,
        })
      }
    })

    // Remove the current order from localStorage
    localStorage.removeItem("current-order")

    // Get all orders
    const orders = JSON.parse(localStorage.getItem("orders") || "[]")

    // Find and remove the expired order
    const updatedOrders = orders.filter((o) => o.id !== order?.id)

    // Save updated orders
    localStorage.setItem("orders", JSON.stringify(updatedOrders))

    // After a delay, redirect to cart
    setTimeout(() => {
      router.push("/cart")
    }, 5000)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Create QR code data
  const qrData = order
    ? {
        orderId: order.id,
        total: order.total,
        items: order.items,
        timestamp: order.date,
        expiryTime: new Date(Date.now() + 15 * 60 * 1000).toISOString(), // 15 minutes expiry
        paymentMethod: "cash",
      }
    : null

  if (!order) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
          <div className="container mx-auto flex items-center">
            <button onClick={() => router.push("/cart")} className="mr-4">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-xl font-bold">Cash Receipt</h1>
          </div>
        </header>
        <main className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.push("/cart")} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Cash Receipt</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4 max-w-md mx-auto">
          {expired ? (
            <div className="text-center py-8">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-black">QR Code Expired</h2>
              <p className="text-black mb-6">
                Your payment time has expired. The order has been canceled and items have been returned to inventory.
              </p>
              <button
                onClick={() => router.push("/cart")}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium"
              >
                Return to Cart
              </button>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-semibold text-black">Cash Payment Receipt</h2>
                <p className="text-black">Please proceed to the counter to complete your payment.</p>

                <div className="mt-4 flex items-center justify-center text-black">
                  <Clock className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Time remaining: {formatTime(timeLeft)}</span>
                </div>
              </div>

              <div className="border-t border-b py-4 my-4">
                <div className="flex justify-between mb-2">
                  <span className="text-black">Order Number:</span>
                  <span className="font-medium text-black">{order.id}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-black">Date:</span>
                  <span className="text-black">{new Date(order.date).toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Status:</span>
                  <span className="flex items-center text-yellow-600">
                    <Clock className="h-4 w-4 mr-1" />
                    Awaiting Payment
                  </span>
                </div>
              </div>

              <h3 className="font-semibold text-lg mb-3 text-black">Order Summary</h3>
              <div className="space-y-3 mb-4">
                {order.items.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <span className="text-black">
                      {item.name} x {item.quantity}
                    </span>
                    <span className="text-black">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="flex justify-between text-gray-600">
                  <span>Service Fee</span>
                  <span>$0.50</span>
                </div>
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span className="text-black">Total</span>
                  <span className="text-black">${order.total.toFixed(2)}</span>
                </div>
              </div>

              {/* QR Code Section */}
              <div className="border-t pt-4 mb-6">
                <h3 className="font-semibold text-lg mb-3 text-center text-black">Your Payment QR Code</h3>
                <div className="flex justify-center">
                  <StandardQRCode data={qrData} expiryMinutes={15} />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4 text-center">
                  <p className="text-sm text-yellow-800">
                    <strong>Important:</strong> This QR code will expire in {formatTime(timeLeft)}. If it expires before
                    payment, your order will be canceled.
                  </p>
                </div>
              </div>

              <button
                onClick={() => router.push("/orders")}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium"
              >
                View My Orders
              </button>
            </>
          )}
        </div>
      </main>
    </div>
  )
}

