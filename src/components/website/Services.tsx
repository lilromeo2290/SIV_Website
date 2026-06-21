import {
  Wrench,
  Zap,
  Settings,
  Wind,
  Cog,
  Car,
  Disc,
  RefreshCw,
  MonitorDot,
  CalendarCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Service {
  icon: LucideIcon
  name: string
  description: string
}

const services: Service[] = [
  {
    icon: Wrench,
    name: 'Mechanical Work',
    description:
      'Comprehensive mechanical repairs including engine mounts, belts, hoses, gaskets, and general mechanical troubleshooting for all vehicle makes and models.',
  },
  {
    icon: Zap,
    name: 'Electrical Work',
    description:
      'Expert electrical system diagnostics and repairs covering wiring, battery systems, alternators, starters, lighting, and electronic control modules.',
  },
  {
    icon: Settings,
    name: 'Engine Servicing',
    description:
      'Full engine servicing including oil changes, filter replacements, spark plug inspection, fluid top-ups, and comprehensive engine performance tuning.',
  },
  {
    icon: Wind,
    name: 'Air Conditioning Services',
    description:
      'Complete AC system service including refrigerant recharge, compressor repair, condenser cleaning, leak detection, and cabin air filter replacement.',
  },
  {
    icon: Cog,
    name: 'Engine Overhauling',
    description:
      'Complete engine rebuild and overhaul services including piston replacement, cylinder boring, crankshaft grinding, and valve seat reconditioning.',
  },
  {
    icon: Car,
    name: 'Suspension Overhauling',
    description:
      'Full suspension system service including shock absorbers, struts, control arms, bushings, ball joints, and wheel alignment calibration.',
  },
  {
    icon: Disc,
    name: 'Braking System Repairs',
    description:
      'Expert brake services including pad and rotor replacement, brake line repair, caliper service, ABS diagnostics, and brake fluid flushing.',
  },
  {
    icon: RefreshCw,
    name: 'Transmission System Repairs',
    description:
      'Manual and automatic transmission service including fluid changes, clutch replacement, gear rebuilds, and torque converter repairs.',
  },
  {
    icon: MonitorDot,
    name: 'Electronic Diagnostics',
    description:
      'Advanced computerized diagnostics using OBD-II scanners and proprietary tools to identify and resolve complex electronic and sensor issues.',
  },
  {
    icon: CalendarCheck,
    name: 'Periodic Maintenance Services',
    description:
      'Scheduled maintenance packages following manufacturer guidelines to keep your vehicle running at peak performance and prevent costly breakdowns.',
  },
  {
    icon: Truck,
    name: 'Fleet Maintenance Services',
    description:
      'Dedicated fleet management solutions for businesses with multiple vehicles, including priority scheduling, volume discounts, and detailed service reporting.',
  },
]

export function Services() {
  return (
    <section id="services" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            What We Offer
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Our Services
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            From routine maintenance to complex repairs, our certified
            technicians handle it all with precision and care.
          </p>
        </div>

        {/* Service Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => (
            <Card
              key={service.name}
              className="group cursor-default transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent className="pt-0">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <service.icon className="size-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{service.name}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {service.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}