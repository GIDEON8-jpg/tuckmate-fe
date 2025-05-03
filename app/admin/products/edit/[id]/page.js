"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save, X } from "lucide-react"
import AdminLayout from "@/components/admin-layout"
import { useProducts } from "@/contexts/product-context"

export default function EditProduct({ params }) {
  const { id } = params
  const [product, setProduct] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    barcode: "",
    image: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState("")
  const [categories, setCategories] = useState(["Food", "Drinks", "Snacks", "Stationery"])
  const router = useRouter()
  const { getProductById, updateProduct } = useProducts()

  useEffect(() => {
    // Check if admin is authenticated
    const token = localStorage.getItem("admin-token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    // Fetch product data
    const fetchProduct = async () => {
      setIsLoading(true)
      try {
        const foundProduct = getProductById(Number.parseInt(id))

        if (foundProduct) {
          setProduct(foundProduct)
        } else {
          throw new Error("Product not found")
        }
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setError(error.message)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [id, router, getProductById])

  const handleChange = (e) => {
    const { name, value } = e.target
    setProduct((prev) => ({
      ...prev,
      [name]: name === "price" || name === "stock" ? Number.parseFloat(value) || "" : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSaving(true)
    setError("")

    try {
      // Validate form
      if (!product.name || !product.price || !product.category || !product.stock || !product.barcode) {
        throw new Error("Please fill in all required fields")
      }

      // Update the product using our context
      updateProduct(product)

      // Redirect to products page after successful update
      router.push("/admin/products")
    } catch (error) {
      setError(error.message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center">
            <button onClick={() => router.back()} className="mr-4 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => router.push("/admin/products")}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 flex items-center"
            >
              <X className="h-5 w-5 mr-2" />
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading || isSaving}
              className="bg-gray-800 text-white px-4 py-2 rounded-lg flex items-center disabled:opacity-50"
            >
              <Save className="h-5 w-5 mr-2" />
              {isSaving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={product.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={product.category}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    required
                  >
                    <option value="">Select a category</option>
                    {categories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($) *
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    value={product.price}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    placeholder="0.00"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="stock" className="block text-sm font-medium text-gray-700 mb-1">
                    Stock Quantity *
                  </label>
                  <input
                    type="number"
                    id="stock"
                    name="stock"
                    value={product.stock}
                    onChange={handleChange}
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    placeholder="0"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="barcode" className="block text-sm font-medium text-gray-700 mb-1">
                    Barcode *
                  </label>
                  <input
                    type="text"
                    id="barcode"
                    name="barcode"
                    value={product.barcode}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    placeholder="Enter product barcode"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <input
                    type="text"
                    id="image"
                    name="image"
                    value={product.image}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                    placeholder="Enter image URL"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={product.description}
                  onChange={handleChange}
                  rows="4"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-gray-500 text-black"
                  placeholder="Enter product description"
                ></textarea>
              </div>
            </form>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}

