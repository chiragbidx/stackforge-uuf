// Root server layout: applies global styles and mounts client-only ErrorReporter.
import type { Metadata } from "next";
import Script from "next/script";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import "./globals.css";
import ErrorReporter from "../components/ErrorReporter";
import { ThemeProvider } from "@/components/theme/theme-provider";

export const metadata: Metadata = {
  title: "Panda - SaaS App Builder Starter",
  description: "Production-ready SaaS app builder starter template with modern UI, dark mode, and launch-ready sections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
    >
      <head>
        {/*
          PANDA ELEMENT SELECTION SCRIPT
          ===============================
          Captures all element clicks inside the iframe and sends metadata to Bubble via postMessage.
          Metadata captured: url, width, height, alt
            ⚠ Do NOT remove or modify this script unless explicitly instructed by the admin.
        */}
        <Script
          src="https://bfwqdadlcyndtaqmqtci.supabase.co/storage/v1/object/public/pandajs/panda-element-selection.js"
          strategy="afterInteractive"
        />
        {/*
          PANDA BRANDING SCRIPT
          ====================
          Handles Panda-specific branding, logos, placeholders, and runtime injection for the iframe/editor.
            ⚠ Do NOT remove or modify this script unless explicitly instructed by the admin.
        */}
        <Script
          src="https://bfwqdadlcyndtaqmqtci.supabase.co/storage/v1/object/public/pandajs/panda-branding.js"
          strategy="afterInteractive"
        />
      </head>
      <body className="font-sans antialiased">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <ErrorReporter />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
