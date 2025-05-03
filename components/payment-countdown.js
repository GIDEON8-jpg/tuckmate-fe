"use client"

import { useState, useEffect } from "react"
import { X, Clock } from "lucide-react"
import { useOrders } from "@/contexts/order-context"
import StandardQRCode from "./standard-qr-code"

export default function PaymentCountdown({ onComplete, onCancel }) {
  const [timeLeft, setTimeLeft] = useState(15 * 60) // 15 minutes in seconds
  const [showNotification, setShowNotification] = useState(false)
  const [order, setOrder] = useState({
    id: "ORD-" + Math.floor(Math.random() * 10000),
    date: new Date().toISOString(),
    status: "pending",
    items: [],
    total: 0,
  })
  const { addOrder } = useOrders()

  useEffect(() => {
    // Get cart items for the order
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 0.5 // Adding service fee

      setOrder((prevOrder) => ({
        ...prevOrder,
        items: cart,
        total: total,
      }))
    } catch (error) {
      console.error("Failed to process cart data:", error)
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          onCancel()
          return 0
        }

        // Show notification at specific intervals
        if (
          prevTime === 45 * 60 || // 45 minutes
          prevTime === 30 * 60 || // 30 minutes
          prevTime === 15 * 60 || // 15 minutes
          (prevTime <= 5 * 60 && prevTime % 60 === 0) // Every minute in last 5 minutes
        ) {
          setShowNotification(true)
          setTimeout(() => setShowNotification(false), 3000)
        }

        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [onCancel])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Create a function to handle order completion
  const handleComplete = () => {
    // Create a new order
    const newOrder = {
      ...order,
      paymentMethod: "cash",
    }

    // Add the order to the context
    addOrder(newOrder)

    // Call the original onComplete
    onComplete()
  }

  // Create a stable QR code data object with 60 minutes expiry
  const qrData = {
    orderId: order.id,
    total: order.total,
    items: order.items,
    timestamp: order.date,
    expiryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes expiry
    paymentMethod: "cash",
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Cash Payment</h2>
          <button onClick={onCancel} className="text-gray-500">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <Clock className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-black">{formatTime(timeLeft)}</h3>
          <p className="text-black mb-4">
            Please proceed to the counter to complete your cash payment. Your order will be canceled if payment is not
            received within the time limit.
          </p>

          {/* QR Code for the order */}
          <div className="mb-4">
            <h4 className="font-medium text-black mb-2">Show this QR code at the counter:</h4>
            <StandardQRCode data={qrData} expiryMinutes={15} /> {/* 15 minutes for cash */}
            <p className="text-sm text-gray-500 mt-3 text-center">
              If QR code expires, use order number: <span className="font-bold">{order.id}</span>
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4 text-left">
            <div className="flex items-start">
              <div className="flex-shrink-0">
                <Clock className="h-5 w-5 text-yellow-500" />
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-black">Payment Instructions</h3>
                <div className="mt-2 text-sm text-black">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Show your order QR code to the cashier</li>
                    <li>Pay the exact amount in cash</li>
                    <li>Receive your receipt and order number</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex space-x-3">
          <button onClick={handleComplete} className="flex-1 py-3 bg-primary text-white rounded-lg font-medium">
            Payment Complete
          </button>
          <button onClick={onCancel} className="py-3 px-4 border border-gray-300 rounded-lg text-black">
            Cancel
          </button>
        </div>
      </div>

      {showNotification && (
        <div className="fixed top-4 right-4 bg-yellow-100 border-l-4 border-yellow-500 text-black p-4 rounded shadow-lg">
          <div className="flex">
            <div className="py-1">
              <Clock className="h-6 w-6 text-yellow-500 mr-3" />
            </div>
            <div>
              <p className="font-bold">Payment Reminder</p>
              <p className="text-sm">You have {formatTime(timeLeft)} left to complete your payment.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

