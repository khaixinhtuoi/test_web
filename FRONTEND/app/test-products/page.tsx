"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function TestProductsPage() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const testDirectAPI = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("Testing direct API call...")
      const response = await fetch('http://localhost:5000/api/products')
      console.log("Response status:", response.status)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      console.log("Response data:", data)
      setProducts(data.products || [])
    } catch (err) {
      console.error("API Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const testWithAxios = async () => {
    setLoading(true)
    setError("")
    try {
      console.log("Testing with axios...")
      const { publicAPI } = await import('@/lib/api')
      const data = await publicAPI.getProducts()
      console.log("Axios response:", data)
      setProducts(data.products || [])
    } catch (err) {
      console.error("Axios Error:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Test Products API</h1>
        
        <div className="space-y-4 mb-8">
          <Button 
            onClick={testDirectAPI}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 text-white mr-4"
          >
            {loading ? "Testing..." : "Test Direct Fetch"}
          </Button>
          
          <Button 
            onClick={testWithAxios}
            disabled={loading}
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            {loading ? "Testing..." : "Test with Axios"}
          </Button>
        </div>

        {error && (
          <Card className="bg-red-900 border-red-700 mb-8">
            <CardContent className="p-4">
              <h3 className="text-red-400 font-bold mb-2">Error:</h3>
              <p className="text-red-300">{error}</p>
            </CardContent>
          </Card>
        )}

        {products.length > 0 && (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <h3 className="text-white font-bold mb-4">Products ({products.length}):</h3>
              <div className="space-y-2">
                {products.slice(0, 5).map((product, index) => (
                  <div key={index} className="text-gray-300 text-sm">
                    {product.product_name} - {product.price}₫
                  </div>
                ))}
                {products.length > 5 && (
                  <div className="text-gray-400 text-sm">
                    ... and {products.length - 5} more products
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gray-800 border-gray-700 mt-8">
          <CardContent className="p-4">
            <h3 className="text-white font-bold mb-4">Debug Info:</h3>
            <div className="text-gray-300 text-sm space-y-1">
              <div>Frontend URL: {window.location.origin}</div>
              <div>Backend URL: http://localhost:5000</div>
              <div>API Endpoint: http://localhost:5000/api/products</div>
              <div>Current Time: {new Date().toLocaleString()}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
