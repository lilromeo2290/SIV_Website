'use client'

import { useRef, useEffect, useState, useCallback } from 'react'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
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
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isHovered, setIsHovered] = useState(false)
  const currentIndexRef = useRef(0)

  const scrollToIndex = useCallback((index: number) => {
    const container = scrollRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-gallery-card]')
    const card = cards[index % cards.length] as HTMLElement
    if (card) {
      container.scrollTo({
        left: card.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      })
      currentIndexRef.current = index % cards.length
    }
  }, [])

  const scrollNext = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-gallery-card]')
    const card = cards[0] as HTMLElement
    if (!card) return

    const cardWidth = card.offsetWidth + 24 // card width + gap
    const maxScroll = container.scrollWidth - container.clientWidth

    if (container.scrollLeft + cardWidth >= maxScroll - 10) {
      // Loop back to start
      currentIndexRef.current = 0
      container.scrollTo({ left: 0, behavior: 'smooth' })
    } else {
      container.scrollBy({ left: cardWidth, behavior: 'smooth' })
      currentIndexRef.current = (currentIndexRef.current + 1) % cards.length
    }
  }, [])

  const scrollPrev = useCallback(() => {
    const container = scrollRef.current
    if (!container) return

    const cards = container.querySelectorAll('[data-gallery-card]')
    const card = cards[0] as HTMLElement
    if (!card) return

    const cardWidth = card.offsetWidth + 24

    if (container.scrollLeft <= 10) {
      // Loop to end
      const index = cards.length - 1
      currentIndexRef.current = index
      const lastCard = cards[index] as HTMLElement
      container.scrollTo({
        left: lastCard.offsetLeft - container.offsetLeft,
        behavior: 'smooth',
      })
    } else {
      container.scrollBy({ left: -cardWidth, behavior: 'smooth' })
      currentIndexRef.current = Math.max(0, currentIndexRef.current - 1)
    }
  }, [])

  // Auto-scroll
  useEffect(() => {
    if (!isPlaying || isHovered) return

    const interval = setInterval(scrollNext, 3000)
    return () => clearInterval(interval)
  }, [isPlaying, isHovered, scrollNext])

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
          className="relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Scroll Container */}
          <div
            ref={scrollRef}
            className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scroll-smooth"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {galleryItems.map((item) => (
              <Card
                key={item.title}
                data-gallery-card
                className="group snap-start shrink-0 w-[calc(100%-1.5rem)] sm:w-[calc(50%-1.5rem)] lg:w-[calc(25%-1.5rem)] cursor-default overflow-hidden py-0 transition-transform duration-300 hover:scale-[1.02]"
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

          {/* Navigation Arrows */}
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
            style={{ opacity: isHovered ? 1 : 0 }}
            aria-label="Previous"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={scrollNext}
            className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-background/80 shadow-lg backdrop-blur-sm opacity-0 transition-opacity hover:bg-background group-hover:opacity-100"
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
