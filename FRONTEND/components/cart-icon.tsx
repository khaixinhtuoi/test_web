"use client"

import { ShoppingCart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useCartCount } from "@/hooks/use-cart"
import Link from "next/link"
import { useEffect, useState } from "react"

export function CartIcon() {
  const [mounted, setMounted] = useState(false)
  const cartCount = useCartCount()

  // Đảm bảo component đã mount trước khi hiển thị cart count
  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <Button
      variant="ghost"
      size="icon"
      className="relative rounded-full bg-dark-medium text-white hover:text-gold hover:bg-dark-light"
      asChild
    >
      <Link href="/cart">
        <ShoppingCart className="h-5 w-5" />
        {mounted && cartCount > 0 && (
          <Badge className="absolute -top-2 -right-2 bg-gold text-black text-xs rounded-full h-5 w-5 flex items-center justify-center p-0 font-semibold">
            {cartCount > 99 ? '99+' : cartCount}
          </Badge>
        )}
      </Link>
    </Button>
  )
}
