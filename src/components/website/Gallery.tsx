import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GalleryItem {
  image: string
  category: string
  title: string
}

const galleryItems: GalleryItem[] = [
  {
    image: '/gallery/gallery-1.jpeg',
    category: 'Engineering Work',
    title: 'Professional Engineering & Diagnostics',
  },
  {
    image: '/gallery/gallery-2.jpeg',
    category: 'Mechanical Service',
    title: 'Expert Mechanical Repairs & Maintenance',
  },
  {
    image: '/gallery/gallery-3.jpeg',
    category: 'Diagnostic Service',
    title: 'Advanced Vehicle Diagnostics & Testing',
  },
  {
    image: '/gallery/gallery-4.jpeg',
    category: 'Engine Work',
    title: 'Complete Engine Overhaul & Rebuild',
  },
  {
    image: '/gallery/gallery-5.jpeg',
    category: 'Electrical Service',
    title: 'Electrical System Repair & Wiring',
  },
  {
    image: '/gallery/gallery-6.jpeg',
    category: 'Fleet Maintenance',
    title: 'Fleet Vehicle Maintenance & Servicing',
  },
]

export function Gallery() {
  return (
    <section id="gallery" className="bg-muted/50 py-16 md:py-24 px-4 md:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Heading */}
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-primary">
            Our Portfolio
          </p>
          <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Gallery of Our Work
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Browse through some of our recent projects and see the quality of
            work we deliver.
          </p>
        </div>

        {/* Gallery Horizontal Scroll */}
        <div className="relative">
          <div className="flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4 scrollbar-thin" style={{ scrollbarWidth: 'thin' }}>
            {galleryItems.map((item) => (
              <Card
                key={item.title}
                className="group snap-start shrink-0 w-[calc(100%-1.5rem)] sm:w-[calc(50%-1.5rem)] lg:w-[calc(33.333%-1.5rem)] cursor-default overflow-hidden py-0 transition-transform duration-300 hover:scale-[1.02]"
              >
                <div className="relative h-64 overflow-hidden">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <CardContent className="pt-4 pb-6">
                  <Badge variant="secondary" className="mb-2">
                    {item.category}
                  </Badge>
                  <h3 className="text-sm font-semibold">{item.title}</h3>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
