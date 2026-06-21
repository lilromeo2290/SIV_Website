import { Header } from '@/components/website/Header'
import { Hero } from '@/components/website/Hero'
import { AboutUs } from '@/components/website/AboutUs'
import { Services } from '@/components/website/Services'
import { WhyChooseUs } from '@/components/website/WhyChooseUs'
import { Gallery } from '@/components/website/Gallery'
import { Blog } from '@/components/website/Blog'
import { Careers } from '@/components/website/Careers'
import { BookAppointment } from '@/components/website/BookAppointment'
import { QuoteForm } from '@/components/website/QuoteForm'
import { Contact } from '@/components/website/Contact'
import { Footer } from '@/components/website/Footer'
import { WhatsAppButton } from '@/components/website/WhatsAppButton'

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1">
        <Hero />
        <AboutUs />
        <Services />
        <WhyChooseUs />
        <Gallery />
        <Blog />
        <Careers />
        <BookAppointment />
        <QuoteForm />
        <Contact />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}