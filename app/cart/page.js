"use client"

import CashPaymentModal from "@/components/cash-payment-modal"
import { useProducts } from "@/contexts/product-context"
import { AlertCircle, ArrowLeft, CreditCard, DollarSign, MessageCircle, Trash2 } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

const genRandomId = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 10; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

export default function Cart() {
  const [cart, setCart] = useState([])
  const [total, setTotal] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState("")
  const [showCashModal, setShowCashModal] = useState(false)
  const [error, setError] = useState("")
  const [showError, setShowError] = useState(false)
  const router = useRouter()
  const { products } = useProducts()

  useEffect(() => {
    // Load cart from localStorage
    const savedCart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Verify stock levels for all items in cart
    const updatedCart = savedCart
      .map((cartItem) => {
        // Find the current product to get latest stock
        const currentProduct = products.find((p) => p.id === cartItem.id)

        // If product exists and has stock info
        if (currentProduct) {
          // If quantity exceeds available stock, adjust it
          if (cartItem.quantity > currentProduct.stock) {
            setError(`Quantity for ${cartItem.name} adjusted to match available stock (${currentProduct.stock})`)
            setShowError(true)
            setTimeout(() => setShowError(false), 5000)

            return {
              ...cartItem,
              quantity: currentProduct.stock,
              stock: currentProduct.stock, // Update stock info
            }
          }

          // Update stock info in cart
          return {
            ...cartItem,
            stock: currentProduct.stock,
          }
        }

        return cartItem
      })
      .filter((item) => item.quantity > 0) // Remove items with zero quantity

    // Save the updated cart
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Calculate total
    const cartTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(cartTotal)
  }, [products])

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity < 1) return

    // Find the product in the cart
    const cartItem = cart.find((item) => item.id === productId)
    if (!cartItem) return

    // Find the current product to get latest stock
    const currentProduct = products.find((p) => p.id === productId)

    // Check if requested quantity exceeds available stock
    if (currentProduct && newQuantity > currentProduct.stock) {
      setError(`Sorry, only ${currentProduct.stock} item(s) of ${cartItem.name} available in stock.`)
      setShowError(true)
      setTimeout(() => setShowError(false), 3000)
      return
    }

    const updatedCart = cart.map((item) => (item.id === productId ? { ...item, quantity: newQuantity } : item))

    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Recalculate total
    const cartTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(cartTotal)
  }

  const removeItem = (productId) => {
    const updatedCart = cart.filter((item) => item.id !== productId)
    setCart(updatedCart)
    localStorage.setItem("cart", JSON.stringify(updatedCart))

    // Recalculate total
    const cartTotal = updatedCart.reduce((sum, item) => sum + item.price * item.quantity, 0)
    setTotal(cartTotal)
  }

  const handleCheckout = (method) => {
    if (!method) {
      alert("Please select a payment method")
      return
    }

    // Verify stock levels one more time before checkout
    const stockIssues = []

    cart.forEach((cartItem) => {
      const currentProduct = products.find((p) => p.id === cartItem.id)
      if (currentProduct && cartItem.quantity > currentProduct.stock) {
        stockIssues.push(`${cartItem.name} (requested: ${cartItem.quantity}, available: ${currentProduct.stock})`)
      }
    })

    if (stockIssues.length > 0) {
      setError(`Some items have insufficient stock: ${stockIssues.join(", ")}. Please adjust your cart.`)
      setShowError(true)
      setTimeout(() => setShowError(false), 5000)
      return
    }

    setPaymentMethod(method)

    if (method === "cash") {
      // Show the cash payment modal instead of immediately showing the countdown
      setShowCashModal(true)
    } else if (method === "ecocash") {
      // Redirect to Ecocash payment integration
      router.push("/payment/ecocash")
    }
  }

  const handleCashPaymentComplete = () => {
    // Redirect to receipt page with QR code
    router.push("/payment/cash/receipt")
  }

  const handleCashPaymentCancel = () => {
    setShowCashModal(false)
    setPaymentMethod("")
  }

  const continueWithWhatsApp = () => {
    // WhatsApp business phone number (Zimbabwe number)
    const phoneNumber = "263738423691" // Zimbabwe number as specified

    // Create WhatsApp URL without any message content
    const whatsappUrl = `https://wa.me/${phoneNumber}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Your Cart</h1>
        </div>
      </header>

      {/* Error Message */}
      {showError && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 mx-4 mt-4 rounded shadow-md">
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

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Image
              src="/placeholder.svg?height=100&width=100"
              alt="Empty Cart"
              width={100}
              height={100}
              className="mb-4 opacity-50"
            />
            <p className="text-gray-700 mb-4">Your cart is empty</p>
            <button onClick={() => router.push("/")} className="px-4 py-2 bg-primary text-white rounded-lg">
              Browse Products
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Cart Items */}
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-lg font-semibold text-black mb-4">Cart Items ({cart.length})</h2>
              <div className="divide-y">
                {cart.map((item) => (
                  <div key={item.id} className="py-4 flex items-center">
                    <Image
                      src={item.image || "/placeholder.svg?height=60&width=60"}
                      alt={item.name}
                      width={60}
                      height={60}
                      className="rounded-md mr-4"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-black">{item.name}</h3>
                      <p className="text-gray-700 text-sm">${item.price.toFixed(2)}</p>
                      {item.stock <= 5 && (
                        <p className="text-xs text-yellow-600 flex items-center mt-1">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Only {item.stock} left in stock
                        </p>
                      )}
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center border border-gray-300 rounded-l-md text-black"
                      >
                        -
                      </button>
                      <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 text-black">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={`w-8 h-8 flex items-center justify-center border border-gray-300 rounded-r-md ${item.quantity >= item.stock ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "text-black"
                          }`}
                        disabled={item.quantity >= item.stock}
                      >
                        +
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="ml-4 text-red-500">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-black mb-4">Order Summary</h2>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-black">Subtotal</span>
                  <span className="text-black">${total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-black">Service Fee</span>
                  <span className="text-black">$0.50</span>
                </div>
                <div className="border-t pt-2 mt-2 flex justify-between font-semibold">
                  <span className="text-black">Total</span>
                  <span className="text-lg text-primary">${(total + 0.5).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-white rounded-lg shadow p-4">
              <button
                onClick={continueWithWhatsApp}
                className="w-full flex items-center justify-center py-3 bg-green-500 text-white rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Continue with WhatsApp
              </button>
              <p className="text-xs text-gray-500 text-center mt-2">
                Continue your order through WhatsApp for faster service
              </p>
            </div>

            {/* Payment Methods */}
            <div className="bg-white rounded-lg shadow p-4">
              <h2 className="text-lg font-semibold text-black mb-4">Payment Method</h2>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => handleCheckout("cash")}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${paymentMethod === "cash"
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-primary hover:bg-primary/5"
                    }`}
                >
                  <DollarSign
                    className={`h-8 w-8 mb-2 ${paymentMethod === "cash" ? "text-primary" : "text-gray-600"}`}
                  />
                  <span className="font-medium text-black">Cash</span>
                  <span className="text-xs text-gray-700 mt-1">Pay at the counter</span>
                </button>

                <button
                  onClick={() => {

                    // Generate PayNow URL
                    const email = encodeURIComponent('decefemz@gmail.com');
                    const queryString = `search=${email}&amount=${total.toFixed(2)}&reference=${genRandomId()}&l=1`;
                    const base64Query = Buffer.from(queryString).toString('base64');
                    const urlEncodedBase64 = encodeURIComponent(base64Query);
                    const paynowUrl = `https://www.paynow.co.zw/Payment/Link/?q=${urlEncodedBase64}`;

                    fetch("https://srv1.decie.dev/api/orders", {
                      method: "POST",
                      headers: {
                        'Content-Type': 'application/json',
                      },
                      body: JSON.stringify({
                        id: tid,
                        total: total.toFixed(2)
                      })
                    })

                    location.href = paynowUrl

                  }}
                  className={`flex flex-col items-center justify-center p-4 border rounded-lg transition-colors ${paymentMethod === "ecocash"
                    ? "border-primary bg-primary/10"
                    : "border-gray-300 hover:border-primary hover:bg-primary/5"
                    }`}
                >
                  <CreditCard
                    className={`h-8 w-8 mb-2 ${paymentMethod === "ecocash" ? "text-primary" : "text-gray-600"}`}
                  />
                  <span className="font-medium text-black">Paynow</span>
                  <span className="text-xs text-gray-700 mt-1">Pay with mobile money</span>
                </button>
              </div>
            </div>

            {/* Checkout Button */}
            {cart.length > 0 && (
              <button
                onClick={() => {
                  if (!paymentMethod) {
                    alert("Please select a payment method")
                  } else {
                    handleCheckout(paymentMethod)
                  }
                }}
                className="w-full py-3 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
              >
                {paymentMethod
                  ? `Checkout with ${paymentMethod === "cash" ? "Cash" : "EcoCash"}`
                  : "Select Payment Method to Checkout"}
              </button>
            )}
          </div>
        )}
      </main>

      {/* Floating Total Summary */}
      {cart.length > 0 && (
        <div className="fixed bottom-16 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-4 z-10">
          <div className="container mx-auto flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-700">Total ({cart.length} items)</p>
              <p className="text-xl font-bold text-black">${(total + 0.5).toFixed(2)}</p>
            </div>
            <button
              onClick={() => {
                if (!paymentMethod) {
                  alert("Please select a payment method")
                } else {
                  handleCheckout(paymentMethod)
                }
              }}
              className="px-6 py-2 bg-primary text-white rounded-lg font-medium disabled:opacity-50"
            >
              Checkout
            </button>
          </div>
        </div>
      )}

      {/* Cash Payment Modal */}
      {showCashModal && (
        <CashPaymentModal
          onComplete={handleCashPaymentComplete}
          onCancel={handleCashPaymentCancel}
          cartItems={cart}
          total={total + 0.5}
        />
      )}
    </div>
  )
}

