import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { Header, Footer } from "@/components/layout";
import "./globals.css";

const inter = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keep Pedaling Foundation | Biking for the culture, healing for the soul",
  description:
    "Keep Pedaling Foundation is committed to advancing mental health awareness through the transformative power of cycling. Join our mission to help everyone pedal toward healing and resilience.",
  keywords: [
    "mental health",
    "cycling",
    "cycling club",
    "mental health awareness",
    "community cycling",
    "wellness",
    "charity",
  ],
  openGraph: {
    title: "Keep Pedaling Foundation",
    description: "Biking for the culture, healing for the soul",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
