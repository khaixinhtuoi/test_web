"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCart, useCartCount } from "@/hooks/use-cart"

export function DebugCart() {
  const [mounted, setMounted] = useState(false)
  const [authInfo, setAuthInfo] = useState<any>({})
  
  const { data: cartData, isLoading, error, isError } = useCart()
  const cartCount = useCartCount()

  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      setAuthInfo({
        hasToken: !!localStorage.getItem('accessToken'),
        token: localStorage.getItem('accessToken')?.substring(0, 20) + '...',
        userData: localStorage.getItem('userData'),
      })
    }
  }, [])

  if (!mounted) {
    return <div>Loading debug info...</div>
  }

  return (
    <Card className="bg-gray-800 border-gray-700 mb-4">
      <CardHeader>
        <CardTitle className="text-white text-sm">🐛 Debug Cart Info</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        <div>
          <strong className="text-yellow-400">Auth Status:</strong>
          <div className="text-gray-300 ml-2">
            <div>Has Token: {authInfo.hasToken ? '✅' : '❌'}</div>
            <div>Token: {authInfo.token || 'None'}</div>
            <div>User Data: {authInfo.userData ? '✅' : '❌'}</div>
          </div>
        </div>
        
        <div>
          <strong className="text-yellow-400">Cart Query Status:</strong>
          <div className="text-gray-300 ml-2">
            <div>Loading: {isLoading ? '⏳' : '✅'}</div>
            <div>Error: {isError ? '❌' : '✅'}</div>
            <div>Error Message: {error?.message || 'None'}</div>
          </div>
        </div>
        
        <div>
          <strong className="text-yellow-400">Cart Data:</strong>
          <div className="text-gray-300 ml-2">
            <div>Cart Count: {cartCount}</div>
            <div>Total Items: {cartData?.totalItems || 0}</div>
            <div>Total Amount: {cartData?.totalAmount || 0}</div>
            <div>Items Length: {cartData?.cartItems?.length || 0}</div>
          </div>
        </div>

        <Button 
          onClick={() => window.location.reload()} 
          size="sm" 
          className="bg-blue-600 hover:bg-blue-700"
        >
          Refresh Page
        </Button>
      </CardContent>
    </Card>
  )
}
