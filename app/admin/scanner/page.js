"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ArrowLeft, Camera, X, Plus, Minus, AlertCircle, Barcode, Search } from "lucide-react"
import { Html5Qrcode } from "html5-qrcode"
import AdminLayout from "@/components/admin-layout"

export default function AdminScanner() {
  const [scanning, setScanning] = useState(false)
  const [scannedResult, setScannedResult] = useState(null)
  const [product, setProduct] = useState(null)
  const [error, setError] = useState("")
  const [quantity, setQuantity] = useState(1)
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [manualBarcode, setManualBarcode] = useState("")
  const [showManualEntry, setShowManualEntry] = useState(false)
  const scannerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop().catch((error) => {
          console.error("Failed to stop scanner:", error)
        })
      }
    }
  }, [router])

  const startScanner = () => {
    setScanning(true)
    setError("")
    setScannedResult(null)
    setProduct(null)
    setUpdateSuccess(false)

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
      setQuantity(1)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleManualSearch = (e) => {
    e.preventDefault()
    if (!manualBarcode.trim()) {
      setError("Please enter a barcode")
      return
    }

    setScannedResult(manualBarcode)
    fetchProduct(manualBarcode)
    setShowManualEntry(false)
  }

  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1)
  }

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const updateStock = async (action) => {
    if (!product) return

    setIsUpdating(true)
    setError("")
    setUpdateSuccess(false)

    try {
      // This would be replaced with your actual API endpoint
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Update product stock (in a real app, this would be done on the server)
      const newStock = action === "add" ? product.stock + quantity : Math.max(0, product.stock - quantity)

      setProduct({
        ...product,
        stock: newStock,
      })

      setUpdateSuccess(true)
      setTimeout(() => setUpdateSuccess(false), 3000)
    } catch (error) {
      setError("Failed to update stock. Please try again.")
    } finally {
      setIsUpdating(false)
    }
  }

  const resetScanner = () => {
    setScannedResult(null)
    setProduct(null)
    setError("")
    setUpdateSuccess(false)
    setManualBarcode("")
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center mb-6">
          <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Inventory Scanner</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan Product Barcode</h2>
          <p className="text-gray-600 mb-4">
            Use the barcode scanner to quickly update inventory levels. Scan a product barcode to add or remove stock.
          </p>

          {/* Manual Barcode Entry Toggle */}
          <div className="flex justify-end mb-4">
            <button
              onClick={() => setShowManualEntry(!showManualEntry)}
              className="flex items-center text-primary hover:text-primary-dark"
            >
              <Barcode className="h-4 w-4 mr-1" />
              <span className="text-sm">{showManualEntry ? "Hide Manual Entry" : "Manual Barcode Entry"}</span>
            </button>
          </div>

          {/* Manual Barcode Entry Form */}
          {showManualEntry && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <form onSubmit={handleManualSearch} className="flex items-center">
                <div className="relative flex-1">
                  <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={manualBarcode}
                    onChange={(e) => setManualBarcode(e.target.value)}
                    placeholder="Enter barcode number"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-black"
                  />
                </div>
                <button type="submit" className="ml-2 px-4 py-2 bg-primary text-white rounded-md flex items-center">
                  <Search className="h-4 w-4 mr-1" />
                  Search
                </button>
              </form>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          {updateSuccess && (
            <div
              className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">Stock updated successfully!</span>
            </div>
          )}

          {!scannedResult ? (
            <div className="space-y-4">
              <div id="scanner" className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"></div>

              {!scanning ? (
                <button
                  onClick={startScanner}
                  className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center"
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
                <div className="border rounded-lg overflow-hidden">
                  <div className="flex items-center p-4 border-b">
                    <Image
                      src={product.image || "/placeholder.svg?height=80&width=80"}
                      alt={product.name}
                      width={80}
                      height={80}
                      className="rounded-md mr-4"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.description}</p>
                      <p className="text-gray-600 text-sm">Category: {product.category}</p>
                      <div className="flex items-center mt-1">
                        <span
                          className={`text-sm font-medium ${product.stock <= 5 ? "text-red-600" : "text-gray-700"}`}
                        >
                          Current Stock: {product.stock}
                        </span>
                        {product.stock <= 5 && <AlertCircle className="h-4 w-4 text-red-600 ml-1" />}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50">
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Quantity to Add/Remove:</label>
                      <div className="flex items-center">
                        <button
                          onClick={decrementQuantity}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-l-md bg-gray-100"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <input
                          type="number"
                          value={quantity}
                          onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                          className="w-20 h-10 border-t border-b border-gray-300 text-center text-black"
                        />
                        <button
                          onClick={incrementQuantity}
                          className="w-10 h-10 flex items-center justify-center border border-gray-300 rounded-r-md bg-gray-100"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => updateStock("add")}
                        disabled={isUpdating}
                        className="py-2 bg-green-600 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Add Stock
                      </button>
                      <button
                        onClick={() => updateStock("remove")}
                        disabled={isUpdating || product.stock < quantity}
                        className="py-2 bg-red-600 text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50"
                      >
                        <Minus className="h-5 w-5 mr-2" />
                        Remove Stock
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gray-800"></div>
                </div>
              )}

              <div className="flex justify-center">
                <button
                  onClick={resetScanner}
                  className="py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Scan Another Product
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}

