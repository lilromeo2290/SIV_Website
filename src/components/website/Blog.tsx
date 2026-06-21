import { CalendarDays, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const posts = [
  {
    title: '5 Signs Your Car Needs a Brake Inspection',
    date: 'December 10, 2024',
    excerpt:
      'Squeaking noises, a soft brake pedal, or your car pulling to one side? These are all warning signs that your brakes need professional attention. Learn what to watch out for and when to schedule an inspection.',
  },
  {
    title: 'How to Prepare Your Vehicle for Summer',
    date: 'November 28, 2024',
    excerpt:
      'Summer heat can take a toll on your vehicle. From checking your coolant levels to inspecting your AC system, here is our comprehensive guide to getting your car ready for the hot months ahead.',
  },
  {
    title: 'The Importance of Regular Oil Changes',
    date: 'November 15, 2024',
    excerpt:
      'Oil is the lifeblood of your engine. Skipping oil changes can lead to costly repairs down the road. We break down why regular oil changes matter and how often you should get them done.',
  },
]

export function Blog() {
  return (
    <section id="blog" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Blog
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Latest News & Tips
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Stay informed with expert advice, maintenance tips, and the latest
            news from AutoPro Workshop.
          </p>
        </div>

        {/* Blog Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Card
              key={post.title}
              className="group cursor-default transition-shadow duration-300 hover:shadow-lg"
            >
              <CardContent>
                <div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground">
                  <CalendarDays className="size-3.5" />
                  {post.date}
                </div>
                <h3 className="mb-2 text-lg font-semibold leading-snug">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>
                <a
                  href="#"
                  className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors hover:underline"
                >
                  Read More
                  <ArrowRight className="size-4" />
                </a>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}