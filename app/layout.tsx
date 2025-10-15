import type { Metadata } from "next";
import { Rajdhani } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const rajdhani = Rajdhani({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Keep Pedaling Foundation - Cycle of Support",
  description: "Free therapy program for individuals in need",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Keep Pedaling Foundation",
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: "/logo_new.png",
    apple: "/icon-192x192.png",
  },
  themeColor: "#22c55e",
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${rajdhani.variable} antialiased`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
