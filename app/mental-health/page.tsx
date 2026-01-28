"use client";

import { motion } from "framer-motion";
import { LinkButton, ExternalLinkButton } from "@/components/ui";
import {
  HeartIcon,
  PhoneIcon,
  AcademicCapIcon,
  UserGroupIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/24/outline";

const resources = [
  {
    name: "BetterHelp",
    description: "Offers professional online counseling with licensed therapists.",
    url: "https://www.betterhelp.com",
    category: "Online Therapy",
  },
  {
    name: "Talkspace",
    description: "Provides online therapy via text, voice, and video messaging.",
    url: "https://www.talkspace.com",
    category: "Online Therapy",
  },
  {
    name: "Alma Therapy",
    description: "Professional online counseling option with qualified therapists.",
    url: "https://helloalma.com",
    category: "Online Therapy",
  },
  {
    name: "7 Cups",
    description: "Free emotional support through trained listeners and online therapy.",
    url: "https://www.7cups.com",
    category: "Counseling",
  },
  {
    name: "NAMI Of Greater Orlando",
    description:
      "Organization of families, friends and individuals whose lives have been affected by mental illness.",
    url: "https://namigo.org",
    category: "Support Organization",
  },
  {
    name: "Aspire Health Partners",
    description: "Florida's largest Behavioral Health Non-Profit offering comprehensive services.",
    url: "https://www.aspirehealthpartners.com",
    category: "Healthcare Provider",
  },
  {
    name: "Awareness Counseling & Consulting Services",
    description: "Serves individuals across all age groups with professional counseling.",
    url: "#",
    category: "Counseling",
  },
];

const quickResources = [
  {
    icon: HeartIcon,
    title: "Self-Care Tips",
    description: "Daily practices to support your mental well-being.",
    items: [
      "Practice mindfulness and meditation",
      "Get regular physical activity",
      "Maintain a consistent sleep schedule",
      "Connect with supportive people",
      "Set realistic goals and expectations",
    ],
  },
  {
    icon: PhoneIcon,
    title: "Crisis Hotlines",
    description: "24/7 support when you need someone to talk to.",
    items: [
      "National Suicide Prevention: 988",
      "Crisis Text Line: Text HOME to 741741",
      "SAMHSA Helpline: 1-800-662-4357",
      "Veterans Crisis Line: 1-800-273-8255",
    ],
  },
  {
    icon: AcademicCapIcon,
    title: "Educational Resources",
    description: "Learn about mental health conditions and treatments.",
    items: [
      "Understanding anxiety and depression",
      "Coping strategies and techniques",
      "When to seek professional help",
      "Supporting loved ones",
    ],
  },
  {
    icon: UserGroupIcon,
    title: "Support Groups",
    description: "Connect with others who understand.",
    items: [
      "Local peer support meetings",
      "Online community forums",
      "Family support groups",
      "Specialized condition groups",
    ],
  },
];

export default function MentalHealthPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Mental Health Resources
            </h1>
            <p className="text-xl text-gray-300">
              Explore a wide range of resources tailored to support your mental
              well-being.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Cycle of Support Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl font-bold mb-6">Cycle of Support Program</h2>
            <p className="text-xl text-white/90 mb-6">
              Our program offers free therapy for one month to selected applicants.
            </p>
            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <p className="text-lg">
                The application window is currently closed, but don&apos;t worry—this
                isn&apos;t the last opportunity. Stay connected for future openings!
              </p>
            </div>
            <LinkButton
              href="/contact"
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Get Notified
            </LinkButton>
          </motion.div>
        </div>
      </section>

      {/* Quick Resources Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-12 text-center"
          >
            Your Mental Health Toolkit
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {quickResources.map((resource, index) => (
              <motion.div
                key={resource.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="bg-background-alt rounded-xl p-6"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <resource.icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-secondary mb-2">
                      {resource.title}
                    </h3>
                    <p className="text-foreground-muted text-sm mb-4">
                      {resource.description}
                    </p>
                    <ul className="space-y-2">
                      {resource.items.map((item) => (
                        <li
                          key={item}
                          className="text-sm text-foreground-muted flex items-start gap-2"
                        >
                          <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* External Resources Section */}
      <section className="py-20 bg-background-alt">
        <div className="container mx-auto px-4">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-secondary mb-4 text-center"
          >
            Professional Resources
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-foreground-muted text-center mb-12 max-w-2xl mx-auto"
          >
            Connect with licensed professionals and trusted organizations for
            personalized support.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {resources.map((resource, index) => (
              <motion.a
                key={resource.name}
                href={resource.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded">
                    {resource.category}
                  </span>
                  <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors" />
                </div>
                <h3 className="text-lg font-semibold text-secondary mb-2 group-hover:text-primary transition-colors">
                  {resource.name}
                </h3>
                <p className="text-foreground-muted text-sm">
                  {resource.description}
                </p>
              </motion.a>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-secondary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">You&apos;re Not Alone</h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Mental health matters. If you or someone you know is struggling,
              please reach out. Help is available.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <ExternalLinkButton
                href="tel:988"
                size="lg"
                className="bg-primary hover:bg-primary-dark"
              >
                Call 988 (Suicide &amp; Crisis Lifeline)
              </ExternalLinkButton>
              <LinkButton
                href="/contact"
                variant="outline"
                size="lg"
                className="border-white text-white hover:bg-white hover:text-secondary"
              >
                Contact Us
              </LinkButton>
            </div>
          </motion.div>
        </div>
      </section>
    </>
  );
}
