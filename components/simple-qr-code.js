"use client"

import { useEffect, useState } from "react"
import { Clock } from "lucide-react"

export default function SimpleQRCode({ data, expiryMinutes = 60 }) {
  const [timeLeft, setTimeLeft] = useState(expiryMinutes * 60) // in seconds
  const [expired, setExpired] = useState(false)
  const [qrUrl, setQrUrl] = useState("")

  // Generate QR code URL using Google Charts API
  useEffect(() => {
    try {
      // Convert data to string if it's an object
      const dataString = typeof data === "object" ? JSON.stringify(data) : String(data)

      // Create QR code URL using Google Charts API
      const url = `https://chart.googleapis.com/chart?cht=qr&chl=${encodeURIComponent(
        dataString,
      )}&chs=200x200&choe=UTF-8&chld=L|2`

      setQrUrl(url)
    } catch (error) {
      console.error("Error generating QR code:", error)
    }
  }, [data])

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
    return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`p-4 bg-white rounded-lg shadow-md ${expired ? "opacity-50" : ""} relative`}>
        {qrUrl ? (
          <div className="w-[200px] h-[200px] flex items-center justify-center">
            <img
              src={qrUrl || "/placeholder.svg"}
              alt="QR Code"
              width={200}
              height={200}
              className="border-2 border-gray-300 p-2 rounded"
            />
          </div>
        ) : (
          <div className="w-[200px] h-[200px] bg-gray-200 animate-pulse flex items-center justify-center">
            <p className="text-gray-500 text-sm text-center">Generating QR code...</p>
          </div>
        )}

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

      <p className="mt-2 text-sm text-gray-600 text-center">Show this QR code to the cashier to collect your order</p>
    </div>
  )
}

