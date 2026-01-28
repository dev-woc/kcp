"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui";
import {
  HeartIcon,
  PhoneIcon,
  BookOpenIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

const resources = [
  {
    icon: HeartIcon,
    title: "Self-Care Tips",
    description: "Learn practical strategies for maintaining your mental well-being.",
  },
  {
    icon: PhoneIcon,
    title: "Crisis Hotlines",
    description: "Access 24/7 support lines when you need someone to talk to.",
  },
  {
    icon: BookOpenIcon,
    title: "Educational Materials",
    description: "Understand mental health conditions and treatment options.",
  },
  {
    icon: UserGroupIcon,
    title: "Support Groups",
    description: "Connect with others who share similar experiences.",
  },
];

export function MentalHealthResources() {
  return (
    <section className="py-20 bg-background-alt">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-4">
            Your Mental Health Toolkit
          </h2>
          <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
            Explore a wide range of resources tailored to support your mental well-being.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {resources.map((resource, index) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="bg-white rounded-xl p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <resource.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-secondary mb-2">
                {resource.title}
              </h3>
              <p className="text-foreground-muted text-sm">
                {resource.description}
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <LinkButton href="/mental-health" size="lg">
            View Resources
          </LinkButton>
        </div>
      </div>
    </section>
  );
}
