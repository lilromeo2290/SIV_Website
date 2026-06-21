'use client'

import { Phone, Mail, MapPin } from 'lucide-react'
import Image from 'next/image'
import { Separator } from '@/components/ui/separator'

const quickLinks = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Services', href: '#services' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const serviceLinks = [
  'Mechanical Work',
  'Electrical Work',
  'Engine Servicing',
  'Air Conditioning',
  'Brake Repairs',
]

const socialLinks = [
  { label: 'Facebook', href: '#' },
  { label: 'Twitter', href: '#' },
  { label: 'Instagram', href: '#' },
  { label: 'LinkedIn', href: '#' },
]

export function Footer() {
  const handleClick = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <footer className="bg-slate-900 text-white">
      <div className="mx-auto max-w-7xl px-4 py-12 md:px-8 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {/* Company Info */}
          <div>
            <div className="mb-4 flex items-center gap-2">
              <Image
                src="/logo.png"
                alt="SIV Engineering & Diagnostics Services LTD"
                width={200}
                height={50}
                className="mb-4 h-12 w-auto object-contain"
              />
            </div>
            <p className="mb-6 text-sm leading-relaxed text-slate-400">
              Your trusted partner for all automotive repair and maintenance
              needs. Professional service with 15+ years of experience.
            </p>
            {/* Social Icons */}
            <div className="flex gap-3">
              {socialLinks.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-slate-400 transition-colors hover:bg-primary hover:text-white"
                >
                  <span className="text-xs font-bold">
                    {s.label.charAt(0)}
                  </span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    onClick={handleClick(link.href)}
                    className="text-sm text-slate-400 transition-colors hover:text-amber-400"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Services
            </h3>
            <ul className="space-y-2.5">
              {serviceLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#services"
                    onClick={handleClick('#services')}
                    className="text-sm text-slate-400 transition-colors hover:text-amber-400"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-wider text-white">
              Contact Info
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2.5">
                <MapPin className="mt-0.5 size-4 shrink-0 text-amber-400" />
                <span className="text-sm text-slate-400">
                  123 Auto Street, Industrial Area
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="size-4 shrink-0 text-amber-400" />
                <span className="text-sm text-slate-400">
                  +1 (555) 123-4567
                </span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="size-4 shrink-0 text-amber-400" />
                <span className="text-sm text-slate-400">
                  info@sivengineering.com
                </span>
              </li>
            </ul>
          </div>
        </div>

        <Separator className="my-8 bg-slate-700" />

        {/* Bottom Bar */}
        <p className="text-center text-sm font-bold text-slate-400">
          © 2026 SIV Engineering & Diagnostics Services LTD. All rights reserved.<br />
          Powered & Developed by{' '}
          <a
            href="https://clipe233eng.net/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-amber-400 transition-colors hover:text-amber-300"
          >
            Clipe233 Engineers
          </a>
        </p>
      </div>
    </footer>
  )
}