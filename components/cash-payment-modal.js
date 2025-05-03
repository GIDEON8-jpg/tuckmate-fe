"use client"

import { useState, useEffect } from "react"
import { X, DollarSign, AlertCircle } from "lucide-react"
import { useOrders } from "@/contexts/order-context"
import { useProducts } from "@/contexts/product-context"

export default function CashPaymentModal({ onComplete, onCancel, cartItems, total }) {
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState("")
  const { addOrder } = useOrders()
  const { products } = useProducts()

  // Check inventory before proceeding
  useEffect(() => {
    // Verify stock levels
    const stockIssues = []

    cartItems.forEach((cartItem) => {
      const currentProduct = products.find((p) => p.id === cartItem.id)
      if (currentProduct && cartItem.quantity > currentProduct.stock) {
        stockIssues.push(`${cartItem.name} (requested: ${cartItem.quantity}, available: ${currentProduct.stock})`)
      }
    })

    if (stockIssues.length > 0) {
      setError(`Some items have insufficient stock: ${stockIssues.join(", ")}. Please adjust your cart.`)
    }
  }, [cartItems, products])

  const handleProceedWithPayment = () => {
    // Final inventory check
    const stockIssues = []

    cartItems.forEach((cartItem) => {
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

    // Create a new order
    const newOrder = {
      id: "ORD-" + Math.floor(100000 + Math.random() * 900000),
      date: new Date().toISOString(),
      status: "pending",
      items: cartItems,
      total: total,
      paymentMethod: "cash",
    }

    // Save the order to localStorage for the receipt page to access
    localStorage.setItem("current-order", JSON.stringify(newOrder))

    // Add the order to the context
    addOrder(newOrder)

    // Call the onComplete callback
    onComplete()
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

        {error && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <div className="flex">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-center py-6">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary/10 mb-4">
            <DollarSign className="h-12 w-12 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-2 text-black">Cash Payment</h3>
          <p className="text-black mb-6">
            You are about to proceed with a cash payment of <span className="font-bold">${total.toFixed(2)}</span>.
            After clicking "Proceed with Payment", you will receive a receipt with a QR code that will be valid for 15
            minutes.
          </p>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 text-left">
            <p className="text-sm text-yellow-800">
              <strong>Important:</strong> If the QR code expires before payment is completed, your order will be
              canceled and items will return to inventory.
            </p>
          </div>
        </div>

        <div className="flex space-x-3">
          <button
            onClick={handleProceedWithPayment}
            disabled={isProcessing || error !== ""}
            className="flex-1 py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
          >
            {isProcessing ? (
              <div className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing...
              </div>
            ) : (
              "Proceed with Payment"
            )}
          </button>
          <button
            onClick={onCancel}
            disabled={isProcessing}
            className="py-3 px-4 border border-gray-300 rounded-lg text-black"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}

