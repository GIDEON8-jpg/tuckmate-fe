import { NextResponse } from "next/server"

export async function GET(request, { params }) {
  const { barcode } = params

  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 800))

  // In a real app, you would fetch from a database
  // For now, we'll return a 404 since we're using client-side state
  return NextResponse.json({ error: "Product not found" }, { status: 404 })
}

