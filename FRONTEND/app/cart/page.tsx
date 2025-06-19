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
import { Minus, Plus, Trash2, Check } from "lucide-react"
import Image from "next/image"

export default function CartPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "iPhone 16 Pro Max",
      price: 31990000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
      color: "Xanh tím",
      storage: "256GB",
    },
    {
      id: 2,
      name: "AirPods Pro 2",
      price: 6790000,
      quantity: 1,
      image: "/placeholder.svg?height=100&width=100",
      color: "Trắng",
      storage: "",
    },
  ])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity: newQuantity } : item)))
  }

  const removeItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 2000000 ? 0 : 50000
  const total = subtotal + shipping

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price)
  }

  const steps = [
    { number: 1, title: "Giỏ hàng", description: "Xem lại sản phẩm" },
    { number: 2, title: "Thanh toán", description: "Thông tin giao hàng" },
    { number: 3, title: "Hoàn tất", description: "Xác nhận đơn hàng" },
  ]

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
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep >= step.number ? "bg-yellow-600 text-black" : "bg-gray-700 text-gray-400"
                  }`}
                >
                  {currentStep > step.number ? <Check className="h-5 w-5" /> : step.number}
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
                      <div key={item.id} className="flex items-center space-x-4 p-4 bg-gray-700 rounded-lg">
                        <Image
                          src={item.image || "/placeholder.svg"}
                          alt={item.name}
                          width={80}
                          height={80}
                          className="rounded-lg bg-gray-600"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold text-white">{item.name}</h3>
                          <p className="text-gray-400 text-sm">
                            {item.color} {item.storage && `• ${item.storage}`}
                          </p>
                          <p className="text-yellow-400 font-medium">{formatPrice(item.price)}</p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="border-gray-600"
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                          <span className="text-white w-8 text-center">{item.quantity}</span>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="border-gray-600"
                          >
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeItem(item.id)}
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName" className="text-gray-300">
                        Họ
                      </Label>
                      <Input id="firstName" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="lastName" className="text-gray-300">
                        Tên
                      </Label>
                      <Input id="lastName" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="phone" className="text-gray-300">
                      Số điện thoại
                    </Label>
                    <Input id="phone" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div>
                    <Label htmlFor="address" className="text-gray-300">
                      Địa chỉ
                    </Label>
                    <Input id="address" className="bg-gray-700 border-gray-600 text-white" />
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city" className="text-gray-300">
                        Thành phố
                      </Label>
                      <Input id="city" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="district" className="text-gray-300">
                        Quận/Huyện
                      </Label>
                      <Input id="district" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                    <div>
                      <Label htmlFor="ward" className="text-gray-300">
                        Phường/Xã
                      </Label>
                      <Input id="ward" className="bg-gray-700 border-gray-600 text-white" />
                    </div>
                  </div>

                  <Separator className="bg-gray-600" />

                  <div>
                    <Label className="text-gray-300 text-lg font-semibold">Phương thức thanh toán</Label>
                    <RadioGroup defaultValue="cod" className="mt-4">
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
                      Đơn hàng #DH001234 đã được tạo thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất.
                    </p>
                    <Badge className="bg-yellow-600 text-black">Đang xử lý</Badge>
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
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Phí vận chuyển</span>
                  <span>{shipping === 0 ? "Miễn phí" : formatPrice(shipping)}</span>
                </div>
                <Separator className="bg-gray-600" />
                <div className="flex justify-between text-white font-semibold text-lg">
                  <span>Tổng cộng</span>
                  <span className="text-yellow-400">{formatPrice(total)}</span>
                </div>

                {currentStep < 3 && (
                  <Button
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                    onClick={() => setCurrentStep(currentStep + 1)}
                  >
                    {currentStep === 1 ? "Tiến hành thanh toán" : "Hoàn tất đặt hàng"}
                  </Button>
                )}

                {currentStep > 1 && currentStep < 3 && (
                  <Button
                    variant="outline"
                    className="w-full border-gray-600 text-gray-300"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Quay lại
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
