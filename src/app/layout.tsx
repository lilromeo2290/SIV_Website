import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SIV Engineering & Diagnostics Services LTD — Expert Automotive Services & Repairs",
  description:
    "SIV Engineering & Diagnostics Services LTD offers comprehensive automotive repair and maintenance services including engine servicing, electrical work, air conditioning, suspension & braking system repairs, and fleet maintenance. Book your service appointment today.",
  keywords: [
    "auto repair",
    "car service",
    "engine overhaul",
    "air conditioning repair",
    "brake repair",
    "suspension repair",
    "electrical diagnostics",
    "fleet maintenance",
    "mechanical work",
    "transmission repair",
    "periodic maintenance",
  ],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "SIV Engineering & Diagnostics Services LTD — Expert Automotive Services",
    description: "Comprehensive auto repair, engine servicing, and fleet maintenance solutions.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
