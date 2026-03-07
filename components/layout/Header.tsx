"use client";

import Link from "next/link";
import Image from "next/image";
import { Navigation } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full bg-black border-b border-white/10">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative w-12 h-12">
              <Image
                src="/images/logo.png"
                alt="Keep Pedaling Foundation"
                fill
                className="object-contain"
                priority
              />
            </div>
            <span className="hidden sm:block font-bold text-lg text-white">
              Keep Pedaling Foundation
            </span>
          </Link>

          {/* Navigation */}
          <Navigation />
        </div>
      </div>
    </header>
  );
}
