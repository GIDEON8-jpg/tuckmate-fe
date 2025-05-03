"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Create the context
const ProductContext = createContext()

// Initial products data
const initialProducts = [
  {
    id: 1,
    name: "Chicken Pie",
    description: "Freshly baked chicken pie",
    price: 2.5,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
    stock: 15,
    barcode: "1234567890",
  },
  {
    id: 2,
    name: "Beef Pie",
    description: "Delicious beef pie",
    price: 2.75,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
    stock: 10,
    barcode: "1234567891",
  },
  {
    id: 3,
    name: "Coca Cola 500ml",
    description: "Refreshing cola drink",
    price: 1.0,
    category: "Drinks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 25,
    barcode: "1234567892",
  },
  {
    id: 4,
    name: "Fanta Orange 500ml",
    description: "Orange flavored soda",
    price: 1.0,
    category: "Drinks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 20,
    barcode: "1234567893",
  },
  {
    id: 5,
    name: "Chocolate Bar",
    description: "Sweet milk chocolate",
    price: 0.75,
    category: "Snacks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 3, // Low stock item
    barcode: "1234567894",
  },
  {
    id: 6,
    name: "Potato Chips",
    description: "Crispy salted chips",
    price: 0.85,
    category: "Snacks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 0, // Out of stock item
    barcode: "1234567895",
  },
  {
    id: 7,
    name: "Sandwich",
    description: "Fresh chicken and mayo sandwich",
    price: 1.5,
    category: "Food",
    image: "/placeholder.svg?height=200&width=200",
    stock: 5, // Low stock item
    barcode: "1234567896",
  },
  {
    id: 8,
    name: "Water 500ml",
    description: "Bottled mineral water",
    price: 0.5,
    category: "Drinks",
    image: "/placeholder.svg?height=200&width=200",
    stock: 40,
    barcode: "1234567897",
  },
]

// Create a provider component
export function ProductProvider({ children }) {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Load products from localStorage or use initial data
    const loadProducts = () => {
      try {
        const savedProducts = JSON.parse(localStorage.getItem("products"))
        if (savedProducts && savedProducts.length > 0) {
          setProducts(savedProducts)
        } else {
          // If no products in localStorage, use initial data
          setProducts(initialProducts)
          localStorage.setItem("products", JSON.stringify(initialProducts))
        }
      } catch (error) {
        console.error("Failed to load products:", error)
        setProducts(initialProducts)
        localStorage.setItem("products", JSON.stringify(initialProducts))
      } finally {
        setLoading(false)
      }
    }

    loadProducts()

    // Listen for storage events from other tabs/windows
    const handleStorageChange = (e) => {
      if (e.key === "products") {
        loadProducts()
      }
    }

    window.addEventListener("storage", handleStorageChange)

    return () => {
      window.removeEventListener("storage", handleStorageChange)
    }
  }, [])

  // Add a new product
  const addProduct = (product) => {
    // Generate a new ID (highest ID + 1)
    const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
    const newProduct = { ...product, id: newId }

    const newProducts = [...products, newProduct]
    setProducts(newProducts)
    localStorage.setItem("products", JSON.stringify(newProducts))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))

    return newProduct
  }

  // Update an existing product
  const updateProduct = (updatedProduct) => {
    const updatedProducts = products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product))

    setProducts(updatedProducts)
    localStorage.setItem("products", JSON.stringify(updatedProducts))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))

    return updatedProduct
  }

  // Delete a product
  const deleteProduct = (productId) => {
    const filteredProducts = products.filter((product) => product.id !== productId)

    setProducts(filteredProducts)
    localStorage.setItem("products", JSON.stringify(filteredProducts))

    // Dispatch storage event to notify other components
    window.dispatchEvent(new Event("storage"))

    // Also update cart to remove deleted products
    try {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      const updatedCart = cart.filter((item) => item.id !== productId)
      localStorage.setItem("cart", JSON.stringify(updatedCart))
    } catch (error) {
      console.error("Failed to update cart after product deletion:", error)
    }

    return productId
  }

  // Get a product by ID
  const getProductById = (productId) => {
    return products.find((product) => product.id === productId) || null
  }

  // Get a product by barcode
  const getProductByBarcode = (barcode) => {
    return products.find((product) => product.barcode === barcode) || null
  }

  return (
    <ProductContext.Provider
      value={{
        products,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        getProductByBarcode,
      }}
    >
      {children}
    </ProductContext.Provider>
  )
}

// Custom hook to use the product context
export function useProducts() {
  const context = useContext(ProductContext)
  if (context === undefined) {
    throw new Error("useProducts must be used within a ProductProvider")
  }
  return context
}

