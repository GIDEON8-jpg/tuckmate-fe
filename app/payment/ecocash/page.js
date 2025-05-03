"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, CheckCircle, XCircle, CreditCard, AlertCircle } from "lucide-react"
import { useOrders } from "@/contexts/order-context"
import { useProducts } from "@/contexts/product-context"
import StandardQRCode from "@/components/standard-qr-code"

export default function EcocashPayment() {
  const [phoneNumber, setPhoneNumber] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null) // 'success', 'failed', or null
  const [error, setError] = useState("")
  const [totalAmount, setTotalAmount] = useState(0)
  const [orderNumber, setOrderNumber] = useState("")
  const [validationError, setValidationError] = useState("")
  const [order, setOrder] = useState(null)
  const [stockError, setStockError] = useState("")
  const router = useRouter()
  const { addOrder } = useOrders()
  const { products } = useProducts()

  // Move localStorage access to useEffect to ensure it only runs on the client
  useEffect(() => {
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0) + 0.5

      // Generate a random order number
      const randomOrderNum = "ORD-" + Math.floor(100000 + Math.random() * 900000)

      setTotalAmount(cartTotal)
      setOrderNumber(randomOrderNum)

      // Create order object
      setOrder({
        id: randomOrderNum,
        date: new Date().toISOString(),
        status: "pending",
        items: cart,
        total: cartTotal,
      })

      // Check inventory
      const stockIssues = []
      cart.forEach((cartItem) => {
        const currentProduct = products.find((p) => p.id === cartItem.id)
        if (currentProduct && cartItem.quantity > currentProduct.stock) {
          stockIssues.push(`${cartItem.name} (requested: ${cartItem.quantity}, available: ${currentProduct.stock})`)
        }
      })

      if (stockIssues.length > 0) {
        setStockError(`Some items have insufficient stock: ${stockIssues.join(", ")}. Please adjust your cart.`)
      }
    } catch (error) {
      console.error("Error accessing cart data:", error)
      setTotalAmount(0)
    }
  }, [products])

  const validatePhoneNumber = (number) => {
    // Remove any spaces or special characters
    const cleanNumber = number.replace(/\D/g, "")

    // Check if number is exactly 10 digits
    if (cleanNumber.length !== 10) {
      return "The inputted number does not match the associated length"
    }

    // Check if number starts with 077 or 078 (Econet prefixes)
    if (!cleanNumber.startsWith("077") && !cleanNumber.startsWith("078")) {
      return "Inputted number does not support EcoCash"
    }

    // Number is valid
    return ""
  }

  const handlePhoneNumberChange = (e) => {
    const value = e.target.value.replace(/\D/g, "")
    setPhoneNumber(value)

    // Clear validation error when user is typing
    if (validationError) {
      setValidationError("")
    }
  }

  // Format phone number for display - remove leading zero when displaying with country code
  const formatPhoneNumber = (number) => {
    if (!number) return ""

    // Remove any non-digits
    const cleanNumber = number.replace(/\D/g, "")

    // If the number starts with a zero, remove it
    const formattedNumber = cleanNumber.startsWith("0") ? cleanNumber.substring(1) : cleanNumber

    return formattedNumber
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setValidationError("")

    // Check for stock issues
    if (stockError) {
      setError(stockError)
      return
    }

    // Validate phone number
    const validationResult = validatePhoneNumber(phoneNumber)
    if (validationResult) {
      setValidationError(validationResult)
      return
    }

    // Final inventory check
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")
    const stockIssues = []
    cart.forEach((cartItem) => {
      const currentProduct = products.find((p) => p.id === cartItem.id)
      if (currentProduct && cartItem.quantity > currentProduct.stock) {
        stockIssues.push(`${cartItem.name} (requested: ${cartItem.quantity}, available: ${currentProduct.stock})`)
      }
    })

    if (stockIssues.length > 0) {
      setError(`Some items have insufficient stock: ${stockIssues.join(", ")}. Please adjust your cart.`)
      return
    }

    setIsProcessing(true)

    try {
      // This would be replaced with your actual EcoCash API integration
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulate EcoCash PIN entry screen
      const pinConfirmed = await simulateEcoCashPinEntry()

      if (pinConfirmed) {
        // Simulate successful payment
        setPaymentStatus("success")

        // Create a new order
        const newOrder = {
          ...order,
          paymentMethod: "ecocash",
          phoneNumber: phoneNumber,
        }

        // Add the order to the context
        addOrder(newOrder)

        // Save the current order to localStorage for the receipt page
        localStorage.setItem("current-order", JSON.stringify(newOrder))

        // Clear cart after successful payment
        if (typeof window !== "undefined") {
          localStorage.setItem("cart", JSON.stringify([]))
        }
      } else {
        throw new Error("Payment cancelled by user")
      }
    } catch (error) {
      setPaymentStatus("failed")
      setError(error.message || "Payment failed. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  // Simulate EcoCash PIN entry modal
  const simulateEcoCashPinEntry = () => {
    return new Promise((resolve) => {
      // In a real implementation, this would redirect to the EcoCash API
      // For demo purposes, we'll use a simple confirm dialog
      const formattedNumber = formatPhoneNumber(phoneNumber)
      const confirmed = window.confirm(
        `EcoCash Payment

Amount: $${totalAmount.toFixed(2)}
Phone: +263 ${formattedNumber}

Please enter your EcoCash PIN to confirm payment.

(Press OK to simulate successful payment or Cancel to simulate failed payment)`,
      )
      resolve(confirmed)
    })
  }

  // Create a stable QR code data object
  const qrData = order
    ? {
        orderId: order.id,
        total: order.total,
        items: order.items,
        timestamp: order.date,
        expiryTime: new Date(Date.now() + 60 * 60 * 1000).toISOString(), // 60 minutes expiry
        paymentMethod: "ecocash",
        phoneNumber: formatPhoneNumber(phoneNumber) || "Not provided yet",
      }
    : null

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">EcoCash Payment</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-6 mb-4 max-w-md mx-auto">
          {stockError && (
            <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="ml-3">
                  <p className="text-sm">{stockError}</p>
                  <button
                    onClick={() => router.push("/cart")}
                    className="mt-2 text-sm font-medium text-red-700 underline"
                  >
                    Return to cart
                  </button>
                </div>
              </div>
            </div>
          )}

          {paymentStatus === null ? (
            <>
              <div className="text-center mb-6">
                <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="h-10 w-10 text-green-600" />
                </div>
                <h2 className="text-xl font-semibold text-black">EcoCash Payment</h2>
                <p className="text-black mt-2">Enter your Econet number to complete payment</p>
                <div className="mt-2 text-xs text-black">
                  <p>Only Econet numbers (077, 078) support EcoCash payments</p>
                </div>
              </div>

              {error && (
                <div
                  className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
                  role="alert"
                >
                  <span className="block sm:inline">{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="phoneNumber" className="block text-sm font-medium text-black mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">+263</span>
                    <input
                      type="tel"
                      id="phoneNumber"
                      value={phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="07X XXX XXXX"
                      maxLength={10}
                      className={`w-full pl-12 pr-4 py-2 border ${
                        validationError ? "border-red-300 ring-red-500" : "border-gray-300"
                      } rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black`}
                      required
                    />
                  </div>
                  {validationError && (
                    <div className="mt-1 flex items-center text-red-500 text-xs">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      <span>{validationError}</span>
                    </div>
                  )}
                  <p className="text-xs text-black mt-1">Enter your EcoCash registered number</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-black">Amount:</span>
                    <span className="font-bold text-black">${totalAmount.toFixed(2)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isProcessing || validationError !== "" || stockError !== ""}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
                >
                  {isProcessing ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    "Pay Now"
                  )}
                </button>
              </form>
            </>
          ) : paymentStatus === "success" ? (
            <div className="text-center py-8">
              <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-black">Payment Successful!</h2>
              <p className="text-black mb-2">Your order has been placed successfully.</p>

              {/* QR Code Section - Prominently displayed */}
              <div className="mb-6 mt-4 border-t border-b py-4">
                <h4 className="font-medium text-black mb-2 text-center">Your Order QR Code:</h4>
                <p className="text-sm text-gray-600 text-center mb-4">
                  Show this QR code to the cashier to collect your order
                </p>
                <StandardQRCode
                  data={qrData}
                  expiryMinutes={60} // 1 hour expiry for EcoCash
                />
                <p className="text-sm text-gray-500 mt-3 text-center">
                  If QR code expires, use order number: <span className="font-bold">{order.id}</span>
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-black">Amount Paid:</span>
                  <span className="font-bold text-black">${totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Payment Method:</span>
                  <span className="font-medium text-black">EcoCash (+263 {formatPhoneNumber(phoneNumber)})</span>
                </div>
              </div>

              <button
                onClick={() => router.push("/orders/confirmation")}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium"
              >
                View Order
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-red-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="h-10 w-10 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-black">Payment Failed</h2>
              <p className="text-black mb-6">There was an issue processing your payment.</p>
              <div className="space-y-2">
                <button
                  onClick={() => setPaymentStatus(null)}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.push("/cart")}
                  className="w-full py-3 border border-gray-300 rounded-lg font-medium"
                >
                  Back to Cart
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

