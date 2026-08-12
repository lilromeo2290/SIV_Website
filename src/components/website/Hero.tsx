'use client'

import { useEffect, useState } from 'react'
import { Wrench, Zap, Clock, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'

const heroImages = [
  '/gallery/gallery-1.jpeg',
  '/gallery/gallery-2.jpeg',
  '/gallery/gallery-3.jpeg',
  '/gallery/gallery-4.jpeg',
  '/gallery/gallery-5.jpeg',
  '/gallery/gallery-6.jpeg',
]

const stats = [
  { icon: Clock, value: '15+', label: 'Years Experience' },
  { icon: Wrench, value: '10,000+', label: 'Vehicles Serviced' },
  { icon: ShieldCheck, value: '50+', label: 'Expert Technicians' },
  { icon: Zap, value: '98%', label: 'Customer Satisfaction' },
]

export function Hero() {
  const [currentImage, setCurrentImage] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % heroImages.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const handleScroll = (id: string) => {
    document.querySelector(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section
      id="home"
      className="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-4 py-16 md:py-24"
    >
      {/* Background Image Slideshow */}
      <div className="pointer-events-none absolute inset-0">
        {heroImages.map((img, i) => (
          <div
            key={img}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000"
            style={{
              backgroundImage: `url(${img})`,
              opacity: i === currentImage ? 1 : 0,
            }}
          />
        ))}
        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/50 via-slate-900/40 to-amber-900/30" />
      </div>

      <div className="relative z-10 mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-sm text-white/90 backdrop-blur-sm">
          <Wrench className="size-4" />
          Trusted Automotive Experts Since 2009
        </div>

        {/* Headline */}
        <h1 className="mb-6 text-4xl font-extrabold leading-tight tracking-tight text-white drop-shadow-lg sm:text-5xl md:text-6xl">
          Expert Auto Repair &{' '}
          <span className="text-amber-400">Maintenance Services</span>
        </h1>

        {/* Subheadline */}
        <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-white/90 drop-shadow-md md:text-xl">
          Trusted by thousands of vehicle owners for over 15 years.
          Professional mechanical work, electrical diagnostics, engine
          servicing, and more.
        </p>

        {/* CTAs */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="h-12 px-8 text-base font-semibold"
            onClick={() => handleScroll('#appointment')}
          >
            Book a Service
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-12 border-white/30 bg-white/10 px-8 text-base font-semibold text-white backdrop-blur-sm hover:bg-white/20 hover:text-white"
            onClick={() => handleScroll('#quote')}
          >
            Get a Quote
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="relative z-10 mx-auto mt-16 grid w-full max-w-4xl grid-cols-2 gap-4 sm:gap-6 md:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex flex-col items-center gap-2 rounded-xl border border-white/10 bg-white/5 p-4 text-center backdrop-blur-sm"
          >
            <stat.icon className="size-6 text-amber-400" />
            <span className="text-2xl font-bold text-white">{stat.value}</span>
            <span className="text-xs text-white/70 sm:text-sm">
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}
