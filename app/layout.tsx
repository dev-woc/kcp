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
  icons: {
    icon: "/logo.jpeg",
    apple: "/logo.jpeg",
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
