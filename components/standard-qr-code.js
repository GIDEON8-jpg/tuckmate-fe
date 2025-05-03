"use client"

import { useEffect, useState, useRef } from "react"
import { Clock } from "lucide-react"
import { QRCodeCanvas } from "qrcode.react"

export default function StandardQRCode({ data, expiryMinutes = 60 }) {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60) // in seconds
  const [expired, setExpired] = useState(false)
  const qrRef = useRef(null)

  // Store the QR data in a ref to keep it stable
  const qrDataRef = useRef(typeof data === "object" ? JSON.stringify(data) : String(data))

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer)
          setExpired(true)
          return 0
        }
        return prevTime - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    } else {
      return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
  }

  const handleDownload = () => {
    if (!qrRef.current) return

    try {
      // Get canvas element
      const canvas = qrRef.current.querySelector("canvas")
      if (!canvas) {
        console.error("Canvas element not found")
        return
      }

      // Convert canvas to data URL
      const dataURL = canvas.toDataURL("image/png")

      // Create download link
      const link = document.createElement("a")
      const orderName = typeof data === "object" && data.orderId ? `-${data.orderId}` : ""
      link.download = `tuckmate-qrcode${orderName}.png`
      link.href = dataURL
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading QR code:", error)
      alert("Failed to download QR code. Please try again.")
    }
  }

  return (
    <div className="flex flex-col items-center">
      <div ref={qrRef} className={`p-4 bg-white rounded-lg shadow-md ${expired ? "opacity-50" : ""} relative`}>
        <div className="w-[200px] h-[200px] flex items-center justify-center border-2 border-gray-300 p-2 rounded">
          <QRCodeCanvas
            value={qrDataRef.current}
            size={180}
            level={"L"}
            includeMargin={true}
            bgColor={"#ffffff"}
            fgColor={"#000000"}
          />
        </div>

        {expired && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
            <div className="bg-red-600 text-white px-4 py-2 rounded-md font-bold">EXPIRED</div>
          </div>
        )}
      </div>

      <div className="mt-4 flex items-center text-black">
        <Clock className="h-5 w-5 mr-2 text-primary" />
        <span className="font-medium">{expired ? "QR Code Expired" : `Expires in: ${formatTime(timeLeft)}`}</span>
      </div>

      <p className="mt-2 text-sm text-black text-center">Show this QR code to the cashier to complete your payment</p>

      {!expired && (
        <button
          onClick={handleDownload}
          className="mt-3 px-4 py-2 bg-primary text-white rounded-lg flex items-center text-sm hover:bg-primary-dark transition-colors"
        >
          Download QR Code
        </button>
      )}
    </div>
  )
}

