"use client";

import { motion } from "framer-motion";
import { ExternalLinkButton } from "@/components/ui";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";

export default function ShopPage() {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Shop</h1>
            <p className="text-xl text-gray-300">
              Support the Keep Pedaling Foundation by purchasing merchandise and
              tickets to our events.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="bg-background-alt rounded-2xl p-12">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  className="w-10 h-10 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-secondary mb-4">
                Visit Our Store
              </h2>
              <p className="text-foreground-muted mb-8">
                Browse our collection of merchandise and event tickets on our
                partner platform. All proceeds support mental health initiatives
                and community cycling programs.
              </p>
              <ExternalLinkButton
                href="https://www.zeffy.com/en-US/ticketing/7e60e475-a607-4ef2-8e5c-e2b98924ca31"
                target="_blank"
                rel="noopener noreferrer"
                size="lg"
                className="inline-flex items-center gap-2"
              >
                Shop Now
                <ArrowTopRightOnSquareIcon className="w-5 h-5" />
              </ExternalLinkButton>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Donation Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold mb-6">Make a Direct Donation</h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Prefer to donate directly? Your contribution helps us continue our
              mission of mental health awareness through cycling.
            </p>
            <ExternalLinkButton
              href="https://www.zeffy.com/en-US/donation-form/"
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 inline-flex items-center gap-2"
            >
              Donate Now
              <ArrowTopRightOnSquareIcon className="w-5 h-5" />
            </ExternalLinkButton>
          </motion.div>
        </div>
      </section>
    </>
  );
}
