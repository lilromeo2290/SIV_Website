'use client'

import { MapPin, Phone, Mail, Clock } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const contactInfo = [
  {
    icon: MapPin,
    label: 'Address',
    value: '123 Auto Street, Industrial Area',
  },
  {
    icon: Phone,
    label: 'Phone',
    value: '+1 (555) 123-4567',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@autoproworkshop.com',
  },
]

const businessHours = [
  { day: 'Monday – Friday', hours: '7:00 AM – 6:00 PM' },
  { day: 'Saturday', hours: '8:00 AM – 4:00 PM' },
  { day: 'Sunday', hours: 'Closed' },
]

const quickLinks = [
  'Mechanical Work',
  'Electrical Work',
  'Engine Servicing',
  'Air Conditioning',
  'Brake Repairs',
]

export function Contact() {
  return (
    <section id="contact" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Get In Touch
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Contact Us
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Have a question or need to schedule a service? Reach out to us
            through any of the channels below.
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid gap-8 lg:grid-cols-3">
          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Information</h3>
            <div className="space-y-4">
              {contactInfo.map((item) => (
                <div key={item.label} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                    <item.icon className="size-5" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.label}</p>
                    <p className="text-sm text-muted-foreground">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Business Hours */}
            <div>
              <div className="mb-3 flex items-center gap-2">
                <Clock className="size-5 text-primary" />
                <h3 className="text-lg font-semibold">Business Hours</h3>
              </div>
              <div className="space-y-2">
                {businessHours.map((b) => (
                  <div
                    key={b.day}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{b.day}</span>
                    <span className="font-medium">{b.hours}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Map Placeholder */}
          <div className="flex flex-col items-center justify-center">
            <div className="flex h-full min-h-64 w-full flex-col items-center justify-center rounded-2xl border-2 border-dashed border-muted-foreground/20 bg-muted">
              <MapPin className="mb-3 size-10 text-muted-foreground/40" />
              <p className="text-sm font-medium text-muted-foreground/60">
                Google Maps Integration
              </p>
              <p className="text-xs text-muted-foreground/40">
                123 Auto Street, Industrial Area
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Service Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link}>
                  <a
                    href="#services"
                    onClick={(e) => {
                      e.preventDefault()
                      document
                        .querySelector('#services')
                        ?.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}