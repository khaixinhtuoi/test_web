"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Minus, Plus, Trash2, Check, Loader2, ShoppingCart, CreditCard, Package } from "lucide-react"
import Image from "next/image"
import { useCart, useUpdateCartItem, useRemoveFromCart, useClearCart } from "@/hooks/use-cart"
import { useCreateOrder } from "@/hooks/use-orders"
import { toast } from "sonner"
import Link from "next/link"

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [orderData, setOrderData] = useState({
    shipping_recipient_name: "",
    shipping_address: "",
    payment_method: "cod",
    notes: "",
  })
  const [createdOrder, setCreatedOrder] = useState<any>(null)

  // API hooks
  const { data: cartData, isLoading: cartLoading, error: cartError } = useCart()
  const updateCartItemMutation = useUpdateCartItem()
  const removeFromCartMutation = useRemoveFromCart()
  const clearCartMutation = useClearCart()
  const createOrderMutation = useCreateOrder()

  const cartItems = cartData?.cartItems || []
  const totalAmount = cartData?.totalAmount || 0
  const totalItems = cartData?.totalItems || 0

  const updateQuantity = async (cartItemId: string, newQuantity: number) => {
    if (newQuantity < 1) return
    try {
      await updateCartItemMutation.mutateAsync({
        cartItemId,
        data: { quantity: newQuantity }
      })
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  const removeItem = async (cartItemId: string) => {
    try {
      await removeFromCartMutation.mutateAsync(cartItemId)
    } catch (error) {
      // Error được xử lý trong hook
    }
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const shipping = totalAmount >= 2000000 ? 0 : 50000
  const finalTotal = totalAmount + shipping

  const handleCheckout = async () => {
    if (!orderData.shipping_recipient_name || !orderData.shipping_address) {
      toast.error("Vui lòng điền đầy đủ thông tin giao hàng")
      return
    }

    console.log('Order data:', orderData)
    console.log('Cart items:', cartItems)

    try {
      const result = await createOrderMutation.mutateAsync(orderData)
      console.log('Order result:', result)
      setCreatedOrder(result.order)
      setCurrentStep(3)
    } catch (error) {
      console.error('Order error:', error)
      // Error được xử lý trong hook
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setOrderData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const steps = [
    { number: 1, title: "Giỏ hàng", description: "Xem lại sản phẩm", icon: ShoppingCart },
    { number: 2, title: "Thanh toán", description: "Thông tin giao hàng", icon: CreditCard },
    { number: 3, title: "Hoàn tất", description: "Xác nhận đơn hàng", icon: Package },
  ]

  // Loading state
  if (cartLoading) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-yellow-500" />
            <span className="ml-2 text-gray-400">Đang tải giỏ hàng...</span>
          </div>
        </div>
      </div>
    )
  }

  // Error state
  if (cartError) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <p className="text-red-500 mb-4">Có lỗi xảy ra khi tải giỏ hàng</p>
              <Button onClick={() => window.location.reload()}>Thử lại</Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Empty cart state
  if (cartItems.length === 0 && currentStep === 1) {
    return (
      <div className="min-h-screen bg-black">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center h-64">
            <ShoppingCart className="h-16 w-16 text-gray-500 mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">Giỏ hàng trống</h2>
            <p className="text-gray-400 mb-6">Hãy thêm sản phẩm vào giỏ hàng để tiếp tục mua sắm</p>
            <Link href="/products">
              <Button className="bg-yellow-600 hover:bg-yellow-700 text-black">
                Tiếp tục mua sắm
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-8">
        {/* Progress Steps */}
        <div className="flex items-center justify-center mb-8">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    currentStep >= step.number ? "bg-yellow-600 text-black" : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <step.icon className="h-5 w-5" />
                  )}
                </div>
                <div className="text-center mt-2">
                  <p className={`text-sm font-medium ${currentStep >= step.number ? "text-white" : "text-gray-400"}`}>
                    {step.title}
                  </p>
                  <p className="text-xs text-gray-500">{step.description}</p>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`w-20 h-0.5 mx-4 ${currentStep > step.number ? "bg-yellow-600" : "bg-gray-700"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Step 1: Cart Items */}
            {currentStep === 1 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Giỏ hàng của bạn</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                        <Image
                          src={item.product_id.image_url || "/placeholder.svg"}
                          alt={item.product_id.product_name}
                          width={80}
                          height={80}
                          className="rounded-lg bg-gray-600 object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.product_id.product_name}</h3>
                          <p className="text-gray-400 text-sm">
                            {item.product_id.brand && `${item.product_id.brand}`}
                          </p>
                          <p className="text-yellow-400 font-medium">{formatPrice(item.product_id.price)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            className="border-gray-600"
                            disabled={updateCartItemMutation.isPending}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            className="border-gray-600"
                            disabled={updateCartItemMutation.isPending}
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item._id)}
                          className="text-red-400 hover:text-red-300"
                          disabled={removeFromCartMutation.isPending}
                        >
                          {removeFromCartMutation.isPending ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Payment Information */}
            {currentStep === 2 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Thông tin giao hàng</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="recipient_name" className="text-gray-300">
                      Tên người nhận *
                    </Label>
                    <Input
                      id="recipient_name"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={orderData.shipping_recipient_name}
                      onChange={(e) => handleInputChange('shipping_recipient_name', e.target.value)}
                      placeholder="Nhập tên người nhận"
                    />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-300">
                      Địa chỉ giao hàng *
                    </Label>
                    <Input
                      id="address"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={orderData.shipping_address}
                      onChange={(e) => handleInputChange('shipping_address', e.target.value)}
                      placeholder="Nhập địa chỉ chi tiết"
                    />
                  </div>
                  <div>
                    <Label htmlFor="notes" className="text-gray-300">
                      Ghi chú đơn hàng
                    </Label>
                    <Input
                      id="notes"
                      className="bg-gray-700 border-gray-600 text-white"
                      value={orderData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      placeholder="Ghi chú thêm cho đơn hàng (tùy chọn)"
                    />
                  </div>
                  <Separator className="bg-gray-600" />

                  <div>
                    <Label className="text-gray-300 text-lg font-semibold">Phương thức thanh toán</Label>
                    <RadioGroup
                      value={orderData.payment_method}
                      onValueChange={(value) => handleInputChange('payment_method', value)}
                      className="mt-4"
                    >
                      <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
                        <RadioGroupItem value="cod" id="cod" />
                        <Label htmlFor="cod" className="text-white">
                          Thanh toán khi nhận hàng (COD)
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
                        <RadioGroupItem value="bank" id="bank" />
                        <Label htmlFor="bank" className="text-white">
                          Chuyển khoản ngân hàng
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-3 bg-gray-700 rounded-lg">
                        <RadioGroupItem value="momo" id="momo" />
                        <Label htmlFor="momo" className="text-white">
                          Ví MoMo
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Order Confirmation */}
            {currentStep === 3 && (
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Check className="h-6 w-6 text-green-500 mr-2" />
                    Đặt hàng thành công!
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Check className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-2">Cảm ơn bạn đã đặt hàng!</h3>
                    <p className="text-gray-400 mb-4">
                      Đơn hàng #{createdOrder?.order_number || 'N/A'} đã được tạo thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    <div className="space-y-2 mb-4">
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Người nhận:</span> {createdOrder?.shipping_recipient_name}
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Địa chỉ:</span> {createdOrder?.shipping_address}
                      </p>
                      <p className="text-sm text-gray-400">
                        <span className="font-medium">Tổng tiền:</span> {createdOrder && formatPrice(createdOrder.total_amount)}
                      </p>
                    </div>
                    <Badge className="bg-yellow-600 text-black">
                      {createdOrder?.order_status === 'pending' ? 'Đang xử lý' : createdOrder?.order_status}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-gray-800 border-gray-700 sticky top-4">
              <CardHeader>
                <CardTitle className="text-white">Tóm tắt đơn hàng</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between text-gray-300">
                  <span>Tạm tính</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Phí vận chuyển</span>
                  <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-yellow-400">{formatPrice(finalTotal)}</span>
                </div>

                {currentStep === 1 && (
                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                    onClick={() => setCurrentStep(2)}
                    disabled={cartItems.length === 0}
                  >
                    Tiến hành thanh toán
                  </Button>
                )}

                {currentStep === 2 && (
                  <div className="space-y-3">
                    <Button
                      className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                      onClick={handleCheckout}
                      disabled={createOrderMutation.isPending}
                    >
                      {createOrderMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        "Hoàn tất đặt hàng"
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-gray-600 text-gray-300"
                      onClick={() => setCurrentStep(1)}
                    >
                      Quay lại
                    </Button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-3">
                    <Link href="/profile">
                      <Button className="w-full bg-yellow-600 hover:bg-yellow-700 text-black">
                        Xem đơn hàng
                      </Button>
                    </Link>
                    <Link href="/products">
                      <Button variant="outline" className="w-full border-gray-600 text-gray-300">
                        Tiếp tục mua sắm
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
