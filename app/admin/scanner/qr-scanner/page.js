"use client"

import { useState, useEffect, useRef } from "react"
import { Html5Qrcode } from "html5-qrcode"
import { CheckCircle, X, ShoppingBag, ArrowLeft, Package } from "lucide-react"
import { useRouter } from "next/navigation"

export default function QRScanner() {
  const [scanning, setScanning] = useState(false)
  const [orderData, setOrderData] = useState(null)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const scannerRef = useRef(null)
  const router = useRouter()

  useEffect(() => {
    return () => {
      // Clean up scanner when component unmounts
      if (scannerRef.current) {
        scannerRef.current.stop().catch((error) => {
          console.error("Failed to stop scanner:", error)
          // Don't set error state here as component might be unmounted
        })
      }
    }
  }, [])

  const startScanner = () => {
    setScanning(true)
    setError("")
    setOrderData(null)
    setSuccess(false)

    const html5QrCode = new Html5Qrcode("qr-scanner")
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
          try {
            const parsedData = JSON.parse(decodedText)

            // Validate QR code data
            if (!parsedData.orderId || !parsedData.items || !parsedData.total) {
              throw new Error("Invalid QR code format")
            }

            // Check if QR code is expired
            const expiryTime = new Date(parsedData.expiryTime).getTime()
            if (expiryTime < Date.now()) {
              throw new Error("QR code has expired")
            }

            setOrderData(parsedData)

            // Safely stop the scanner
            if (html5QrCode && html5QrCode.getState() === Html5Qrcode.STATE_SCANNING) {
              html5QrCode.stop().catch(() => {
                // Silently handle stop errors
                console.log("Scanner stopped after successful scan")
              })
            }

            setScanning(false)
          } catch (error) {
            setError(error.message || "Invalid QR code")

            // Safely stop the scanner
            if (html5QrCode && html5QrCode.getState() === Html5Qrcode.STATE_SCANNING) {
              html5QrCode.stop().catch(() => {
                // Silently handle stop errors
                console.log("Scanner stopped after error")
              })
            }

            setScanning(false)
          }
        },
        (errorMessage) => {
          // Error callback - only log, don't display to user
          console.log("QR scan error:", errorMessage)
        },
      )
      .catch((err) => {
        setError("Failed to start scanner. Please check camera permissions.")
        setScanning(false)
      })
  }

  const stopScanner = () => {
    if (scannerRef.current) {
      try {
        scannerRef.current
          .stop()
          .then(() => {
            console.log("Scanner stopped successfully")
            setScanning(false)
          })
          .catch(() => {
            // Silently handle stop errors
            console.log("Error stopping scanner, but continuing anyway")
            setScanning(false)
          })
      } catch (error) {
        // Silently handle any errors
        console.log("Error in stop scanner function, but continuing anyway")
        setScanning(false)
      }
    } else {
      setScanning(false)
    }
  }

  const processOrder = async () => {
    if (!orderData) return

    setIsProcessing(true)
    setError("")

    try {
      // This would be replaced with your actual API endpoint
      // Simulating API call with timeout
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // In a real app, you would update inventory here
      // For each item in the order, reduce the stock

      setSuccess(true)
    } catch (error) {
      setError("Failed to process order. Please try again.")
    } finally {
      setIsProcessing(false)
    }
  }

  const resetScanner = () => {
    setOrderData(null)
    setError("")
    setSuccess(false)
  }

  // Format payment method for display
  const formatPaymentMethod = (method, phoneNumber) => {
    if (method === "ecocash" && phoneNumber) {
      return `EcoCash (+263${phoneNumber})`
    }
    return method ? method.charAt(0).toUpperCase() + method.slice(1) : "Not specified"
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
          <ArrowLeft className="h-6 w-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">QR Code Scanner</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Scan Customer Order QR Code</h2>
        <p className="text-gray-600 mb-4">Scan the QR code shown by the customer to view and process their order.</p>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success ? (
          <div className="text-center py-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Order Processed Successfully!</h2>
            <p className="text-gray-600 mb-6">The order has been processed and inventory has been updated.</p>
            <button onClick={resetScanner} className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark">
              Scan Another Order
            </button>
          </div>
        ) : (
          <>
            {!orderData ? (
              <div className="space-y-4">
                <div id="qr-scanner" className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden"></div>

                {!scanning ? (
                  <button
                    onClick={startScanner}
                    className="w-full py-3 bg-gray-800 text-white rounded-lg font-medium flex items-center justify-center"
                  >
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Start Scanning Order QR
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
                <div className="border rounded-lg overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b">
                    <div className="flex justify-between items-center">
                      <h3 className="font-semibold text-lg text-black">Order #{orderData.orderId}</h3>
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                        Ready for Pickup
                      </span>
                    </div>
                    {orderData.paymentMethod && (
                      <p className="text-sm text-gray-600 mt-1">
                        Payment: {formatPaymentMethod(orderData.paymentMethod, orderData.phoneNumber)}
                      </p>
                    )}
                    {orderData.timestamp && (
                      <p className="text-sm text-gray-600 mt-1">
                        Date: {new Date(orderData.timestamp).toLocaleString()}
                      </p>
                    )}
                  </div>

                  <div className="p-4">
                    <h4 className="font-medium mb-2 text-black">Order Items:</h4>
                    <div className="space-y-3 mb-4">
                      {orderData.items.map((item, index) => (
                        <div key={index} className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Package className="h-5 w-5 text-gray-400 mr-2" />
                            <span className="text-black">
                              {item.name} x {item.quantity}
                            </span>
                          </div>
                          <span className="text-black">${(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>

                    <div className="border-t pt-3 mt-3">
                      <div className="flex justify-between items-center font-bold">
                        <span className="text-black">Total Amount:</span>
                        <span className="text-primary text-lg">${orderData.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 border-t">
                    <button
                      onClick={processOrder}
                      disabled={isProcessing}
                      className="w-full py-3 bg-primary text-white rounded-lg font-medium flex items-center justify-center disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Processing...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-5 w-5 mr-2" />
                          Process Order & Update Inventory
                        </>
                      )}
                    </button>
                  </div>
                </div>

                <button
                  onClick={resetScanner}
                  className="w-full py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

