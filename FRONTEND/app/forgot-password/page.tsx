"use client"

import type React from "react"

import { useState } from "react"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Mail, Check } from "lucide-react"
import Link from "next/link"

export default function ForgotPasswordPage() {
  const [step, setStep] = useState<"email" | "sent" | "reset">("email")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("sent")
    }, 2000)
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false)
      setStep("reset")
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-black">
      <Header />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-md mx-auto">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <div className="flex items-center mb-4">
                <Link href="/auth" className="text-gray-400 hover:text-white mr-4">
                  <ArrowLeft className="h-5 w-5" />
                </Link>
                <CardTitle className="text-white">
                  {step === "email" && "Quên mật khẩu"}
                  {step === "sent" && "Kiểm tra email"}
                  {step === "reset" && "Đặt lại mật khẩu"}
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              {step === "email" && (
                <form onSubmit={handleSendEmail} className="space-y-4">
                  <div className="text-center mb-6">
                    <Mail className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-gray-300">
                      Nhập địa chỉ email của bạn và chúng tôi sẽ gửi cho bạn liên kết để đặt lại mật khẩu.
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-gray-300">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang gửi..." : "Gửi liên kết đặt lại"}
                  </Button>
                </form>
              )}

              {step === "sent" && (
                <div className="text-center">
                  <Check className="h-12 w-12 text-green-500 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-white mb-2">Email đã được gửi!</h3>
                  <p className="text-gray-300 mb-6">
                    Chúng tôi đã gửi liên kết đặt lại mật khẩu đến email của bạn. Vui lòng kiểm tra hộp thư và làm theo
                    hướng dẫn.
                  </p>
                  <Button
                    onClick={() => setStep("reset")}
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black mb-4"
                  >
                    Tôi đã nhận được email
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setStep("email")}
                    className="w-full border-gray-600 text-gray-300"
                  >
                    Gửi lại email
                  </Button>
                </div>
              )}

              {step === "reset" && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                  <div className="text-center mb-6">
                    <p className="text-gray-300">Nhập mật khẩu mới cho tài khoản của bạn.</p>
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="text-gray-300">
                      Mật khẩu mới
                    </Label>
                    <Input
                      id="newPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmNewPassword" className="text-gray-300">
                      Xác nhận mật khẩu mới
                    </Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      className="bg-gray-700 border-gray-600 text-white"
                      required
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-yellow-600 hover:bg-yellow-700 text-black"
                    disabled={isLoading}
                  >
                    {isLoading ? "Đang cập nhật..." : "Đặt lại mật khẩu"}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
