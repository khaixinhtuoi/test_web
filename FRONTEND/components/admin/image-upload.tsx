"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Image as ImageIcon, Loader2 } from "lucide-react"
import { uploadAPI } from "@/lib/api"
import { toast } from "sonner"
import Image from "next/image"

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  disabled?: boolean
  label?: string
  required?: boolean
}

export function ImageUpload({
  value,
  onChange,
  onError,
  disabled = false,
  label = "Hình ảnh sản phẩm",
  required = false
}: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedFilename, setUploadedFilename] = useState<string>("")
  const [showUrlInput, setShowUrlInput] = useState(false)
  const [urlInput, setUrlInput] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Handle file upload
  const handleFileUpload = async (file: File) => {
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      const error = "Chỉ cho phép upload file ảnh"
      toast.error(error)
      onError?.(error)
      return
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      const error = "File quá lớn. Kích thước tối đa là 5MB"
      toast.error(error)
      onError?.(error)
      return
    }

    setIsUploading(true)
    try {
      const result = await uploadAPI.uploadImage(file)
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}${result.url}`
      onChange(fullUrl)
      setUploadedFilename(result.filename)
      toast.success("Upload ảnh thành công")
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || "Lỗi khi upload ảnh"
      toast.error(errorMessage)
      onError?.(errorMessage)
    } finally {
      setIsUploading(false)
    }
  }

  // Handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  // Handle drag and drop
  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  // Handle URL input
  const handleUrlSubmit = () => {
    if (urlInput.trim()) {
      onChange(urlInput.trim())
      setUrlInput("")
      setShowUrlInput(false)
      toast.success("Đã cập nhật URL ảnh")
    }
  }

  // Clear image
  const handleClear = async () => {
    if (uploadedFilename) {
      try {
        await uploadAPI.deleteImage(uploadedFilename)
        toast.success("Đã xóa ảnh")
      } catch (error) {
        console.error("Error deleting image:", error)
      }
    }
    onChange("")
    setUploadedFilename("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <Label className="text-gray-300">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      {/* Image Preview */}
      {value && (
        <Card className="bg-gray-700 border-gray-600">
          <CardContent className="p-4">
            <div className="relative">
              <Image
                src={value}
                alt="Preview"
                width={200}
                height={200}
                className="w-full h-48 object-contain bg-gray-800 rounded-lg"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = "/placeholder.svg?height=200&width=200"
                }}
              />
              <Button
                type="button"
                size="sm"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={handleClear}
                disabled={disabled || isUploading}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Area */}
      {!value && (
        <Card className="bg-gray-700 border-gray-600 border-dashed">
          <CardContent className="p-6">
            <div
              className="text-center cursor-pointer"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <Loader2 className="h-12 w-12 text-yellow-500 animate-spin mb-4" />
                  <p className="text-gray-300">Đang upload...</p>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <Upload className="h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-300 mb-2">
                    Kéo thả ảnh vào đây hoặc click để chọn file
                  </p>
                  <p className="text-gray-500 text-sm">
                    Hỗ trợ: JPG, PNG, GIF (tối đa 5MB)
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled || isUploading}
      />

      {/* Action buttons */}
      <div className="flex gap-2">
        {!value && (
          <Button
            type="button"
            variant="outline"
            onClick={() => fileInputRef.current?.click()}
            disabled={disabled || isUploading}
            className="border-gray-600 text-gray-300"
          >
            <ImageIcon className="h-4 w-4 mr-2" />
            Chọn ảnh
          </Button>
        )}

        <Button
          type="button"
          variant="outline"
          onClick={() => setShowUrlInput(!showUrlInput)}
          disabled={disabled || isUploading}
          className="border-gray-600 text-gray-300"
        >
          Nhập URL
        </Button>
      </div>

      {/* URL Input */}
      {showUrlInput && (
        <div className="flex gap-2">
          <Input
            placeholder="Nhập URL ảnh..."
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-gray-700 border-gray-600 text-white"
            disabled={disabled || isUploading}
          />
          <Button
            type="button"
            onClick={handleUrlSubmit}
            disabled={disabled || isUploading || !urlInput.trim()}
            className="bg-yellow-600 hover:bg-yellow-700 text-black"
          >
            OK
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowUrlInput(false)
              setUrlInput("")
            }}
            disabled={disabled || isUploading}
            className="border-gray-600 text-gray-300"
          >
            Hủy
          </Button>
        </div>
      )}
    </div>
  )
}
