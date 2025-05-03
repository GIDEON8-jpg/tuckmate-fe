"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, Clock, Package } from "lucide-react"
import StandardQRCode from "@/components/standard-qr-code"

export default function OrderConfirmation() {
  // Add payment method to the order state
  const [order, setOrder] = useState({
    id: "ORD-" + Math.floor(Math.random() * 10000),
    date: new Date().toISOString(),
    status: "processing",
    items: [],
    total: 0,
    paymentMethod: "cash", // Default to cash
  })
  const router = useRouter()

  // In the useEffect, get the payment method from the order context
  useEffect(() => {
    // In a real app, you would fetch the order details from the API
    // For now, we'll simulate it with random data or get from localStorage
    try {
      // Try to get the most recent order from the orders context
      const orders = JSON.parse(localStorage.getItem("orders") || "[]")
      const latestOrder = orders.length > 0 ? orders[orders.length - 1] : null

      if (latestOrder) {
        setOrder(latestOrder)
      } else {
        // Fallback to cart data
        const cart = JSON.parse(localStorage.getItem("cart") || "[]")
        const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 0.5 // Adding service fee

        setOrder((prevOrder) => ({
          ...prevOrder,
          items: cart,
          total: total,
        }))
      }

      // Clear cart after successful order
      localStorage.setItem("cart", JSON.stringify([]))
    } catch (error) {
      console.error("Failed to process order data:", error)

      // Fallback to simulated items if cart is empty or invalid
      const simulatedItems = [
        { id: 1, name: "Chicken Pie", price: 2.5, quantity: 2 },
        { id: 2, name: "Coca Cola 500ml", price: 1.0, quantity: 1 },
        { id: 3, name: "Chocolate Bar", price: 0.75, quantity: 3 },
      ]

      const total = simulatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0) + 0.5

      setOrder((prevOrder) => ({
        ...prevOrder,
        items: simulatedItems,
        total: total,
      }))
    }
  }, [])

  // Create a stable QR code data object with 60 minutes expiry
  const qrData = {
    orderId: order.id,
    total: order.total,
    items: order.items,
    timestamp: order.date,
    expiryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes expiry
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.push("/")} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Order Confirmation</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4 max-w-md mx-auto">
          <div className="text-center mb-6">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-black">Order Placed!</h2>
            <p className="text-black">Your order has been received and is being processed.</p>
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
                Processing
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
            <h3 className="font-semibold text-lg mb-3 text-center text-black">Your Collection QR Code</h3>
            <StandardQRCode data={qrData} expiryMinutes={order.paymentMethod === "ecocash" ? 60 : 15} />
            <p className="text-sm text-gray-500 mt-3 text-center">
              If QR code expires, use order number: <span className="font-bold">{order.id}</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
            <div className="flex items-start">
              <Package className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
              <div>
                <h4 className="font-medium text-black">Collection Information</h4>
                <p className="text-sm text-black">
                  Your order will be ready for collection in approximately 15-20 minutes. Please show your QR code at
                  the counter to collect your order.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => router.push("/orders")}
              className="w-full py-3 bg-primary text-white rounded-lg font-medium"
            >
              Track Order
            </button>
            <button
              onClick={() => router.push("/")}
              className="w-full py-3 border border-gray-300 rounded-lg font-medium text-black"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}

