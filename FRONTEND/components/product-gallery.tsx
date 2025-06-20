"use client"

import { useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { ZoomIn, ZoomOut, X } from "lucide-react"

interface ProductGalleryProps {
  images: string[]
  productName: string
  className?: string
}

export function ProductGallery({ images, productName, className = "" }: ProductGalleryProps) {
  const [mainImage, setMainImage] = useState(images[0] || "/placeholder.svg")
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 })

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement
    target.src = "/placeholder.svg?height=500&width=500"
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return
    
    const rect = e.currentTarget.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    
    setZoomPosition({ x, y })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Main Image */}
      <div className="relative bg-gray-800 rounded-lg p-8 overflow-hidden">
        <div 
          className="relative cursor-zoom-in"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          <Image
            src={mainImage}
            alt={productName}
            width={500}
            height={500}
            className={`w-full h-auto object-contain transition-transform duration-200 ${
              isZoomed ? 'scale-150' : 'scale-100'
            }`}
            style={
              isZoomed
                ? {
                    transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                  }
                : {}
            }
            onError={handleImageError}
          />
        </div>
        
        {/* Zoom indicator */}
        {!isZoomed && (
          <div className="absolute top-4 right-4 bg-black/50 rounded-full p-2">
            <ZoomIn className="h-4 w-4 text-white" />
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 ? (
        <div className="flex space-x-3 overflow-x-auto pb-2">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setMainImage(image)}
              className={`flex-shrink-0 w-20 h-20 bg-gray-800 rounded-lg p-2 border-2 transition-colors ${
                mainImage === image 
                  ? "border-yellow-600" 
                  : "border-transparent hover:border-gray-600"
              }`}
            >
              <Image
                src={image}
                alt={`${productName} ${index + 1}`}
                width={80}
                height={80}
                className="w-full h-full object-contain"
                onError={handleImageError}
              />
            </button>
          ))}
        </div>
      ) : (
        // Single image thumbnail
        <div className="flex space-x-3">
          <div className="w-20 h-20 bg-gray-800 rounded-lg p-2 border-2 border-yellow-600">
            <Image
              src={mainImage}
              alt={productName}
              width={80}
              height={80}
              className="w-full h-full object-contain"
              onError={handleImageError}
            />
          </div>
        </div>
      )}
    </div>
  )
}
