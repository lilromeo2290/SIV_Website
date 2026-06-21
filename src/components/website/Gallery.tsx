import { ImageIcon } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface GalleryItem {
  category: string
  title: string
}

const galleryItems: GalleryItem[] = [
  { category: 'Engine Repair', title: 'Complete Engine Overhaul — Toyota Camry' },
  { category: 'AC Service', title: 'AC Compressor Replacement — Honda Civic' },
  { category: 'Brake Work', title: 'Full Brake System Upgrade — Ford F-150' },
  { category: 'Electrical', title: 'Wiring Harness Repair — BMW 3 Series' },
  { category: 'Suspension', title: 'Suspension Overhaul — Mercedes C-Class' },
  { category: 'Diagnostics', title: 'Advanced ECU Diagnostics — Audi A4' },
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

        {/* Gallery Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {galleryItems.map((item) => (
            <Card
              key={item.title}
              className="group cursor-default overflow-hidden py-0 transition-transform duration-300 hover:scale-[1.02]"
            >
              <div className="flex h-52 items-center justify-center bg-muted">
                <ImageIcon className="size-12 text-muted-foreground/30" />
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
    </section>
  )
}