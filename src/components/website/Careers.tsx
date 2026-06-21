'use client'

import { Wrench, Zap, HeadphonesIcon } from 'lucide-react'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

const jobs = [
  {
    icon: Wrench,
    title: 'Senior Mechanic',
    description:
      'We are looking for an experienced mechanic with 5+ years of hands-on experience in engine diagnostics, overhauls, and general mechanical repairs. ASE certification preferred.',
    type: 'Full-time',
  },
  {
    icon: Zap,
    title: 'Auto Electrician',
    description:
      'Join our electrical diagnostics team. You will work on advanced vehicle electronics, ECU programming, sensor calibration, and complex wiring systems across various brands.',
    type: 'Full-time',
  },
  {
    icon: HeadphonesIcon,
    title: 'Service Advisor',
    description:
      'We need a customer-focused service advisor to manage appointments, provide detailed quotes, communicate with technicians, and ensure an outstanding customer experience.',
    type: 'Full-time',
  },
]


export function Careers() {
  const { toast } = useToast()

  const handleApply = () => {
    toast({
      title: 'Application Submitted Successfully',
      description:
        'Thank you for your interest! Our HR team will review your application and contact you shortly.',
    })
  }

  return (
    <section id="careers" className="py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Careers
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Join Our Team
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            We are always looking for talented and passionate individuals to
            join our growing team. Check out our open positions below.
          </p>
        </div>

        {/* Job Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {jobs.map((job) => (
            <Card key={job.title} className="pt-0">
              <CardContent>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <job.icon className="size-6" />
                </div>
                <div className="mb-2 flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <span className="rounded-full bg-secondary px-2 py-0.5 text-xs text-muted-foreground">
                    {job.type}
                  </span>
                </div>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {job.description}
                </p>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleApply}
                >
                  Apply Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}