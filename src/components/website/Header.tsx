'use client'

import { useState } from 'react'
import { Menu, Phone, Mail } from 'lucide-react'
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
  { label: 'Contact', href: '#contact' },
  { label: 'CRM PORTAL', href: '/crm' },
]

export function Header() {
  const [open, setOpen] = useState(false)

  const handleLinkClick = (href: string) => {
    setOpen(false)
    // If it's a page route (not an anchor), let default navigation happen
    if (!href.startsWith('#')) return
    const el = document.querySelector(href)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div className="sticky top-0 z-40 w-full">
      {/* Top Bar - Contact Info */}
      <div className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-end gap-6 px-4 py-1.5 text-xs md:px-8 md:text-sm">
          <a
            href="tel:+233206716522"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-400"
          >
            <Phone className="h-3.5 w-3.5" />
            <span className="font-medium">+233 20 671 6522</span>
          </a>
          <a
            href="mailto:info@sivgh.com"
            className="flex items-center gap-1.5 transition-colors hover:text-amber-400"
          >
            <Mail className="h-3.5 w-3.5" />
            <span className="font-medium">info@sivgh.com</span>
          </a>
        </div>
      </div>
      {/* Main Header */}
      <header className="border-b bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <div className="flex items-center justify-between py-2">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => {
              e.preventDefault()
              handleLinkClick('#home')
            }}
            className="flex flex-col"
          >
            <div className="flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SIV Engineering & Diagnostics Services LTD"
                width={260}
                height={68}
                className="h-14 w-auto object-contain drop-shadow-sm"
                priority
              />
              <Image
                src="/logo2.png"
                alt="SIV Engineering & Diagnostics Services LTD"
                width={260}
                height={68}
                className="h-14 w-auto object-contain drop-shadow-sm"
              />
            </div>
            <p className="-mt-3 ml-28 sm:ml-44 text-xs font-semibold italic tracking-wide text-primary sm:text-sm">
              Engineering Excellence, Diagnostic Precision
            </p>
          </a>

          {/* Desktop Nav */}
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => {
                  if (link.href.startsWith('#')) {
                    e.preventDefault()
                  }
                  handleLinkClick(link.href)
                }}
                className="rounded-md px-3 py-2 text-sm font-bold text-muted-foreground transition-colors hover:text-foreground"
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
                      className="h-10 w-auto object-contain drop-shadow-sm"
                    />
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4 pt-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        if (link.href.startsWith('#')) {
                          e.preventDefault()
                        }
                        handleLinkClick(link.href)
                      }}
                      className="rounded-md px-3 py-2.5 text-sm font-bold text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
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
    </div>
  )
}