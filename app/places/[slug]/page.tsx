"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { ChevronLeft, ChevronRight, MapPin, Clock, Ticket } from "lucide-react";


interface Place {
  slug: string;
  title: string;
  destination: string;
  category: string;
  address: string;
  openingHours: string;
  fees: string;
  notes: string;
  heroImage: string;
  heroCaption: string;
  excerpt: string;
  body: string;
  sources: string;
  tags: string;
}

interface Journey {
  slug: string;
  title: string;
  heroImage: string;
  description: string;
  duration: number;
}

export default function PlaceDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [place, setPlace] = useState<Place | null>(null);
  const [relatedJourneys, setRelatedJourneys] = useState<Journey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    // Fetch place and journeys in parallel
    Promise.all([
      fetch(`/api/places/${slug}`).then((r) => r.json()),
      fetch("/api/journeys").then((r) => r.json()),
    ])
      .then(([placeData, journeysData]) => {
        if (placeData.success && placeData.place) {
          setPlace(placeData.place);
          
          // Filter journeys that include this destination, excluding epic journeys
          const destination = placeData.place.destination?.toLowerCase();
          if (destination && journeysData.journeys) {
            const related = journeysData.journeys.filter((j: any) => {
              const destinations = j.destinations?.toLowerCase() || "";
              const isEpic = j.journeyType === 'epic';
              return destinations.includes(destination) && !isEpic;
            });
            setRelatedJourneys(related);
          }
        } else {
          setError(placeData.error || "Place not found");
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load place");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="bg-background min-h-screen">
        
        <div className="flex justify-center items-center h-[60vh]">
          <div className="w-8 h-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !place) {
    return (
      <div className="bg-background min-h-screen">
        
        <div className="flex flex-col justify-center items-center h-[60vh]">
          <p className="text-muted-foreground mb-4">{error || "Place not found"}</p>
          <Link href="/places" className="text-sm underline">
            Back to Places
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      

      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh]">
        {place.heroImage ? (
          <Image
            src={place.heroImage}
            alt={place.title}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        
        {/* Back button */}
        <div className="absolute top-24 left-6 lg:left-16">
          <Link
            href="/places"
            className="inline-flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="text-sm">All Places</span>
          </Link>
        </div>

        {/* Title overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-16">
          <div className="container mx-auto">
            <p className="text-xs tracking-[0.2em] uppercase text-foreground/70 mb-2 capitalize">
              {place.destination}
            </p>
            <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl text-white mb-4">
              {place.title}
            </h1>
            {place.heroCaption && (
              <p className="text-foreground/70 text-sm max-w-xl">
                {place.heroCaption}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-6 lg:px-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              {/* Excerpt */}
              {place.excerpt && (
                <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed mb-12 font-display italic">
                  {place.excerpt}
                </p>
              )}

              {/* Body */}
              {place.body && (
                <div 
                  className="prose prose-lg max-w-none"
                  dangerouslySetInnerHTML={{ 
                    __html: place.body
                      .replace(/\n\n/g, '</p><p>')
                      .replace(/^/, '<p>')
                      .replace(/$/, '</p>')
                  }}
                />
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-sand p-6 sticky top-24">
                <h3 className="font-serif text-lg mb-6">Visitor Information</h3>
                
                {place.address && (
                  <div className="flex gap-3 mb-4">
                    <MapPin className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Address</p>
                      <p className="text-sm">{place.address}</p>
                    </div>
                  </div>
                )}

                {place.openingHours && (
                  <div className="flex gap-3 mb-4">
                    <Clock className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Hours</p>
                      <p className="text-sm">{place.openingHours}</p>
                    </div>
                  </div>
                )}

                {place.fees && (
                  <div className="flex gap-3 mb-4">
                    <Ticket className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                    <div>
                      <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-1">Entry Fee</p>
                      <p className="text-sm">{place.fees}</p>
                    </div>
                  </div>
                )}

                {place.notes && (
                  <div className="mt-6 pt-6 border-t border-border">
                    <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground mb-2">Tips</p>
                    <p className="text-sm text-muted-foreground">{place.notes}</p>
                  </div>
                )}

                <div className="mt-8">
                  <Link
                    href="/plan-your-trip"
                    className="block w-full bg-foreground text-background text-center py-3 text-xs tracking-[0.15em] uppercase hover:bg-foreground/90 transition-colors"
                  >
                    Include in Your Journey
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Journeys Section - with ample space above */}
      {relatedJourneys.length > 0 && (
        <section className="py-24 md:py-32 bg-sand mt-16">
          <div className="container mx-auto px-6 lg:px-16">
            <div className="text-center mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
                Explore More
              </p>
              <h2 className="text-2xl md:text-3xl tracking-[0.15em] font-light mb-4">
                Related Journeys
              </h2>
              <p className="text-muted-foreground max-w-xl mx-auto">
                Curated routes that pass through {place.destination.charAt(0).toUpperCase() + place.destination.slice(1)}
              </p>
            </div>

            <div className="relative">
              {/* Carousel navigation */}
              <button
                onClick={() => {
                  const container = document.getElementById('related-journeys-carousel');
                  if (container) container.scrollBy({ left: -320, behavior: 'smooth' });
                }}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-10 p-2 bg-background border border-border rounded-full hover:bg-muted transition-colors tap-target hidden md:flex items-center justify-center"
                aria-label="Previous journeys"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <button
                onClick={() => {
                  const container = document.getElementById('related-journeys-carousel');
                  if (container) container.scrollBy({ left: 320, behavior: 'smooth' });
                }}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-10 p-2 bg-background border border-border rounded-full hover:bg-muted transition-colors tap-target hidden md:flex items-center justify-center"
                aria-label="Next journeys"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Carousel container */}
              <div
                id="related-journeys-carousel"
                className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {relatedJourneys.map((journey: any) => (
                  <Link
                    key={journey.slug}
                    href={`/journeys/${journey.slug}`}
                    className="group flex-shrink-0 w-[280px] md:w-[300px] snap-start"
                  >
                    <div className="relative aspect-[3/4] mb-4 overflow-hidden bg-[#e8e0d4]">
                      {journey.heroImage && (
                        <Image
                          src={journey.heroImage}
                          alt={journey.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      )}
                    </div>
                    <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-1">
                      {journey.durationDays || journey.duration} Days
                    </p>
                    <h3 className="font-serif text-lg mb-2 group-hover:opacity-70 transition-opacity">
                      {journey.title}
                    </h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {journey.shortDescription || journey.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>

            <div className="text-center mt-12">
              <Link
                href="/journeys"
                className="text-xs tracking-[0.2em] uppercase border-b border-foreground pb-1 hover:opacity-60 transition-opacity"
              >
                View All Journeys
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Sources */}
      {place.sources && (
        <section className="py-8 border-t border-border">
          <div className="container mx-auto px-6 lg:px-16">
            <p className="text-xs text-muted-foreground">
              <span className="font-medium">Sources:</span> {place.sources}
            </p>
          </div>
        </section>
      )}
    </div>
  );
}
