import {
  Award,
  MonitorDot,
  BadgeDollarSign,
  Clock,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

interface Feature {
  icon: LucideIcon
  title: string
  description: string
}

const features: Feature[] = [
  {
    icon: Award,
    title: 'Expert Certified Technicians',
    description:
      'All technicians are ASE-certified with years of hands-on experience across all major vehicle brands and models.',
  },
  {
    icon: MonitorDot,
    title: 'State-of-the-Art Equipment',
    description:
      'Latest diagnostic tools and repair equipment ensure accurate troubleshooting and efficient service delivery.',
  },
  {
    icon: BadgeDollarSign,
    title: 'Transparent Pricing',
    description:
      'No hidden costs, upfront quotes before work begins. You know exactly what you are paying for.',
  },
  {
    icon: Clock,
    title: 'Quick Turnaround',
    description:
      'Same-day service for most common repairs. We value your time and get you back on the road fast.',
  },
  {
    icon: Wrench,
    title: 'Genuine Parts Used',
    description:
      'Only OEM and quality-tested parts installed in your vehicle to ensure longevity and reliability.',
  },
  {
    icon: ShieldCheck,
    title: 'Service Warranty',
    description:
      '12-month warranty on all repairs and services. Your satisfaction and peace of mind are guaranteed.',
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-us" className="py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Our Advantages
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Why Choose Us
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We go above and beyond to deliver exceptional service quality and
            customer experience every time.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div key={feature.title} className="flex gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <feature.icon className="size-7" />
              </div>
              <div>
                <h3 className="mb-1.5 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}