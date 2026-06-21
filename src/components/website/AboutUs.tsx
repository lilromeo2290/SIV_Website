import { Building2, Award, ShieldCheck, BadgeDollarSign, CheckCircle2 } from 'lucide-react'
import { Separator } from '@/components/ui/separator'

const keyFacts = [
  { icon: Award, label: 'Certified Technicians' },
  { icon: ShieldCheck, label: 'Genuine Parts' },
  { icon: CheckCircle2, label: 'Warranty Guaranteed' },
  { icon: BadgeDollarSign, label: 'Transparent Pricing' },
]

export function AboutUs() {
  return (
    <section id="about" className="py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left Content */}
          <div>
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              About Us
            </p>
            <h2 className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
              About <span className="text-primary">SIV Engineering</span>
            </h2>
            <div className="mb-6 space-y-4 text-muted-foreground leading-relaxed">
              <p>
                Founded in 2009, SIV Engineering & Diagnostics Services LTD has
                grown from a small garage into one of the region&apos;s most
                trusted automotive service centers. With over 15 years of
                experience, we have earned the trust of more than 10,000 vehicle
                owners through consistent quality and reliable service.
              </p>
              <p>
                Our commitment to excellence drives every aspect of our
                operations. We invest in continuous training for our technicians
                and upgrade our equipment regularly to stay at the forefront of
                automotive technology. Every repair we perform is backed by our
                comprehensive 12-month warranty, reflecting our dedication to
                quality engineering and diagnostics.
              </p>
              <p>
                Our team of 50+ ASE-certified technicians uses
                state-of-the-art diagnostic equipment and only installs genuine
                OEM parts. We believe in complete transparency — you&apos;ll
                always receive a detailed quote before any work begins, with no
                hidden costs.
              </p>
            </div>
          </div>

          {/* Right Placeholder Image */}
          <div className="flex items-center justify-center">
            <div className="flex h-72 w-full max-w-md flex-col items-center justify-center rounded-2xl bg-muted sm:h-96">
              <Building2 className="mb-4 size-16 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground/60">Workshop Image</p>
            </div>
          </div>
        </div>

        {/* Key Facts */}
        <Separator className="my-12" />
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
          {keyFacts.map((fact) => (
            <div
              key={fact.label}
              className="flex flex-col items-center gap-3 text-center"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <fact.icon className="size-6" />
              </div>
              <span className="text-sm font-semibold">{fact.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}