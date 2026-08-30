import type { Metadata, Viewport } from "next";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { ServiceWorkerRegistration } from "@/components/layout/ServiceWorkerRegistration";
import { QueryProvider } from "@/components/providers/QueryProvider";
import { PerformanceInstrumentation } from "@/components/diagnostics/PerformanceInstrumentation";
import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import { cn } from "@/lib/utils";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "ASTER // Mission Terminal",
  description: "Near-Earth Object monitoring platform.",
  applicationName: "ASTER",
  manifest: "/manifest.json",
  icons: { icon: "/favicon.svg", apple: "/icons/icon.svg" },
  appleWebApp: { capable: true, statusBarStyle: "black-translucent", title: "ASTER" },
  formatDetection: { telephone: false },
};
export const viewport: Viewport = { themeColor: "#05060A", colorScheme: "dark", viewportFit: "cover" };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en" className={cn("dark", spaceGrotesk.variable, ibmPlexMono.variable)}><body className="scanlines grain"><PerformanceInstrumentation /><ServiceWorkerRegistration /><QueryProvider><AppShell>{children}</AppShell></QueryProvider></body></html>; }
