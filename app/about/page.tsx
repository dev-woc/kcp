"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { ExternalLinkButton } from "@/components/ui";

const founders = [
  {
    name: "Mikenson Deroche",
    role: "Co-Founder",
    location: "Orlando, FL",
    bio: "Emergency Management Consultant from Fort Pierce, FL. Mikenson focuses on mental health support and community engagement, bringing his expertise in crisis management to help build resilient communities.",
    image: "/images/founder-1.jpg",
  },
  {
    name: "Keron Thompson",
    nickname: "Teezy",
    role: "Co-Founder",
    location: "Orlando, FL",
    bio: "Promoter and Event Planner passionate about fitness and inspiring healthy lifestyles. Teezy brings energy and creativity to every event, making cycling accessible and fun for everyone.",
    image: "/images/founder-2.jpg",
  },
  {
    name: "Dimitri Jean-Pierre",
    nickname: "Meech The Insurance Guy",
    role: "Co-Founder",
    location: "Orlando, FL",
    bio: "Health/Life Insurance agent dedicated to helping others and mentoring youth. Dimitri combines his professional expertise with a passion for community service and mental health advocacy.",
    image: "/images/founder-3.jpg",
  },
];

const values = [
  {
    title: "Inclusion",
    description: "Creating a welcoming space for everyone, regardless of background or experience level.",
  },
  {
    title: "Mental Health Advocacy",
    description: "Breaking down stigma and barriers to mental health support through open conversation.",
  },
  {
    title: "Empowerment Through Cycling",
    description: "Using the transformative power of cycling to build confidence and resilience.",
  },
  {
    title: "Community Connection",
    description: "Building meaningful relationships that support mental and physical wellness.",
  },
  {
    title: "Resilience Building",
    description: "Developing the strength to overcome challenges and thrive in difficult times.",
  },
];

export default function AboutPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">About Us</h1>
            <p className="text-xl text-gray-300 italic">
              Biking for the culture, healing for the soul
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold text-secondary mb-6 text-center">
                Our Mission
              </h2>
              <p className="text-lg text-foreground-muted leading-relaxed mb-8">
                Keep Pedaling Foundation is a non-profit dedicated to raising mental
                health awareness through the power of cycling. We aim to establish a
                welcoming community supporting mental and physical wellness by merging
                cycling with mental health advocacy.
              </p>
              <p className="text-lg text-foreground-muted leading-relaxed">
                Our organization was established on the belief that cycling extends
                beyond recreation. The founders transformed personal healing experiences
                into a community mission addressing mental health stigma. We view biking
                as a therapeutic instrument for contemplation, recovery, and cultivating
                supportive relationships.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-background-alt">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-12 text-center"
          >
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-white rounded-xl p-6 shadow-sm"
              >
                <h3 className="text-xl font-semibold text-primary mb-3">
                  {value.title}
                </h3>
                <p className="text-foreground-muted">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Founders Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-12 text-center"
          >
            Meet Our Founders
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {founders.map((founder, index) => (
              <motion.div
                key={founder.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-secondary">
                  {founder.name}
                </h3>
                {founder.nickname && (
                  <p className="text-primary font-medium">&quot;{founder.nickname}&quot;</p>
                )}
                <p className="text-foreground-muted text-sm mb-3">
                  {founder.role} • {founder.location}
                </p>
                <p className="text-foreground-muted text-sm">{founder.bio}</p>
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
            <h2 className="text-3xl font-bold mb-6">Join Our Mission</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Together, we can break down mental health barriers and build a
              healthier, more connected community.
            </p>
            <ExternalLinkButton
              href="https://www.zeffy.com/en-US/donation-form/"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Support Our Mission
            </ExternalLinkButton>
          </motion.div>
        </div>
      </section>
    </>
  );
}
