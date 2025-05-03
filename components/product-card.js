"use client"

import { useState } from "react"
import Image from "next/image"
import { ShoppingCart, CheckCircle, AlertCircle, X } from "lucide-react"
import { useRouter } from "next/navigation"

export default function ProductCard({ product }) {
  const [isAdded, setIsAdded] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const router = useRouter()

  const addToCart = () => {
    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id)

    // Calculate current quantity in cart
    const currentQuantityInCart = existingItemIndex >= 0 ? cart[existingItemIndex].quantity : 0

    // Check if adding one more would exceed available stock
    if (currentQuantityInCart + 1 > product.stock) {
      setError(`Sorry, only ${product.stock} item(s) available in stock.`)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    if (existingItemIndex >= 0) {
      // Update quantity if product already in cart
      cart[existingItemIndex].quantity += 1
    } else {
      // Add new product to cart
      cart.push({
        ...product,
        quantity: 1,
      })
    }

    // Save updated cart
    localStorage.setItem("cart", JSON.stringify(cart))

    // Dispatch storage event to update cart in other components
    window.dispatchEvent(new Event("storage"))

    // Show added confirmation
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 1500)
  }

  const isLowStock = product.stock > 0 && product.stock < 7
  const isOutOfStock = product.stock <= 0

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden relative">
      {showError && (
        <div className="absolute top-0 left-0 right-0 bg-red-500 text-white text-xs px-2 py-1 text-center z-10">
          {error}
        </div>
      )}

      <div className="relative">
        <Image
          src={product.image || "/placeholder.svg?height=200&width=200"}
          alt={product.name}
          width={200}
          height={200}
          className="w-full h-40 object-cover"
        />
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-red-500 text-white px-4 py-2 rounded-full flex items-center">
              <X className="h-4 w-4 mr-1" />
              Out of Stock
            </div>
          </div>
        )}
        {isLowStock && (
          <div className="absolute top-0 right-0 bg-yellow-500 text-white text-xs px-2 py-1 m-2 rounded flex items-center">
            <AlertCircle className="h-3 w-3 mr-1" />
            Low Stock ({product.stock})
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-medium text-black mb-1">{product.name}</h3>
        <p className="text-gray-700 text-sm mb-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-black">${product.price.toFixed(2)}</span>

          <button
            onClick={addToCart}
            disabled={isOutOfStock || isAdded}
            className={`p-2 rounded-full transition-all duration-200 ${
              isAdded
                ? "bg-green-500 text-white"
                : isOutOfStock
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-dark"
            }`}
          >
            {isAdded ? <CheckCircle className="h-4 w-4" /> : <ShoppingCart className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </div>
  )
}

