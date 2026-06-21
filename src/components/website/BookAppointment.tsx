'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, CheckCircle2, MessageCircle, Mail } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const WHATSAPP_NUMBER = '233242266935'
const BUSINESS_EMAIL = 'info@sivgh.com'

const serviceOptions = [
  'Mechanical Work',
  'Electrical Work',
  'Engine Servicing',
  'Air Conditioning Services',
  'Engine Overhauling',
  'Suspension Overhauling',
  'Braking System Repairs',
  'Transmission System Repairs',
  'Electronic Diagnostics',
  'Periodic Maintenance Services',
  'Fleet Maintenance Services',
]

const timeSlots = [
  '8:00 AM',
  '9:00 AM',
  '10:00 AM',
  '11:00 AM',
  '12:00 PM',
  '1:00 PM',
  '2:00 PM',
  '3:00 PM',
  '4:00 PM',
  '5:00 PM',
]

const appointmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(7, 'Please enter a valid phone number'),
  vehicleMake: z.string().min(1, 'Vehicle make is required'),
  vehicleModel: z.string().min(1, 'Vehicle model is required'),
  vehicleYear: z.string().min(4, 'Please enter a valid year'),
  serviceType: z.string().min(1, 'Please select a service type'),
  preferredDate: z.string().min(1, 'Please select a preferred date'),
  preferredTime: z.string().min(1, 'Please select a preferred time'),
  message: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof appointmentSchema>

function buildWhatsAppUrl(data: AppointmentFormValues): string {
  const text = `📅 *SIV Engineering - New Appointment Booking*

*Customer Details:*
• Name: ${data.name}
• Email: ${data.email}
• Phone: ${data.phone}

*Vehicle Information:*
• Make: ${data.vehicleMake}
• Model: ${data.vehicleModel}
• Year: ${data.vehicleYear}

*Appointment Details:*
• Service: ${data.serviceType}
• Date: ${data.preferredDate}
• Time: ${data.preferredTime}${data.message ? `\n\n*Additional Notes:*\n${data.message}` : ''}

---
Submitted via SIV Engineering Website`
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`
}

function buildMailtoUrl(data: AppointmentFormValues): string {
  const subject = `Appointment Booking - ${data.serviceType} - ${data.preferredDate} at ${data.preferredTime}`
  const body = `SIV Engineering & Diagnostics Services LTD - New Appointment Booking\n\nCUSTOMER DETAILS:\n- Name: ${data.name}\n- Email: ${data.email}\n- Phone: ${data.phone}\n\nVEHICLE INFORMATION:\n- Make: ${data.vehicleMake}\n- Model: ${data.vehicleModel}\n- Year: ${data.vehicleYear}\n\nAPPOINTMENT DETAILS:\n- Service: ${data.serviceType}\n- Date: ${data.preferredDate}\n- Time: ${data.preferredTime}${data.message ? `\n\nADDITIONAL NOTES:\n${data.message}` : ''}\n\n---\nSubmitted via SIV Engineering Website`
  return `mailto:${BUSINESS_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
}

export function BookAppointment() {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submittedData, setSubmittedData] = useState<AppointmentFormValues | null>(null)
  const { toast } = useToast()

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      vehicleMake: '',
      vehicleModel: '',
      vehicleYear: '',
      serviceType: '',
      preferredDate: '',
      preferredTime: '',
      message: '',
    },
  })

  async function onSubmit(data: AppointmentFormValues) {
    setLoading(true)
    try {
      const res = await fetch('/api/appointment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        setSubmittedData(data)
        setSubmitted(true)
        toast({
          title: 'Appointment Booked!',
          description:
            'Your appointment has been saved. Send it via WhatsApp or Email below.',
        })
        form.reset()
      } else {
        toast({
          title: 'Something went wrong',
          description: 'Please try again later.',
          variant: 'destructive',
        })
      }
    } catch {
      toast({
        title: 'Network Error',
        description: 'Please check your connection and try again.',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  // Success state — show summary + WhatsApp & Email buttons
  if (submitted && submittedData) {
    const waUrl = buildWhatsAppUrl(submittedData)
    const mailUrl = buildMailtoUrl(submittedData)

    return (
      <section id="appointment" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl">
            <Card className="border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-2">
                <div className="mx-auto mb-3 flex size-16 items-center justify-center rounded-full bg-green-100 text-green-600">
                  <CheckCircle2 className="size-9" />
                </div>
                <CardTitle className="text-2xl text-green-700">
                  Appointment Booked!
                </CardTitle>
                <CardDescription>
                  Your appointment has been saved successfully. Choose how
                  you&apos;d like to send the details to us:
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-2">
                {/* Appointment Summary */}
                <div className="rounded-lg border bg-muted/50 p-4 text-sm space-y-1">
                  <p className="font-semibold text-base">
                    {submittedData.name}
                  </p>
                  <p className="text-muted-foreground">
                    {submittedData.vehicleMake} {submittedData.vehicleModel}{' '}
                    ({submittedData.vehicleYear})
                  </p>
                  <p className="text-muted-foreground">
                    Service:{' '}
                    <span className="font-medium text-foreground">
                      {submittedData.serviceType}
                    </span>
                  </p>
                  <p className="text-muted-foreground">
                    Date:{' '}
                    <span className="font-medium text-foreground">
                      {submittedData.preferredDate}
                    </span>{' '}
                    at{' '}
                    <span className="font-medium text-foreground">
                      {submittedData.preferredTime}
                    </span>
                  </p>
                  {submittedData.message && (
                    <p className="text-muted-foreground italic">
                      &quot;{submittedData.message}&quot;
                    </p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    size="lg"
                    className="gap-2 bg-green-600 text-white hover:bg-green-700"
                    onClick={() => window.open(waUrl, '_blank')}
                  >
                    <MessageCircle className="size-5" />
                    Send via WhatsApp
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="gap-2"
                    onClick={() => window.open(mailUrl, '_blank')}
                  >
                    <Mail className="size-5" />
                    Send via Email
                  </Button>
                </div>

                <Button
                  variant="ghost"
                  className="w-full text-muted-foreground"
                  onClick={() => {
                    setSubmitted(false)
                    setSubmittedData(null)
                  }}
                >
                  Book Another Appointment
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section id="appointment" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-2xl">
          {/* Heading */}
          <div className="mb-10 text-center">
            <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
              Schedule Service
            </p>
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Book a Service Appointment
            </h2>
            <p className="text-muted-foreground">
              Choose your preferred date and time, and we&apos;ll take care of
              the rest.
            </p>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="John Doe" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@example.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleMake"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Make</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Toyota" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleModel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Model</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Camry" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="vehicleYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vehicle Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 2022" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="serviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Service Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {serviceOptions.map((s) => (
                          <SelectItem key={s} value={s}>
                            {s}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-5 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="preferredDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="preferredTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Preferred Time</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a time" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {timeSlots.map((t) => (
                            <SelectItem key={t} value={t}>
                              {t}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Additional Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Any additional information about your vehicle or the issue..."
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
                {loading && <Loader2 className="animate-spin" />}
                {loading ? 'Booking...' : 'Book Appointment'}
              </Button>
            </form>
          </Form>
        </div>
      </div>
    </section>
  )
}
