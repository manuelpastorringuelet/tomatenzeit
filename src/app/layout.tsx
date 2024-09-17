import ServiceWorkerRegistration from "@/components/ServiceWorkerRegistration";
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "TomZeit",
  description: "A simple Pomodoro timer with wellness features",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/icon-192x192.png" />
      </head>
      <body
        className={`${geistSans.variable} antialiased min-h-[100dvh] flex flex-col`}
      >
        <ServiceWorkerRegistration />
        {children}
      </body>
    </html>
  );
}
