"use client";

import { motion } from "framer-motion";
import { Card, CardImage, CardContent, Button, LinkButton } from "@/components/ui";
import { CalendarDaysIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";

const upcomingEvents = [
  {
    id: 1,
    title: "Community Wellness Ride",
    date: "Coming Soon",
    time: "TBA",
    location: "Orlando, FL",
    description:
      "Join us for a community bike ride promoting mental health awareness. All skill levels welcome.",
    image: "/images/event-1.jpg",
    status: "upcoming",
  },
  {
    id: 2,
    title: "Cycling for Mental Health",
    date: "Coming Soon",
    time: "TBA",
    location: "Orlando, FL",
    description:
      "A wellness-focused ride connecting cycling with mental health resources and education.",
    image: "/images/event-2.jpg",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Foundation Fundraiser Ride",
    date: "Coming Soon",
    time: "TBA",
    location: "Orlando, FL",
    description:
      "Support mental health initiatives through our charity cycling event. All proceeds go to mental health programs.",
    image: "/images/event-3.jpg",
    status: "upcoming",
  },
];

const pastEvents = [
  {
    id: 4,
    title: "Inaugural Community Ride",
    date: "2024",
    location: "Orlando, FL",
    description: "Our first community ride bringing together cycling enthusiasts and mental health advocates.",
    image: "/images/past-event-1.jpg",
  },
];

export default function EventsPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 bg-secondary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Events</h1>
            <p className="text-xl text-gray-300">
              Stay in the loop with our exciting cycling events designed to raise
              awareness and foster community support.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-12 text-center"
          >
            Upcoming Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="elevated" className="h-full flex flex-col">
                  <CardImage src={event.image} alt={event.title} />
                  <CardContent className="pt-6 flex-1 flex flex-col">
                    <div className="flex-1">
                      <span className="inline-block px-3 py-1 bg-primary/10 text-primary text-sm font-medium rounded-full mb-3">
                        Upcoming
                      </span>
                      <h3 className="text-xl font-bold text-secondary mb-2">
                        {event.title}
                      </h3>
                      <p className="text-foreground-muted mb-4">
                        {event.description}
                      </p>
                    </div>
                    <div className="space-y-2 text-sm text-gray-medium mb-4">
                      <div className="flex items-center gap-2">
                        <CalendarDaysIcon className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <ClockIcon className="w-4 h-4" />
                        <span>{event.time}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button variant="outline" className="w-full">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Past Events Section */}
      <section className="py-20 bg-background-alt">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-12 text-center"
          >
            Past Events
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {pastEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card variant="bordered" className="h-full">
                  <CardImage src={event.image} alt={event.title} className="grayscale" />
                  <CardContent className="pt-6">
                    <h3 className="text-lg font-bold text-secondary mb-2">
                      {event.title}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-2">
                      {event.description}
                    </p>
                    <p className="text-sm text-gray-medium">
                      {event.date} • {event.location}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Want to Host an Event?</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Partner with us to bring mental health awareness to your community
              through cycling events.
            </p>
            <LinkButton
              href="/contact"
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Contact Us
            </LinkButton>
          </motion.div>
        </div>
      </section>
    </>
  );
}
