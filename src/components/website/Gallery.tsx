'use client'

import { useRef, useEffect, useState } from 'react'
import Image from 'next/image'
import { Card } from '@/components/ui/card'
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface GalleryItem {
  image: string
  title: string
}

const galleryItems: GalleryItem[] = [
  {
    image: '/gallery/gallery-1.jpeg',
    title: 'Professional Engineering & Diagnostics',
  },
  {
    image: '/gallery/gallery-2.jpeg',
    title: 'Expert Mechanical Repairs & Maintenance',
  },
  {
    image: '/gallery/gallery-3.jpeg',
    title: 'Advanced Vehicle Diagnostics & Testing',
  },
  {
    image: '/gallery/gallery-4.jpeg',
    title: 'Complete Engine Overhaul & Rebuild',
  },
  {
    image: '/gallery/gallery-5.jpeg',
    title: 'Electrical System Repair & Wiring',
  },
  {
    image: '/gallery/gallery-6.jpeg',
    title: 'Fleet Vehicle Maintenance & Servicing',
  },
]

export function Gallery() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const getCardWidth = (): number => {
    if (!containerRef.current) return 0
    // Matches CSS: w-[85vw] on mobile, sm:w-[calc(50%-12px)], lg:w-[calc(33.333%-16px)]
    const firstCard = containerRef.current.querySelector('[class*="shrink-0"]') as HTMLElement
    if (firstCard) return firstCard.offsetWidth
    return containerRef.current.offsetWidth
  }

  const scrollNext = () => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = getCardWidth()
    const gap = 24 // gap-6 = 24px
    const step = cardWidth + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    if (container.scrollLeft + step >= maxScroll - 1) {
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' })
    }
  }

  const scrollPrev = () => {
    const container = containerRef.current
    if (!container) return
    const cardWidth = getCardWidth()
    const gap = 24
    const step = cardWidth + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    if (container.scrollLeft - step <= 1) {
      container.scrollTo({ left: maxScroll, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: -step, behavior: 'smooth' })
    }
  }

  // Auto-scroll using native scrollLeft — no stale closure issues
  useEffect(() => {
    if (!isPlaying) {
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
      return
    }

    // Small delay to ensure container is mounted and has dimensions
    const startTimer = () => {
      timerRef.current = setInterval(scrollNext, 3000)
    }

    // Use requestAnimationFrame to ensure DOM is ready
    const raf = requestAnimationFrame(() => {
      startTimer()
    })

    return () => {
      cancelAnimationFrame(raf)
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [isPlaying])

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
        <div className="relative group">
          {/* Overflow Container */}
          <div
            ref={containerRef}
            className="overflow-x-auto scroll-smooth rounded-2xl snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {/* Cards Track */}
            <div className="flex gap-6 p-1">
              {galleryItems.map((item) => (
                <Card
                  key={item.title}
                  className="shrink-0 overflow-hidden py-0 transition-transform duration-300 hover:scale-[1.02] snap-start w-[85vw] sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <div className="relative h-72 overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity duration-300 hover:bg-background group-hover:opacity-100"
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
