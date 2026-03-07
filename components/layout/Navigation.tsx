"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { ExternalLinkButton } from "@/components/ui";

const navItems = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Cycling Club", href: "/cycling-club" },
  { label: "Events", href: "/events" },
  { label: "Contact", href: "/contact" },
  { label: "Mental Health Resources", href: "/mental-health" },
  { label: "Shop", href: "/shop" },
];

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="relative">
      {/* Desktop Navigation */}
      <ul className="hidden lg:flex items-center gap-1">
        {navItems.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className={cn(
                "px-4 py-2 text-sm font-medium transition-colors rounded-lg",
                pathname === item.href
                  ? "text-primary bg-primary/20"
                  : "text-gray-300 hover:text-white hover:bg-white/10"
              )}
            >
              {item.label}
            </Link>
          </li>
        ))}
        <li className="ml-4">
          <ExternalLinkButton
            href="https://www.zeffy.com/en-US/donation-form/"
            target="_blank"
            rel="noopener noreferrer"
            size="sm"
          >
            Donate
          </ExternalLinkButton>
        </li>
      </ul>

      {/* Mobile Menu Button */}
      <button
        type="button"
        className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-label={isOpen ? "Close menu" : "Open menu"}
      >
        {isOpen ? (
          <XMarkIcon className="h-6 w-6" />
        ) : (
          <Bars3Icon className="h-6 w-6" />
        )}
      </button>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-black rounded-xl shadow-lg border border-white/10 py-2 lg:hidden z-50">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    "block px-4 py-2 text-sm font-medium transition-colors",
                    pathname === item.href
                      ? "text-primary bg-primary/20"
                      : "text-gray-300 hover:text-white hover:bg-white/10"
                  )}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li className="px-4 pt-2">
              <ExternalLinkButton
                href="https://www.zeffy.com/en-US/donation-form/"
                target="_blank"
                rel="noopener noreferrer"
                size="sm"
                className="w-full"
              >
                Donate
              </ExternalLinkButton>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
