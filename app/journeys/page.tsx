"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { useCurrency } from "@/lib/currency";
import PageBanner from "@/components/PageBanner";

export default function JourneysPage() {
  const [journeys, setJourneys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState("all");
  const { format } = useCurrency();

  const filters = [
    { id: "all", label: "All Journeys" },
    { id: "desert", label: "Desert" },
    { id: "mountains", label: "Mountains" },
    { id: "culture", label: "Culture" },
    { id: "coast", label: "Coast" },
  ];

  useEffect(() => {
    fetch("/api/journeys")
      .then((r) => r.json())
      .then((data) => {
        const all = data.journeys || [];
        const regular = all.filter((j: any) => j.journeyType !== "epic");
        setJourneys(regular);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const filteredJourneys =
    activeFilter === "all"
      ? journeys
      : journeys.filter((j) =>
          j.focus?.toLowerCase().includes(activeFilter.toLowerCase())
        );

  return (
    <div className="bg-background min-h-screen">
      {/* Immersive Hero Banner */}
      <PageBanner
        slug="journeys"
        fallback={{
          title: "Routes worth taking",
          subtitle: "Every journey is private and fully customizable. Choose a starting point, then we'll shape it around what matters to you.",
          label: "Journeys",
        }}
      />

      {/* Filters */}
      <section className="py-6 border-b border-border sticky top-20 md:top-24 bg-background z-40">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          <div className="flex items-center gap-6 overflow-x-auto scrollbar-hide">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`text-[11px] tracking-[0.15em] uppercase whitespace-nowrap pb-1 transition-colors ${
                  activeFilter === filter.id
                    ? "text-foreground border-b border-foreground"
                    : "text-foreground/40 hover:text-foreground/70"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Journeys List - Stacked Layout */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-8 md:px-16 lg:px-20">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border border-foreground/20 border-t-foreground/60 rounded-full animate-spin" />
            </div>
          ) : filteredJourneys.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-foreground/50 mb-4">No journeys match your filter.</p>
              <button
                onClick={() => setActiveFilter("all")}
                className="text-sm underline text-foreground/60 hover:text-foreground transition-colors"
              >
                View all journeys
              </button>
            </div>
          ) : (
            <div className="space-y-20 md:space-y-32">
              {filteredJourneys.map((journey: any, index: number) => (
                <Link
                  key={journey.slug}
                  href={`/journeys/${journey.slug}`}
                  className="group block"
                >
                  <div
                    className={`flex flex-col ${
                      index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                    } gap-8 md:gap-16 items-start`}
                  >
                    {/* Image */}
                    <div className="w-full md:w-3/5">
                      <div className="aspect-[4/3] relative overflow-hidden bg-[#d4cdc4]">
                        {journey.heroImage && (
                          <Image
                            src={journey.heroImage}
                            alt={journey.title}
                            fill
                            className="object-cover group-hover:scale-[1.02] transition-transform duration-700"
                          />
                        )}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="w-full md:w-2/5 md:py-8">
                      <div className="flex items-center gap-4 mb-4">
                        <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">
                          {journey.durationDays} Days
                        </p>
                        {journey.focus && (
                          <>
                            <span className="w-1 h-1 rounded-full bg-foreground/20" />
                            <p className="text-[10px] tracking-[0.3em] uppercase text-foreground/40">
                              {journey.focus}
                            </p>
                          </>
                        )}
                      </div>

                      <h2 className="font-serif text-2xl md:text-3xl lg:text-4xl mb-4 group-hover:text-foreground/70 transition-colors">
                        {journey.title}
                      </h2>

                      <p className="text-sm text-foreground/60 leading-relaxed mb-6 line-clamp-3">
                        {journey.description}
                      </p>

                      {journey.destinations && (
                        <p className="text-[11px] tracking-[0.1em] text-foreground/40 mb-6">
                          {journey.destinations}
                        </p>
                      )}

                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-2 text-xs tracking-[0.15em] uppercase">
                          <span className="border-b border-foreground/30 pb-0.5 group-hover:border-foreground transition-colors">
                            View journey
                          </span>
                          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                        </span>

                        {Number(journey.price) > 0 && (
                          <p className="text-sm text-foreground/50">
                            From{" "}
                            <span className="text-foreground">
                              {format(Number(journey.price))}
                            </span>
                            <span className="text-foreground/40 text-xs ml-1">
                              /person
                            </span>
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 md:py-32 bg-[#1a1916] text-white">
        <div className="container mx-auto px-8 md:px-16 lg:px-20 text-center max-w-2xl">
          <h2 className="font-serif text-3xl md:text-4xl mb-6">
            Looking for something different?
          </h2>
          <p className="text-foreground/50 leading-relaxed mb-10 text-sm">
            These are starting points, not scripts. Tell us what matters to
            you—we'll shape a route around it.
          </p>
          <Link
            href="/plan-your-trip"
            className="inline-block bg-white text-[#1a1916] px-10 py-4 text-xs tracking-[0.15em] uppercase hover:bg-white/90 transition-colors"
          >
            Start the conversation
          </Link>
        </div>
      </section>
    </div>
  );
}
