'use client'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const navLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About Us', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Testimonials', href: '#testimonials' },
  { label: 'Contact', href: '#contact' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = (href: string) => {
    setOpen(false)
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#home')
            }}
            className="flex items-center gap-2"
          >
            <Image
              src="/logo.png"
              alt="SIV Engineering & Diagnostics Services LTD"
              width={220}
              height={56}
              className="h-14 w-auto object-contain"
              priority
            />
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  e.preventDefault()
                  handleLinkClick(link.href)
                }}
                className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA + Mobile Menu */}
          <div className="flex items-center gap-2">
            <Button
              className="hidden md:inline-flex"
              onClick={() => handleLinkClick('#quote')}
            >
              Get a Quote
            </Button>

            {/* Mobile Menu */}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild className="md:hidden">
                <Button variant="ghost" size="icon">
                  <Menu className="size-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-72">
                <SheetHeader>
                  <SheetTitle className="flex items-center gap-2">
                    <Image
                      src="/logo.png"
                      alt="SIV Engineering"
                      width={180}
                      height={44}
                      className="h-10 w-auto object-contain"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 pt-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault()
                        handleLinkClick(link.href)
                      }}
                      className="rounded-md px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                    >
                      {link.label}
                    </a>
                  ))}
                  <div className="pt-4">
                    <Button
                      className="w-full"
                      onClick={() => handleLinkClick('#quote')}
                    >
                      Get a Quote
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}