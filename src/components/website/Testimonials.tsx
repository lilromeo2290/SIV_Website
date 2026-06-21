import { Star } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface Testimonial {
  quote: string
  name: string
  vehicle: string
  rating: number
}

const testimonials: Testimonial[] = [
  {
    quote:
      'AutoPro Workshop exceeded all my expectations. They diagnosed an electrical issue that two other shops couldn\'t figure out. The team was professional, transparent about costs, and had my car back to me the same day. Highly recommended!',
    name: 'Michael Richardson',
    vehicle: '2021 BMW 3 Series',
    rating: 5,
  },
  {
    quote:
      'I\'ve been bringing my fleet of 12 delivery vehicles to AutoPro for over two years now. Their fleet maintenance program has significantly reduced our downtime and repair costs. The dedicated account management is a game-changer for our business.',
    name: 'Sarah Chen',
    vehicle: 'Fleet — Mixed Commercial Vehicles',
    rating: 5,
  },
  {
    quote:
      'My AC stopped working in the middle of summer and AutoPro got me in the very next morning. They recharged the system, found a small leak, fixed it, and charged a very fair price. The 12-month warranty gives me great peace of mind.',
    name: 'David Martinez',
    vehicle: '2019 Honda Accord',
    rating: 5,
  },
  {
    quote:
      'After getting a quote from the dealership that was nearly double, I brought my car to AutoPro for a full brake system service. The quality of parts and workmanship was outstanding. They even showed me photos of the worn components before replacing them.',
    name: 'Jennifer Okafor',
    vehicle: '2022 Toyota RAV4',
    rating: 5,
  },
]

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`size-4 ${
            i < rating
              ? 'fill-amber-400 text-amber-400'
              : 'fill-muted text-muted'
          }`}
        />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section id="testimonials" className="py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Testimonials
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            What Our Customers Say
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Don&apos;t just take our word for it — hear from some of our
            satisfied customers.
          </p>
        </div>

        {/* Testimonial Cards */}
        <div className="grid gap-6 md:grid-cols-2">
          {testimonials.map((t) => (
            <Card key={t.name} className="pt-0">
              <CardContent>
                <StarRating rating={t.rating} />
                <p className="my-4 text-sm leading-relaxed text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.vehicle}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}