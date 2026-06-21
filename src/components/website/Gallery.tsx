'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryItem {
  image: string
  category: string
  title: string
}

const galleryItems: GalleryItem[] = [
  {
    image: '/gallery/gallery-1.jpeg',
    category: 'Engineering Work',
    title: 'Professional Engineering & Diagnostics',
  },
  {
    image: '/gallery/gallery-2.jpeg',
    category: 'Mechanical Service',
    title: 'Expert Mechanical Repairs & Maintenance',
  },
  {
    image: '/gallery/gallery-3.jpeg',
    category: 'Diagnostic Service',
    title: 'Advanced Vehicle Diagnostics & Testing',
  },
  {
    image: '/gallery/gallery-4.jpeg',
    category: 'Engine Work',
    title: 'Complete Engine Overhaul & Rebuild',
  },
  {
    image: '/gallery/gallery-5.jpeg',
    category: 'Electrical Service',
    title: 'Electrical System Repair & Wiring',
  },
  {
    image: '/gallery/gallery-6.jpeg',
    category: 'Fleet Maintenance',
    title: 'Fleet Vehicle Maintenance & Servicing',
  },
]

export function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getVisibleCount = useCallback(() => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }, [])

  const goNext = useCallback(() => {
    const visible = getVisibleCount()
    const maxIndex = galleryItems.length - visible
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1))
  }, [getVisibleCount])

  const goPrev = useCallback(() => {
    const visible = getVisibleCount()
    const maxIndex = galleryItems.length - visible
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1))
  }, [getVisibleCount])

  // Auto-scroll
  useEffect(() => {
    if (isPlaying && !isHovered) {
      timerRef.current = setInterval(goNext, 3000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPlaying, isHovered, goNext])

  // Reset index on resize
  useEffect(() => {
    const handleResize = () => {
      const visible = getVisibleCount()
      const maxIndex = galleryItems.length - visible
      if (currentIndex > maxIndex) setCurrentIndex(Math.max(0, maxIndex))
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [currentIndex, getVisibleCount])

  return (
    <section id="gallery" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Our Portfolio
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Gallery of Our Work
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Browse through some of our recent projects and see the quality of
            work we deliver.
          </p>
        </div>

        {/* Gallery Carousel */}
        <div
          className="relative group"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Overflow Container */}
          <div className="overflow-hidden rounded-2xl">
            {/* Sliding Track */}
            <div
              ref={trackRef}
              className="flex gap-6 transition-transform duration-700 ease-in-out"
              style={{
                transform: `translateX(-${currentIndex * (100 / getVisibleCount())}%)`,
              }}
            >
              {galleryItems.map((item) => (
                <Card
                  key={item.title}
                  className="shrink-0 overflow-hidden py-0 transition-transform duration-300 hover:scale-[1.02] sm:w-1/2 lg:w-1/3"
                  style={{ width: typeof window !== 'undefined' && window.innerWidth >= 1024 ? '33.333%' : typeof window !== 'undefined' && window.innerWidth >= 640 ? '50%' : '100%' }}
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={goPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={goNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Next"
          >
            <ChevronRight className="size-5" />
          </Button>

          {/* Play/Pause Toggle */}
          <div className="mt-4 flex justify-center">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="gap-2 text-muted-foreground"
            >
              {isPlaying ? (
                <>
                  <Pause className="size-4" />
                  <span className="text-xs">Pause</span>
                </>
              ) : (
                <>
                  <Play className="size-4" />
                  <span className="text-xs">Auto-play</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
