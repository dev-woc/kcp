"use client";

import { motion } from "framer-motion";
import { LinkButton } from "@/components/ui";

export function JoinCyclingClub() {
  return (
    <section className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Join Our Cycling Club
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Become part of a community that&apos;s passionate about cycling and
              committed to supporting mental health. Connect with like-minded
              individuals, participate in group rides, and make a difference
              while staying active.
            </p>
            <LinkButton
              href="/cycling-club"
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100"
            >
              Join Now
            </LinkButton>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-video rounded-2xl overflow-hidden">
              <img
                src="/images/cycling-club.jpg"
                alt="Keep Pedaling Cycling Club"
                className="w-full h-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
