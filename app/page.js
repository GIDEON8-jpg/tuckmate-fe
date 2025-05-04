"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { ShoppingCart, Search, User, ShoppingBag } from "lucide-react"
import ProductCard from "@/components/product-card"
import CategoryFilter from "@/components/category-filter"
import { useProducts } from "@/contexts/product-context"
import AppHeader from "@/components/AppHeader" // Import AppHeader

export default function Home() {
  const { products, loading: isLoading } = useProducts()
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [cartCount, setCartCount] = useState(0)
  const [cartTotal, setCartTotal] = useState(0)
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    const token = localStorage.getItem("auth-token")
    const userRole = localStorage.getItem("user-role")

    if (!token) {
      router.push("/login")
      return
    }

    if (userRole === "admin") {
      router.push("/admin/dashboard")
      return
    }

    const uniqueCategories = [...new Set(products.map((product) => product.category))]
    setCategories(uniqueCategories)

    const updateCartInfo = () => {
      const cart = JSON.parse(localStorage.getItem("cart") || "[]")
      setCartCount(cart.length)
      const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)
      setCartTotal(total)
    }

    updateCartInfo()

    window.addEventListener("storage", updateCartInfo)

    return () => {
      window.removeEventListener("storage", updateCartInfo)
    }
  }, [router, products])

  const handleCategoryChange = (category) => {
    setSelectedCategory(category)
    setSearchTerm("") // Reset search when changing category
  }

  const filteredProducts = products.filter(
      (product) =>
          (selectedCategory === "all" || product.category === selectedCategory) &&
          (product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              product.description.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <AppHeader /> {/* Include the AppHeader component */}

        {/* Search Bar */}
        <div className="sticky top-16 z-10 bg-white p-4 shadow-sm">
          <div className="container mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                  type="text"
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-black"
              />
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="container mx-auto px-4 py-3">
          <CategoryFilter
              categories={["all", ...categories]}
              selectedCategory={selectedCategory}
              onCategoryChange={handleCategoryChange}
          />
        </div>

        {/* Main Content */}
        <main className="flex-1 container mx-auto p-4">
          {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
          ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.length > 0 ? (
                    filteredProducts.map((product) => <ProductCard key={product.id} product={product} />)
                ) : (
                    <div className="col-span-full text-center py-10">
                      <p className="text-gray-500">
                        {searchTerm ? `No products found matching "${searchTerm}"` : "No products found in this category."}
                      </p>
                    </div>
                )}
              </div>
          )}
        </main>

        {/* Bottom Navigation */}
        <nav className="sticky bottom-0 bg-white border-t border-gray-200 p-2">
          <div className="container mx-auto">
            <div className="flex justify-around">
              <button onClick={() => router.push("/")} className="flex flex-col items-center p-2 text-primary">
                <Search className="h-6 w-6" />
                <span className="text-xs mt-1">Browse</span>
              </button>
              <button onClick={() => router.push("/cart")} className="flex flex-col items-center p-2 text-gray-600">
                <ShoppingCart className="h-6 w-6" />
                <span className="text-xs mt-1">Cart</span>
              </button>
              <button onClick={() => router.push("/orders")} className="flex flex-col items-center p-2 text-gray-600">
                <ShoppingBag className="h-6 w-6" />
                <span className="text-xs mt-1">Orders</span>
              </button>
              <button onClick={() => router.push("/profile")} className="flex flex-col items-center p-2 text-gray-600">
                <User className="h-6 w-6" />
                <span className="text-xs mt-1">Profile</span>
              </button>
            </div>
          </div>
        </nav>
      </div>
  )
}