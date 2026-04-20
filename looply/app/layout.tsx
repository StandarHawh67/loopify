import type { Metadata } from "next";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Analytics } from "@vercel/analytics/next";

const bodyFont = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body"
});

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display"
});

export const metadata: Metadata = {
  title: "Looply",
  description:
    "Looply is a modern social space for quick thoughts, rich visuals, and meaningful loops between creators and communities."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="dark">
      <body
        className={cn(
          bodyFont.variable,
          displayFont.variable,
          "min-h-screen bg-[#050816] text-ink antialiased"
        )}
      >
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute left-[-12rem] top-[-8rem] h-80 w-80 rounded-full bg-accent/15 blur-3xl" />
          <div className="absolute right-[-10rem] top-1/4 h-72 w-72 rounded-full bg-coral/20 blur-3xl" />
          <div className="absolute bottom-[-10rem] left-1/3 h-80 w-80 rounded-full bg-[#5a7fff]/15 blur-3xl" />
          <div className="absolute inset-0 bg-looply-grid bg-[size:28px_28px] opacity-20" />
        </div>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
