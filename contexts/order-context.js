"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the context
const OrderContext = createContext()

// Create a provider component
export function OrderProvider({ children }) {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load orders from localStorage on mount
    const loadOrders = () => {
      try {
        const savedOrders = JSON.parse(localStorage.getItem("orders") || "[]")
        setOrders(savedOrders)
      } catch (error) {
        console.error("Failed to load orders:", error)
        setOrders([])
      } finally {
        setLoading(false)
      }
    }

    loadOrders()

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "orders") {
        loadOrders()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Add a new order
  const addOrder = (order) => {
    const newOrders = [...orders, order]
    setOrders(newOrders)
    localStorage.setItem("orders", JSON.stringify(newOrders))
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  // Update an order's status
  const updateOrderStatus = (orderId, newStatus) => {
    const updatedOrders = orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order))
    setOrders(updatedOrders)
    localStorage.setItem("orders", JSON.stringify(updatedOrders))
    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))
  }

  return (
    <OrderContext.Provider value={{ orders, loading, addOrder, updateOrderStatus }}>{children}</OrderContext.Provider>
  )
}

// Custom hook to use the order context
export function useOrders() {
  const context = useContext(OrderContext)
  if (context === undefined) {
    throw new Error("useOrders must be used within an OrderProvider")
  }
  return context
}

