"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface HeroSlide {
  id: number
  title: string
  subtitle: string
  description: string
  image: string
  bgColor: string
  buttonText: string
  buttonLink: string
}

interface HeroCarouselProps {
  slides: HeroSlide[]
  autoSlideInterval?: number
}

export function HeroCarousel({ slides, autoSlideInterval = 10000 }: HeroCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-slide effect
  useEffect(() => {
    if (!isAutoPlaying) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoSlideInterval)

    return () => clearInterval(timer)
  }, [slides.length, autoSlideInterval, isAutoPlaying])

  // Manual slide navigation
  const goToSlide = (index: number) => {
    setCurrentSlide(index)
    setIsAutoPlaying(false)
    // Resume auto-play after 5 seconds
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 5000)
  }

  return (
    <section className="relative h-[600px] md:h-[700px] overflow-hidden">
      <div className="relative w-full h-full">
        {/* Slides */}
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out ${
              index === currentSlide 
                ? 'translate-x-0 opacity-100' 
                : index < currentSlide 
                  ? '-translate-x-full opacity-0' 
                  : 'translate-x-full opacity-0'
            }`}
          >
            <div className={`w-full h-full bg-gradient-to-r ${slide.bgColor} relative`}>
              {/* Background overlay */}
              <div className="absolute inset-0 bg-black/40"></div>
              
              {/* Content */}
              <div className="container mx-auto px-4 h-full">
                <div className="grid lg:grid-cols-2 gap-12 items-center h-full">
                  <div className="relative z-10 text-white">
                    <span className="inline-block text-gold text-sm font-medium tracking-wider uppercase mb-4 animate-fade-in-up">
                      TechStore - Công nghệ chính hãng
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight animate-fade-in-up animation-delay-200">
                      {slide.title}
                    </h1>
                    <h2 className="text-xl md:text-2xl font-medium mb-6 text-gray-200 animate-fade-in-up animation-delay-400">
                      {slide.subtitle}
                    </h2>
                    <p className="text-lg text-gray-300 mb-8 max-w-xl animate-fade-in-up animation-delay-600">
                      {slide.description}
                    </p>
                    <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-800">
                      <Link href={slide.buttonLink}>
                        <Button size="lg" className="bg-gold hover:bg-gold-hover text-black font-medium rounded-full transform hover:scale-105 transition-all duration-300">
                          {slide.buttonText}
                        </Button>
                      </Link>
                      <Button
                        size="lg"
                        variant="outline"
                        className="border-white text-white hover:bg-white hover:text-black font-medium rounded-full transform hover:scale-105 transition-all duration-300"
                      >
                        Tìm hiểu thêm
                      </Button>
                    </div>
                  </div>
                  <div className="relative hidden lg:block">
                    <div className="absolute w-full h-full bg-gradient-to-r from-gold/20 to-transparent rounded-full blur-3xl opacity-30 animate-pulse"></div>
                    <div className="relative z-10 animate-fade-in-right animation-delay-400">
                      <Image
                        src={slide.image}
                        alt={slide.title}
                        width={600}
                        height={600}
                        className="object-contain transform hover:scale-105 transition-transform duration-700 drop-shadow-2xl"
                        priority={index === 0}
                      />
                    </div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-gold/30 rounded-full blur-3xl animate-pulse animation-delay-600"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
          aria-label="Previous slide"
        >
          <ChevronLeft className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/70 text-white p-3 rounded-full transition-all duration-300 backdrop-blur-sm hover:scale-110 group"
          aria-label="Next slide"
        >
          <ChevronRight className="h-6 w-6 group-hover:scale-110 transition-transform" />
        </button>

        {/* Dots Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex space-x-3">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 ${
                index === currentSlide 
                  ? 'bg-gold scale-125 shadow-lg shadow-gold/50' 
                  : 'bg-white/50 hover:bg-white/70'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Progress Bar */}
        <div className="absolute bottom-0 left-0 w-full h-1 bg-black/30 z-20">
          <div 
            className="h-full bg-gold transition-all duration-300 ease-linear shadow-lg shadow-gold/50"
            style={{ 
              width: `${((currentSlide + 1) / slides.length) * 100}%` 
            }}
          />
        </div>

        {/* Auto-play indicator */}
        <div className="absolute top-4 right-4 z-20">
          <div className={`w-3 h-3 rounded-full transition-all duration-300 ${
            isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-500'
          }`} />
        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(30px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }

        .animate-fade-in-right {
          animation: fade-in-right 0.8s ease-out forwards;
        }

        .animation-delay-200 {
          animation-delay: 0.2s;
        }

        .animation-delay-400 {
          animation-delay: 0.4s;
        }

        .animation-delay-600 {
          animation-delay: 0.6s;
        }

        .animation-delay-800 {
          animation-delay: 0.8s;
        }
      `}</style>
    </section>
  )
}
