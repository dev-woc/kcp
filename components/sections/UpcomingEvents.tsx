"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui";
import { Card, CardImage, CardContent } from "@/components/ui";
import { CalendarDaysIcon, MapPinIcon } from "@heroicons/react/24/outline";

const events = [
  {
    id: 1,
    title: "Community Ride",
    date: "Coming Soon",
    location: "TBA",
    image: "/images/event-1.jpg",
    description: "Join us for a community bike ride promoting mental health awareness.",
  },
  {
    id: 2,
    title: "Cycling for Wellness",
    date: "Coming Soon",
    location: "TBA",
    image: "/images/event-2.jpg",
    description: "A wellness-focused ride connecting cycling with mental health resources.",
  },
  {
    id: 3,
    title: "Foundation Fundraiser",
    date: "Coming Soon",
    location: "TBA",
    image: "/images/event-3.jpg",
    description: "Support mental health initiatives through our charity cycling event.",
  },
];

export function UpcomingEvents() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Upcoming Events
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Stay in the loop with our exciting cycling events designed to raise
            awareness and foster community support. Whether you&apos;re a seasoned
            rider or a beginner, we have rides for everyone.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {events.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Card variant="elevated" className="h-full">
                <CardImage src={event.image} alt={event.title} />
                <CardContent className="pt-6">
                  <h3 className="text-xl font-bold text-secondary mb-2">
                    {event.title}
                  </h3>
                  <p className="text-foreground-muted mb-4">
                    {event.description}
                  </p>
                  <div className="space-y-2 text-sm text-gray-medium">
                    <div className="flex items-center gap-2">
                      <CalendarDaysIcon className="w-4 h-4" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{event.location}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <LinkButton href="/events" variant="outline" size="lg">
            See All Events
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
