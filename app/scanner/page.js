"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Camera, X } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"

export default function Scanner() {
  const [scanning, setScanning] = useState(false)
  const [scannedResult, setScannedResult] = useState(null)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const scannerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop().catch((error) => {
          console.error("Failed to stop scanner:", error)
        })
      }
    }
  }, [])

  const startScanner = () => {
    setScanning(true)
    setError("")

    const html5QrCode = new Html5Qrcode("scanner")
    scannerRef.current = html5QrCode

    html5QrCode
      .start(
        { facingMode: "environment" },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Success callback
          setScannedResult(decodedText)
          html5QrCode.stop().catch((error) => {
            console.error("Failed to stop scanner:", error)
          })
          setScanning(false)
          fetchProduct(decodedText)
        },
        (errorMessage) => {
          // Error callback
          console.log(errorMessage)
        },
      )
      .catch((err) => {
        setError("Failed to start scanner. Please check camera permissions.")
        setScanning(false)
      })
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      scannerRef.current.stop().catch((error) => {
        console.error("Failed to stop scanner:", error)
      })
      setScanning(false)
    }
  }

  const fetchProduct = async (barcode) => {
    try {
      // This would be replaced with your actual API endpoint
      const response = await fetch(`/api/products/barcode/${barcode}`)
      if (!response.ok) {
        throw new Error("Product not found")
      }
      const data = await response.json()
      setProduct(data)
    } catch (error) {
      setError(error.message)
    }
  }

  const addToCart = () => {
    if (!product) return

    // Get existing cart
    const cart = JSON.parse(localStorage.getItem("cart") || "[]")

    // Check if product already in cart
    const existingItemIndex = cart.findIndex((item) => item.id === product.id)

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

    // Navigate to cart
    router.push("/cart")
  }

  const resetScanner = () => {
    setScannedResult(null)
    setProduct(null)
    setError("")
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-primary text-white p-4 shadow-md">
        <div className="container mx-auto flex items-center">
          <button onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-xl font-bold">Barcode Scanner</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <div className="bg-white rounded-lg shadow p-4 mb-4">
          <h2 className="text-lg font-semibold mb-4">Scan Product Barcode</h2>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {!scannedResult ? (
            <div className="space-y-4">
              <div id="scanner" className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"></div>

              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center"
                >
                  <Camera className="h-5 w-5 mr-2" />
                  Start Scanning
                </button>
              ) : (
                <button
                  onClick={stopScanner}
                  className="w-full py-3 bg-red-500 text-white rounded-lg font-medium flex items-center justify-center"
                >
                  <X className="h-5 w-5 mr-2" />
                  Stop Scanning
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-gray-100 rounded-lg">
                <p className="font-medium">Scanned Barcode:</p>
                <p className="text-gray-700">{scannedResult}</p>
              </div>

              {product ? (
                <div className="p-4 border border-green-200 bg-green-50 rounded-lg">
                  <h3 className="font-semibold text-lg">{product.name}</h3>
                  <p className="text-gray-700 mb-2">{product.description}</p>
                  <p className="font-bold text-lg">${product.price.toFixed(2)}</p>

                  <div className="mt-4 flex space-x-2">
                    <button onClick={addToCart} className="flex-1 py-2 bg-primary text-white rounded-lg font-medium">
                      Add to Cart
                    </button>
                    <button onClick={resetScanner} className="py-2 px-4 border border-gray-300 rounded-lg">
                      Scan Again
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

