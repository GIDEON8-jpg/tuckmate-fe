"use client"

import StandardQRCode from "./standard-qr-code"

export default function OrderQRCode({ order, expiryMinutes }) {
  // Determine expiry time based on payment method if not explicitly provided
  const defaultExpiryMinutes = !expiryMinutes ? (order.paymentMethod === "ecocash" ? 60 : 15) : expiryMinutes

  // Generate QR code data with order details
  // Include a fixed timestamp to ensure the QR code doesn't change
  const qrData = {
    orderId: order.id,
    total: order.total,
    items: order.items.map((item) => ({
      id: item.id,
      name: item.name,
      quantity: item.quantity,
      price: item.price,
    })),
    timestamp: order.date || new Date().toISOString(), // Use order date if available
    expiryTime: new Date(Date.now() + defaultExpiryMinutes * 60 * 1000).toISOString(),
    paymentMethod: order.paymentMethod || "cash",
  }

  return (
    <div>
      <StandardQRCode data={qrData} expiryMinutes={defaultExpiryMinutes} />
      <p className="text-sm text-gray-500 mt-3 text-center">
        If QR code expires, use order number: <span className="font-bold">{order.id}</span>
      </p>
    </div>
  )
}

