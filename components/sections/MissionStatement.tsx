"use client";

import { motion } from "framer-motion";
import { ExternalLinkButton } from "@/components/ui";

export function MissionStatement() {
  return (
    <section className="py-20 bg-background-alt">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-secondary mb-8">
              Pedaling for Mental Health
            </h2>

            <p className="text-lg md:text-xl text-foreground-muted leading-relaxed mb-10">
              At Keep Pedaling Foundation, we are committed to advancing mental health
              awareness and breaking down barriers to support. Through the transformative
              power of cycling, we encourage physical well-being while creating a space
              for individuals to access the vital resources they need. Our mission is to
              help everyone pedal their way toward healing, resilience, and a brighter,
              healthier future.
            </p>

            <ExternalLinkButton
              href="https://www.zeffy.com/en-US/donation-form/"
              target="_blank"
              rel="noopener noreferrer"
              size="lg"
            >
              Support Our Mission
            </ExternalLinkButton>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
