import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/header";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "@/components/ui/toaster";
import Footer from "@/components/footer";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Analyzr - Real-time Analytics for Modern Applications",
  description:
    "Privacy-focused website analytics and event tracking tool for developers. Monitor user journeys, capture custom events, and get real-time insights with customizable tracking and Discord notifications.",
  keywords: [
    "web analytics",
    "event tracking",
    "real-time analytics",
    "developer tools",
    "privacy focused",
    "website monitoring",
    "user tracking",
    "discord notifications",
    "performance insights",
  ],
  authors: [
    {
      name: "Arjun",
      url: "https://github.com/arjuncodess",
    },
  ],
  creator: "Arjun",
  publisher: "Analyzr",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://getanalyzr.vercel.app",
    title: "Analyzr - Real-time Analytics for Modern Applications",
    description:
      "Privacy-focused website analytics and event tracking tool for developers. Monitor user journeys, capture custom events, and get real-time insights.",
    siteName: "Analyzr",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Analyzr - Real-time Analytics",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Analyzr - Real-time Analytics for Modern Applications",
    description:
      "Privacy-focused website analytics and event tracking tool for developers",
    creator: "@arjuncodess",
    images: ["/og.png"],
  },
  icons: {
    icon: "/favicon.ico",
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
        className={`bg-gradient-to-b from-black to-neutral-950 text-neutral-50 ${inter.className} antialiased`}
      >
        <Header />
        {children}
        <Analytics />
        <Toaster />
        <Footer />

        <Script
          defer
          data-domain="getanalyzr.vercel.app"
          src="https://getanalyzr.vercel.app/tracking-script.js"
        />
      </body>
    </html>
  );
}
